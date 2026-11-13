// Vigil on Unity's service worker (build e95f529d23fd): unseals each file of the Unity player with the content key,
// itself unsealed with the password's key the gate keeps; keeps the sealed copies by hash for offline play.
const BUILD = "e95f529d23fd";
/** Each file: its content type, the SHA-256 of its sealed copy (enc/<path>), 1 when gzipped before sealing, how many
 * parts it is sent up in, and its size as served (its Content-Length, so the loader can show its progress); a file in
 * parts (enc/<path>.0, .1, …) has each part's hash and gzip flag in a list. */
const FILES = {"Build/WebGPU.data":["application/octet-stream",["5bdb0df9df51b8ee74f71e43540b484b22ce4bb1328fa448f7ae2340c8ce6c42","0919d7fc6d0a1caee930e8e45b2577dbf807c43e9e54c9496d721b0969b03351","23bc20879a6f4517680332afa2416053463eaac09d5f94af1171106c83a65534"],[1,1,1],3,243044986],"Build/WebGPU.framework.js":["text/javascript","46ef1840548b7a65984c3fcdd51a8c42b2d542ba4135bfce1c79465c7949b1f4",1,1,524884],"Build/WebGPU.loader.js":["text/javascript","66f8215e0487d0c5d8c32764486d508d319e6edbca215077fa4033dfd702cdcb",1,1,19568],"Build/WebGPU.wasm":["application/wasm","ec63cd6a29b56141c7e044fa85a2c6fe2487fe018b2f4450206eb5e4c5a0da2d",1,1,62308760]};
const PAGE = 'unity-vigil-build-' + BUILD;
/** The app's plain files: fresh when online, kept for offline (the installed app opens on the gate). */
const GATE = ['manifest.webmanifest', 'gate-font.ttf', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'icon-512-maskable.png'];
const STORE = 'unity-vigil-files';
/** The raw bytes of each part but the last, of a file in parts. */
const PART = 83886080;
let key = null;

const at = (path) => new URL(path, self.registration.scope).href;
const MB = (n) => (n / 1048576).toFixed(1) + ' MB';
/** A step of the boot, in the worker's console and posted to the pages it serves (the player logs it as its own). */
function log(text) {
  console.log('Vigil worker: ' + text);
  self.clients
    .matchAll({ includeUncontrolled: true })
    .then((all) => all.forEach((c) => c.postMessage({ vigilLog: text })))
    .catch(() => {});
}
const sealedAt = (path) => at('enc/' + path) + '?h=' + FILES[path][1];
const partAt = (path, k) => at('enc/' + path + '.' + k) + '?h=' + FILES[path][1][k];
const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const hex = async (data) =>
  Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', data)), (b) => b.toString(16).padStart(2, '0')).join('');

self.addEventListener('install', (e) => {
  log('installing build ' + BUILD);
  e.waitUntil((async () => {
    const page = await caches.open(PAGE);
    for (const path of ['play.html', 'lock.json', './']) {
      const res = await fetch(at(path), { cache: 'reload' });
      if (!res.ok) throw new Error(res.status + ' ' + path);
      await page.put(at(path), res);
    }
    await Promise.all(GATE.map(async (path) => {
      try {
        const res = await fetch(at(path), { cache: 'reload' });
        if (res.ok) await page.put(at(path), res);
      } catch {}
    }));
    // Nothing here keeps state a new build could break: take over at once.
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const name of await caches.keys())
      if (name.startsWith('unity-vigil-build-') && name !== PAGE) await caches.delete(name);
    const store = await caches.open(STORE);
    const wanted = new Set(
      Object.keys(FILES).flatMap((p) =>
        FILES[p][3] > 1 ? FILES[p][1].map((_, k) => partAt(p, k)) : [sealedAt(p)],
      ),
    );
    for (const request of await store.keys()) if (!wanted.has(request.url)) await store.delete(request);
    await self.clients.claim();
    log('build ' + BUILD + ' active');
  })());
});

self.addEventListener('message', (e) => {
  if (e.data === 'lock') key = null;
});

function idb() {
  return new Promise((res) => {
    const r = indexedDB.open('unity-vigil-lock', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('k');
    r.onerror = () => res(null);
    r.onsuccess = () => {
      const q = r.result.transaction('k', 'readonly').objectStore('k').get('key');
      q.onsuccess = () => res(q.result || null);
      q.onerror = () => res(null);
    };
  });
}

/** The content key, or 'gate' (no password kept, or it no longer opens this build) or 'offline'. */
async function buildKey(check = false) {
  if (key && !check) return key;
  const kek = await idb();
  if (!kek) {
    log('no password kept: back to the gate');
    return (key = null), 'gate';
  }
  if (key) return key;
  const page = await caches.open(PAGE);
  let lock;
  try {
    let res = await page.match(at('lock.json'));
    if (!res) {
      res = await fetch(at('lock.json'), { cache: 'no-store' });
      if (!res.ok) throw new Error(res.status);
      await page.put(at('lock.json'), res.clone());
    }
    lock = await res.json();
  } catch (err) {
    log('lock.json unreachable (' + err + '): offline');
    return 'offline';
  }
  try {
    const sealed = b64(lock.key);
    const raw = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: sealed.slice(0, 12) }, kek, sealed.slice(12));
    key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
    log('build key unsealed');
    return key;
  } catch {
    log('the kept password does not open build ' + BUILD + ': back to the gate');
    return 'gate';
  }
}

/** A sealed file (or part k of one in parts), from the store, else fetched and checked against its hash. */
async function sealed(path, k = -1) {
  const store = await caches.open(STORE);
  const url = k < 0 ? sealedAt(path) : partAt(path, k);
  const want = k < 0 ? FILES[path][1] : FILES[path][1][k];
  const name = path + (k < 0 ? '' : ' part ' + (k + 1) + ' of ' + FILES[path][3]);
  const hit = await store.match(url);
  if (hit) {
    log(name + ': kept copy');
    return hit.arrayBuffer();
  }
  // Past the browser's HTTP cache (GitHub keeps a file ten minutes): a stale copy is fetched once more, then refused.
  for (const cache of ['no-cache', 'reload']) {
    const started = Date.now();
    log(name + ': downloading');
    const res = await fetch(url, { cache });
    if (!res.ok) throw new Error(res.status + ' ' + name);
    const data = await download(res, name, started);
    if ((await hex(data)) === want) {
      log(name + ': ' + MB(data.byteLength) + ' in ' + ((Date.now() - started) / 1000).toFixed(1) + ' s, checked');
      await store.put(url, new Response(data));
      return data;
    }
    log(name + ': not the copy this build sealed (a stale one)' + (cache === 'no-cache' ? ', fetching again' : ''));
  }
  throw new Error(path + ' is not the file build ' + BUILD + ' sealed (a stale copy)');
}

/** A response's bytes, read with its progress logged every 8 MB (or 5 seconds). */
async function download(res, name, started) {
  if (!res.body) return res.arrayBuffer();
  const total = Number(res.headers.get('Content-Length')) || 0;
  const reader = res.body.getReader();
  // Into one buffer of the size the server gives, so a part is never held twice (a phone's worker has little memory);
  // what overflows it (a server that compressed it on the way) is kept aside.
  const whole = new Uint8Array(total);
  const chunks = [];
  let filled = 0;
  let got = 0;
  let told = 0;
  let toldAt = Date.now();
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (chunks.length === 0 && filled + value.byteLength <= total) {
      whole.set(value, filled);
      filled += value.byteLength;
    } else chunks.push(value);
    got += value.byteLength;
    if (got - told >= 8 * 1048576 || Date.now() - toldAt > 5000) {
      told = got;
      toldAt = Date.now();
      const rate = got / Math.max(0.001, (toldAt - started) / 1000);
      log(name + ': ' + MB(got) + (total ? ' of ' + MB(total) : '') + ' (' + MB(rate) + '/s)');
    }
  }
  if (chunks.length === 0 && filled === total) return whole.buffer;
  const data = new Uint8Array(got);
  data.set(whole.subarray(0, filled));
  let at = filled;
  for (const c of chunks) {
    data.set(c, at);
    at += c.byteLength;
  }
  return data.buffer;
}

/** One sealed piece unsealed: its bytes, gunzipped when they were gzipped before sealing (a stream). */
async function unseal(k, data, aad, gz) {
  const bytes = new Uint8Array(data);
  const plain = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: bytes.subarray(0, 12), additionalData: new TextEncoder().encode(aad) },
    k,
    bytes.subarray(12),
  );
  return gz ? new Blob([plain]).stream().pipeThrough(new DecompressionStream('gzip')) : new Blob([plain]).stream();
}

/** A file in parts, unsealed part by part and streamed in order, so no one piece holds the whole. */
function partsStream(k, path) {
  const file = FILES[path];
  let next = 0;
  let reader = null;
  return new ReadableStream({
    async pull(controller) {
      try {
        await more(controller);
      } catch (err) {
        log(path + ': failed: ' + err);
        controller.error(err);
      }
    },
  });
  async function more(controller) {
      for (;;) {
        if (!reader) {
          if (next >= file[3]) {
            log(path + ': every part handed over');
            controller.close();
            return;
          }
          const n = next++;
          reader = (await unseal(k, await sealed(path, n), path + '#' + n, file[2][n])).getReader();
          log(path + ' part ' + (n + 1) + ' of ' + file[3] + ': unsealed, handing it over');
        }
        const { done, value } = await reader.read();
        if (!done) {
          controller.enqueue(value);
          return;
        }
        reader = null;
      }
  }
}

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  const scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  const path = decodeURIComponent(url.pathname.slice(scope.pathname.length));
  if (path === 'play.html') {
    e.respondWith((async () => {
      const k = await buildKey(true);
      if (k === 'gate') return Response.redirect(at('./'), 302);
      const page = await caches.open(PAGE);
      return (await page.match(at('play.html'))) || fetch(e.request);
    })());
    return;
  }
  const gate = path === '' || path === 'index.html' ? './' : GATE.includes(path) ? path : null;
  if (gate) {
    e.respondWith((async () => {
      const page = await caches.open(PAGE);
      try {
        // Past the browser's HTTP cache (GitHub lets it keep a page ten minutes): an old gate would open the player
        // before a new build's worker had taken over, so an installed app ran the build it had.
        const res = await fetch(at(gate), { cache: 'no-cache' });
        if (res.ok) await page.put(at(gate), res.clone());
        return res;
      } catch {
        return (await page.match(at(gate))) || Response.error();
      }
    })());
    return;
  }
  const file = FILES[path];
  if (!file) return;
  // A file in parts can be asked for part by part (the player's page does, for Unity's data): `?parts` says how many
  // and how large, `?part=k` is part k unsealed. Each is a short answer, where Safari can cut a worker's response that
  // streams hundreds of MB over minutes.
  if (url.searchParams.has('parts')) {
    e.respondWith(
      new Response(JSON.stringify({ parts: file[3], size: file[4] }), {
        headers: { 'Content-Type': 'application/json' },
      }),
    );
    return;
  }
  if (url.searchParams.has('part') && file[3] > 1) {
    const n = Number(url.searchParams.get('part'));
    e.respondWith((async () => {
      const name = path + ' part ' + (n + 1) + ' of ' + file[3];
      const k = await buildKey();
      if (typeof k === 'string') {
        log(name + ': locked (' + k + ')');
        return new Response('Locked', { status: 401 });
      }
      try {
        const body = await unseal(k, await sealed(path, n), path + '#' + n, file[2][n]);
        const size = n < file[3] - 1 ? PART : file[4] - PART * (file[3] - 1);
        log(name + ': unsealed, handing it over');
        return new Response(body, { headers: { 'Content-Type': file[0], 'Content-Length': String(size) } });
      } catch (err) {
        log(name + ': failed: ' + err);
        return new Response(String(err), { status: 502 });
      }
    })());
    return;
  }
  e.respondWith((async () => {
    log(path + ': asked for (' + MB(file[4]) + (file[3] > 1 ? ', in ' + file[3] + ' parts' : '') + ')');
    const k = await buildKey();
    if (typeof k === 'string') {
      log(path + ': locked (' + k + ')');
      return new Response('Locked', { status: 401 });
    }
    try {
      const body = file[3] > 1 ? partsStream(k, path) : await unseal(k, await sealed(path), path, file[2]);
      if (file[3] <= 1) log(path + ': unsealed, handing it over');
      return new Response(body, { headers: { 'Content-Type': file[0], 'Content-Length': String(file[4]) } });
    } catch (err) {
      log(path + ': failed: ' + err);
      console.error('Vigil on Unity: ' + path + ': ' + err);
      return new Response(String(err), { status: 502 });
    }
  })());
});

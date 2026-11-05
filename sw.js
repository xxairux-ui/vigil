// Vigil's service worker (build e746c0cfbe56): unseals each game file with this build's key, itself unsealed with
// the password's key the gate keeps; keeps the sealed copies for playing offline.
const BUILD = "e746c0cfbe56";
const FILES = {"app/three-D8CUllL4.js":"text/javascript","app/three-vrm.module-Cs0zU7vX.js":"text/javascript","app/vigil-BkMR0Bdc.js":"text/javascript","assets/audio/manifest.json":"application/json","assets/audio/music/music-boss-b.mp3":"audio/mpeg","assets/audio/music/music-combat-a.mp3":"audio/mpeg","assets/audio/music/music-combat-b.mp3":"audio/mpeg","assets/audio/music/music-sanctuary-b.mp3":"audio/mpeg","assets/audio/music/music-title-b.mp3":"audio/mpeg","assets/audio/pack-Mage.mp3":"audio/mpeg","assets/audio/pack-archer.mp3":"audio/mpeg","assets/audio/pack-drops.mp3":"audio/mpeg","assets/audio/pack-enemies.mp3":"audio/mpeg","assets/audio/pack-environment.mp3":"audio/mpeg","assets/audio/pack-hero-feedback.mp3":"audio/mpeg","assets/audio/pack-hero-voice.mp3":"audio/mpeg","assets/audio/pack-ilyra-abilities.mp3":"audio/mpeg","assets/audio/pack-inventory.mp3":"audio/mpeg","assets/audio/pack-knight-abilities.mp3":"audio/mpeg","assets/audio/pack-library-enemies.mp3":"audio/mpeg","assets/audio/pack-progression.mp3":"audio/mpeg","assets/audio/pack-rift.mp3":"audio/mpeg","assets/audio/pack-seamstress-abilities.mp3":"audio/mpeg","assets/audio/pack-title.mp3":"audio/mpeg","assets/audio/pack-ui.mp3":"audio/mpeg","assets/biomes/CathedralCrypt.gltf.json":"application/json","assets/biomes/CathedralDressing.gltf.json":"application/json","assets/biomes/CathedralStructure.gltf.json":"application/json","assets/biomes/CathedralSurroundings.gltf.json":"application/json","assets/biomes/UnwrittenHours.gltf.json":"application/json","assets/biomes/figures/merchant.gltf.json":"application/json","assets/biomes/flooded-cathedral.gltf.json":"application/json","assets/biomes/lite/CathedralCrypt.gltf.json":"application/json","assets/biomes/lite/CathedralDressing.gltf.json":"application/json","assets/biomes/lite/CathedralStructure.gltf.json":"application/json","assets/biomes/lite/CathedralSurroundings.gltf.json":"application/json","assets/biomes/lite/UnwrittenHours.gltf.json":"application/json","assets/biomes/lite/flooded-cathedral.gltf.json":"application/json","assets/biomes/lite/index.json":"application/json","assets/biomes/lite/observatory-missing-stars.gltf.json":"application/json","assets/biomes/lite/orchard-unlived-years-a.gltf.json":"application/json","assets/biomes/lite/orchard-unlived-years-b.gltf.json":"application/json","assets/biomes/manifest.json":"application/json","assets/biomes/observatory-missing-stars.gltf.json":"application/json","assets/biomes/orchard-unlived-years-a.gltf.json":"application/json","assets/biomes/orchard-unlived-years-b.gltf.json":"application/json","assets/biomes/textures/BrassInlay.webp":"image/webp","assets/biomes/textures/FloorDecals.webp":"image/webp","assets/biomes/textures/GrimeOverlay.webp":"image/webp","assets/biomes/textures/MistWisp.webp":"image/webp","assets/biomes/textures/MossLitter.webp":"image/webp","assets/biomes/textures/Motes.webp":"image/webp","assets/enemies/horde/amber-vestal.gltf.json":"application/json","assets/enemies/horde/anchor-knight.gltf.json":"application/json","assets/enemies/horde/archivist.gltf.json":"application/json","assets/enemies/horde/bellows-penitent.gltf.json":"application/json","assets/enemies/horde/bookbinder.gltf.json":"application/json","assets/enemies/horde/bramble.gltf.json":"application/json","assets/enemies/horde/brine-witness.gltf.json":"application/json","assets/enemies/horde/crucible-warden.gltf.json":"application/json","assets/enemies/horde/graft-warden.gltf.json":"application/json","assets/enemies/horde/hollow-navigator.gltf.json":"application/json","assets/enemies/horde/index.gltf.json":"application/json","assets/enemies/horde/marginalia.gltf.json":"application/json","assets/enemies/horde/misprint.gltf.json":"application/json","assets/enemies/horde/mossback.gltf.json":"application/json","assets/enemies/horde/porcelain-surveyor.gltf.json":"application/json","assets/enemies/horde/redactor.gltf.json":"application/json","assets/enemies/horde/rime-bailiff.gltf.json":"application/json","assets/enemies/horde/sap-glob.gltf.json":"application/json","assets/enemies/horde/sap-wasp.gltf.json":"application/json","assets/enemies/horde/sapmother.gltf.json":"application/json","assets/enemies/horde/scrivener.gltf.json":"application/json","assets/enemies/horde/seedling.gltf.json":"application/json","assets/enemies/horde/unlived.gltf.json":"application/json","assets/enemies/horde/unwritten-hour.gltf.json":"application/json","assets/enemies/horde/verdict-keeper.gltf.json":"application/json","assets/enemies/horde/widow-matriarch.gltf.json":"application/json","assets/enemies/meta.json":"application/json","assets/heroes/lite/archer.gltf.json":"application/json","assets/heroes/lite/ilyra.gltf.json":"application/json","assets/heroes/lite/knight.gltf.json":"application/json","assets/heroes/lite/seamstress.gltf.json":"application/json","assets/heroes/props/moon-bow.gltf.json":"application/json","assets/heroes/vrm/arin.gltf.json":"application/json","assets/ui/art-pack-1.json":"application/json","assets/ui/art-packs.json":"application/json","assets/ui/fonts/Cinzel-SemiBold.ttf":"font/ttf","assets/ui/fonts/CrimsonPro-Medium.ttf":"font/ttf","assets/ui/fonts/CrimsonPro-SemiBold.ttf":"font/ttf","assets/ui/fonts/EBGaramond-Italic.ttf":"font/ttf","assets/ui/fonts/Inter-Medium.ttf":"font/ttf","assets/ui/manifest.json":"application/json","assets/vfx/lunar/lunar_crescent.webp":"image/webp","assets/vfx/lunar/lunar_glints_2x2.webp":"image/webp","assets/vfx/lunar/lunar_moon.webp":"image/webp","assets/vfx/lunar/lunar_rabbit.webp":"image/webp"};
const CACHE = 'vigil-' + BUILD;
let key = null;

// Each version keeps its own page and lock (fetched fresh as it installs), so a page and its files always match: an
// open copy never asks an older version for a newer build's files.
self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    for (const path of ['play.html', 'lock.json']) {
      const res = await fetch(at(path), { cache: 'reload' });
      if (res.ok) await cache.put(at(path), res);
    }
    await self.skipWaiting();
  })());
});
// The gate locking: forget the key held.
self.addEventListener('message', (e) => {
  if (e.data === 'lock') key = null;
});
self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    for (const name of await caches.keys()) if (name.startsWith('vigil-') && name !== CACHE) await caches.delete(name);
    await self.clients.claim();
  })());
});

function idb(mode, act) {
  return new Promise((res) => {
    const r = indexedDB.open('vigil-lock', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('k');
    r.onerror = () => res(null);
    r.onsuccess = () => {
      const q = act(r.result.transaction('k', mode).objectStore('k'));
      q.onsuccess = () => res(q.result || null);
      q.onerror = () => res(null);
    };
  });
}

const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const at = (path) => new URL(path, self.registration.scope).href;

/**
 * This build's key: its lock (fresh when online, else the kept copy), unsealed with the password's key. `check`
 * looks again that the password's key is still kept (the game's page opening, after a lock).
 */
async function buildKey(check = false) {
  if (key && !check) return key;
  const kek = await idb('readonly', (s) => s.get('key'));
  if (!kek) {
    key = null;
    return null;
  }
  if (key) return key;
  // This version's own lock (kept as it installed); only if missing, the site's.
  const cache = await caches.open(CACHE);
  let lock;
  const kept = await cache.match(at('lock.json'));
  try {
    if (kept) lock = await kept.json();
    else {
      const res = await fetch(at('lock.json'), { cache: 'no-store' });
      await cache.put(at('lock.json'), res.clone());
      lock = await res.json();
    }
  } catch {
    return null;
  }
  try {
    const sealed = b64(lock.key);
    const raw = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: sealed.slice(0, 12) }, kek, sealed.slice(12));
    key = await crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
    return key;
  } catch {
    // The password has changed: forget the old one, and the gate asks again.
    await idb('readwrite', (s) => s.delete('key'));
    return null;
  }
}

async function sealed(path) {
  const url = at('enc/' + path);
  const cache = await caches.open(CACHE);
  const hit = await cache.match(url);
  if (hit) return hit.arrayBuffer();
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.status + ' ' + path);
  await cache.put(url, res.clone());
  return res.arrayBuffer();
}

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  const scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  const path = decodeURIComponent(url.pathname.slice(scope.pathname.length));
  // The game's page: only when unlocked; else the gate.
  if (path === 'play.html') {
    e.respondWith((async () => {
      if (!(await buildKey(true))) return Response.redirect(at('./'), 302);
      // This version's own page (kept as it installed), so its files are the ones this worker unseals.
      const cache = await caches.open(CACHE);
      const kept = await cache.match(at('play.html'));
      if (kept) return kept;
      try {
        const res = await fetch(e.request);
        await cache.put(at('play.html'), res.clone());
        return res;
      } catch {
        return Response.error();
      }
    })());
    return;
  }
  // The gate and the manifest, kept for offline too.
  if (path === '' || path === 'index.html' || path === 'manifest.webmanifest' || path.startsWith('icon-') || path === 'gate-font.ttf') {
    e.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const res = await fetch(e.request);
        await cache.put(e.request, res.clone());
        return res;
      } catch {
        return (await cache.match(e.request)) || Response.error();
      }
    })());
    return;
  }
  const type = FILES[path];
  if (!type) return;
  e.respondWith((async () => {
    const k = await buildKey();
    if (!k) return new Response('Locked', { status: 401 });
    const data = new Uint8Array(await sealed(path));
    const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: data.slice(0, 12) }, k, data.slice(12));
    return new Response(plain, { headers: { 'Content-Type': type } });
  })());
});

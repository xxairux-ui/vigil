// Vigil's service worker (build d0de17f9d76d): unseals each game file with the content key, itself unsealed with
// the password's key the gate keeps; keeps the sealed copies for playing offline.
const BUILD = "d0de17f9d76d";
/** Each game file: its content type, the SHA-256 of its sealed copy (enc/<path>), 1 when gzipped before sealing. */
const FILES = {"app/three-vrm.module-B7CatyMw.js":["text/javascript","db90b2f8077e68a22336edd23e00d26ea42220eeb609f7dda4d46a562acca0e8",1],"app/three-zvd7iNzH.js":["text/javascript","a7ebc9b170542ba1ee4ff340bc46be037925eb6540f97dfe8edd1a97fc0344fe",1],"app/vigil-LR0vJl2g.js":["text/javascript","9008e213e0a2f025e6c7b1d64b6c5051265ef6c416ce45cde50397edee0fa6d9",1],"assets/audio/manifest.json":["application/json","36891b5eb0c21cb83cfeb90c827a6c438883a8492483138771c6a7dd120386f7",1],"assets/audio/music/music-boss-b.mp3":["audio/mpeg","3e6b3e64102d6951e34b59f3271d406eec76b754a31c2035b25889d573037134",0],"assets/audio/music/music-combat-a.mp3":["audio/mpeg","ce48fcb8991cef84e9c8a8f0e52b8299390c5b3e81a89b1a156bbee363a0e28a",0],"assets/audio/music/music-combat-b.mp3":["audio/mpeg","6b0cba084d5e4196fc4f640bbdc440ca75dfcaffb6ad1929fd75a0d9e038db17",0],"assets/audio/music/music-sanctuary-b.mp3":["audio/mpeg","9d46a30c4869271600b75a0ef60e5797873ed9cbf81662d7522a9560ea9fbf58",0],"assets/audio/music/music-title-b.mp3":["audio/mpeg","4c1020d7d60a43fe43693a3e323c1ec2e8e6df2693d7a0690f21b785b2bdf5cb",0],"assets/audio/pack-Mage.mp3":["audio/mpeg","08d9ed201bc5a9321532f0fdc64bc457dd89aed5513fd45645cef88b6ec0f8b2",0],"assets/audio/pack-archer.mp3":["audio/mpeg","b9c9eec21d1be1e3a3d1c0bc9dbffff803a0862fb148c1b950ef8fec12cf45b0",0],"assets/audio/pack-drops.mp3":["audio/mpeg","9583132c8c6ccf9297d52ae71c090b52a80d3333c2aa1685585190b0aeec334c",0],"assets/audio/pack-enemies.mp3":["audio/mpeg","a790da7c457ae70668d289bc3bfdb1eceee486872135a9772f6d44472ab397d9",0],"assets/audio/pack-environment.mp3":["audio/mpeg","108900b6ca4835199ca37737865bf0062d33d1b4997b69a3164a5a6ff81a7012",0],"assets/audio/pack-hero-feedback.mp3":["audio/mpeg","e8c04d31f2b40577190e1aac719b0f66c6604d25a68fb69d0a6eeb6cbf54cf47",0],"assets/audio/pack-hero-voice.mp3":["audio/mpeg","36882e68af13712bdfc511b7eab91a7f2b432dfbca90b49fb789c81d42ecfeda",0],"assets/audio/pack-ilyra-abilities.mp3":["audio/mpeg","deaccfba45dba0783ddb77a3752f3211d4ac4ca5084dc49a4b472f8ad83c20e7",0],"assets/audio/pack-inventory.mp3":["audio/mpeg","7277edef4c5ef82a4c81b147d85eac7162c65fda479fb1d9c5b9aff347bbe031",0],"assets/audio/pack-knight-abilities.mp3":["audio/mpeg","c6ee6f1e97833c0fe8c585a7d0629a84d94f29f6647f19c391d88c83cfb26cc7",0],"assets/audio/pack-library-enemies.mp3":["audio/mpeg","d9817aa71487f997e069cea761be904375cf021634132059894868e0d17db5e6",0],"assets/audio/pack-progression.mp3":["audio/mpeg","f7a12d81504b7ca1bc05c9b66aa9bfff829dfe91892918af3a2cd6e0b5175925",0],"assets/audio/pack-rift.mp3":["audio/mpeg","ca81b64e6396fd9fb3226fa8eb46694181166a04d05860ce99518dffe07648e6",0],"assets/audio/pack-seamstress-abilities.mp3":["audio/mpeg","3f686d375cf7327e811ba99479b814652da09018552a39de30505d812053aa22",0],"assets/audio/pack-title.mp3":["audio/mpeg","0f2aa3449d696201ea1a8adad485b5e7440ecff61609b4cce33e13e97d09fe79",0],"assets/audio/pack-ui.mp3":["audio/mpeg","8c0c302e88aad2410f7052557e0c652d646f8a82d94ed65de1c1019880c2e814",0],"assets/biomes/CathedralCrypt.gltf.json":["application/json","a46b0fe8495e8a75d845f2ed1e0ef812e3e9c21420995dc85696b0f66f718c36",1],"assets/biomes/CathedralDressing.gltf.json":["application/json","eedfcc5c7b59405d1bb49caca4df3d27c6dc3c351495391a75411f15eb33cf35",1],"assets/biomes/CathedralStructure.gltf.json":["application/json","3d0b1e965bd039ffbb16163466c5f0674cbe40f207058d0755538593623ef13f",1],"assets/biomes/CathedralSurroundings.gltf.json":["application/json","29993a93c31c91978449c64254071d03baf943873234ed253c9e30f73f218020",1],"assets/biomes/UnwrittenHours.gltf.json":["application/json","a41944eb412f96aafd001e3f0c76d7d8bb25f2f90bcf7c965e9f0db712e4c194",1],"assets/biomes/figures/merchant.gltf.json":["application/json","b6e78a33a3b44900dc02e6393cf05500c7595f726a3e405ade498b3310b6688b",1],"assets/biomes/flooded-cathedral.gltf.json":["application/json","1253595a707176ba7e9c7b3c134c0d5f89d56ec8b62b2bcc298c8788145af5bd",1],"assets/biomes/lite/CathedralCrypt.gltf.json":["application/json","6904a34d645c069eb8b5a0bab70d0940bcc0d300f2dc79285d0748d7162d1e02",1],"assets/biomes/lite/CathedralDressing.gltf.json":["application/json","a163d05b27e5ce07e32dd6a169032b0a8192a1d1c4479b4b2f3964e75ad42e63",1],"assets/biomes/lite/CathedralStructure.gltf.json":["application/json","65a47b0d0d5eb67f01ccb6c98639ec91e35e44cf57d2bf44ceb59fcc8f5a159e",1],"assets/biomes/lite/CathedralSurroundings.gltf.json":["application/json","5a170d3a8399328581cda64158128a93008ce0bc729fdb152e610eb5cf0f448b",1],"assets/biomes/lite/UnwrittenHours.gltf.json":["application/json","4c62227d14c39373c7191c161dcf62c3970117350ec8a90a222ecf5f72d0f789",1],"assets/biomes/lite/flooded-cathedral.gltf.json":["application/json","49c0eb466a2e032d364b051ffdb9d3066c6ea333a0a47c3044ae5d1e521c31ba",1],"assets/biomes/lite/index.json":["application/json","8a686a998024e91c07d1462e9bc3e0cf8b9394e169543fd91359e3b019c0dc75",1],"assets/biomes/lite/observatory-missing-stars.gltf.json":["application/json","7b17f328c302d9116653621c59934c3e3845fcd5c17c2ea4e38bb8d6d96bb459",1],"assets/biomes/lite/orchard-unlived-years-a.gltf.json":["application/json","d6a1b109915d75b10983538178e94b1e5edd59148585a00948c54af11b55f5fb",1],"assets/biomes/lite/orchard-unlived-years-b.gltf.json":["application/json","931387bb383d5f85c3ed36f84e415b9c9672d56c0949de2c5e5523e7f4658351",1],"assets/biomes/manifest.json":["application/json","1af1f5bb45f6851e81a2303264ebac33d66640cc54fe23b922f38dd55f3af0e0",1],"assets/biomes/observatory-missing-stars.gltf.json":["application/json","ea6613086f4f9470b9e22fd4034b20c52524136712aaaca317a9ab30465edcc7",1],"assets/biomes/orchard-unlived-years-a.gltf.json":["application/json","9e123d5d3fb90e1243e9c564b24e138da57d0dd40a07bb66ecd250bf6218ce46",1],"assets/biomes/orchard-unlived-years-b.gltf.json":["application/json","29bbc53472a51c76e013955bc2a853c76b2aa772d4f02959d5ae7ba6f1121364",1],"assets/biomes/textures/BrassInlay.webp":["image/webp","0a0f07499f7a8cf61e682583936be30878abcbbf365089f9c3a3a6abdc0ce1e6",0],"assets/biomes/textures/FloorDecals.webp":["image/webp","2e3e6b0de2556aca3a189b47f30eab9614d159259a7e16cded0edc382d0276eb",0],"assets/biomes/textures/GrimeOverlay.webp":["image/webp","ee6a969842139660e5558a1e0b928c18bfdfa390473e83de39ebd3253a2afa4c",0],"assets/biomes/textures/MistWisp.webp":["image/webp","125fa6d546c6c66e36acbf6480e788ed9acfd3929369eca78682035f2107ad9c",0],"assets/biomes/textures/MossLitter.webp":["image/webp","29b0019fc7bbbf4ffd4c1a2a302e1261b1a6953707073e1c416899ec443e24d2",0],"assets/biomes/textures/Motes.webp":["image/webp","d904309bcf19c16146204d1201925a8651275d5014209931ac1e81e7130f2a0c",0],"assets/enemies/horde/amber-vestal.gltf.json":["application/json","4ce9e44b0c4d48562c33c6aefea00768c5437405fe1db4b5c9f7b956b297d803",1],"assets/enemies/horde/anchor-knight.gltf.json":["application/json","eba276d2faec9d3f70ecfd0aa9b0d918ba5b7be7231efb9d732e7a0fa52fc5c2",1],"assets/enemies/horde/archivist.gltf.json":["application/json","f3eff7fef9664b2f0165cd40b4c588f14ae6621bd1c8fb6808bf40b02e56fa55",1],"assets/enemies/horde/bellows-penitent.gltf.json":["application/json","b1fd37a247117bbcf10cb220f1a0f26a694a47ae350c4c73f563eb06e67722ae",1],"assets/enemies/horde/bookbinder.gltf.json":["application/json","2b3f7da3f509271344bcc4e60ed4569e17cbb00b3f8fbef0f6d8e4280c9dd3fa",1],"assets/enemies/horde/bramble.gltf.json":["application/json","3eb95ccad3c5024883fddf20efb4219f954b3aba32d7a7b5e0f7de364a421879",1],"assets/enemies/horde/brine-witness.gltf.json":["application/json","12d18970a415adec7d3e4b89f32decbfb0ad6d83167f77ca353269f426a00999",1],"assets/enemies/horde/crucible-warden.gltf.json":["application/json","e8512580347cf36832e8dba872ec3b0570a61e689a15715aee70bcf907b319fa",1],"assets/enemies/horde/graft-warden.gltf.json":["application/json","d8afb9b3cf37f5ba7b62e5ce3bba603280e90d31291189714ab2d17e0ee6bb01",1],"assets/enemies/horde/hollow-navigator.gltf.json":["application/json","1813974486f4d1ae428d5dce44aa39788acd7517bc780f1f759a8808cfad573b",1],"assets/enemies/horde/index.gltf.json":["application/json","635510e3fcdf6b008d068106949ff6449111b3a999e5bfee6fc5479a3fbc9fec",1],"assets/enemies/horde/marginalia.gltf.json":["application/json","cdfadc7978383fadea9fc6b0aaa32a5e6f61722db8f77720d204467fd9ca6780",1],"assets/enemies/horde/misprint.gltf.json":["application/json","b9ed7554d3a4063b222cf75f6e3e46a80a209b95bbfd5630fb5dcf867b9c4188",1],"assets/enemies/horde/mossback.gltf.json":["application/json","30af66b7977eaf2c4d189709968a99deb9d7957835b3575618a76b3cf9c53311",1],"assets/enemies/horde/porcelain-surveyor.gltf.json":["application/json","da9b84252cb542c665c513d48a556e599bfb957bb96c736e6e70dc1b11e309e4",1],"assets/enemies/horde/redactor.gltf.json":["application/json","d95f561190c4cd322975c9f9fbd139ea30f2aee05de39088b0cf2ca74663b19c",1],"assets/enemies/horde/rime-bailiff.gltf.json":["application/json","31820caf2efc64476b867e6088c4f8ce75c67a9fc4fe12833c2dc757af7290d0",1],"assets/enemies/horde/sap-glob.gltf.json":["application/json","f5ccef20e0f337f69ab219d95901f9501e36eb7c195222f01f69ab13b364a890",1],"assets/enemies/horde/sap-wasp.gltf.json":["application/json","8d071c01cb81a93324b6574b6525084382d32a29bfe202caf8196fce6dff8d32",1],"assets/enemies/horde/sapmother.gltf.json":["application/json","49b09d268e8cb31b388ccbe8dbce3d2268c8a7b5bb19ffaa62b8877bf40e495c",1],"assets/enemies/horde/scrivener.gltf.json":["application/json","41a489ded7e2a29397c7fc5ac0c7c243dbf73b30eed64567cae5c87e00a504be",1],"assets/enemies/horde/seedling.gltf.json":["application/json","59f556a9db11f4773ed2f240ba1224f2bc3425ebdec80adaffde280a6792c9c1",1],"assets/enemies/horde/unlived.gltf.json":["application/json","7153b197b1d02e6c3c06421520ff0d25c933082b8917237e71f164f879da5480",1],"assets/enemies/horde/unwritten-hour.gltf.json":["application/json","3f76c3caa0fd6be3ea28bc667a4fcd34bcaa7fccd7ec42256167d5bc183f7eb9",1],"assets/enemies/horde/verdict-keeper.gltf.json":["application/json","0bcfd6b38387e707169a755ec43f027d047b1ec13d35fe4808166fa1a52e6e51",1],"assets/enemies/horde/widow-matriarch.gltf.json":["application/json","61d97276343cf0a087cd2f0a5629bf754e44af5aaf3ee6bb466328a1c406dedf",1],"assets/enemies/meta.json":["application/json","515ad1fb8f3516c2474d37f03d2b27a21eb62944c2e9ee728a5e4b29dd103447",1],"assets/heroes/dolls/button.gltf.json":["application/json","d3e3e54ee8c02b3ecff6ab5a89560bbf1b9fce9df08cd2ff1eb4af51793ac181",1],"assets/heroes/dolls/grin.gltf.json":["application/json","731d552ce2e55895172e98f72b36a34d3b18ca2ea78bf7f3c0f56e750fc8a6c2",1],"assets/heroes/dolls/pins.gltf.json":["application/json","ca0fc907e310ccd83882ad71226b48161987f9d6c064f57496b1cf3e8cd02f58",1],"assets/heroes/dolls/weep.gltf.json":["application/json","0298dfcddb1ccf52182bc66d9f50e7cac483841ed93a96c84d53c54623013a93",1],"assets/heroes/lite/archer.gltf.json":["application/json","a647825e5a451544949d876d1db712ad210a4ce90e5e0eb03b8794ab7bbfca72",1],"assets/heroes/lite/ilyra.gltf.json":["application/json","475e9b64efdbce43b76205137c6235a27d348a91f3ea20d9cb7613be8f9f11cf",1],"assets/heroes/lite/knight.gltf.json":["application/json","31bf687eba7f1e11b261f3ab9ecb2892858dbccf19831266ce98cc6cd1ab4ed7",1],"assets/heroes/lite/seamstress.gltf.json":["application/json","402b0539b544458cb755089f015d897a7feb69d0b7420086609a7fa0bb5b24d3",1],"assets/heroes/props/moon-bow.gltf.json":["application/json","d3abfc5913085c8a6b75dacc937428a5b732b234bf52708db31d40990641b806",1],"assets/heroes/vrm/arin.gltf.json":["application/json","563c9ec759bd9b8c9d2cff6db4ec42b2d51a3c186580928d01344daa2a5ea8b4",1],"assets/heroes/vrm/penny.gltf.json":["application/json","b842f5071e5ff0af025c8eff40f4b42b8c9ddc55b4f360f2606e0bb2801b2fad",1],"assets/ui/art-pack-1.json":["application/json","9e2c7fe7e57a2131a17cf9461af2246e15ee59e211743d92f620923a38c462f7",1],"assets/ui/art-packs.json":["application/json","efb08d91ea78cd54556d80c28126f770faad2e8f33cffac7e4b9b93260cd4f1a",0],"assets/ui/fonts/Cinzel-SemiBold.ttf":["font/ttf","473d64d2915500f8917ec112b49031e3d02fc5e8e4f53d2d2c68e416f1a7e859",1],"assets/ui/fonts/CrimsonPro-Medium.ttf":["font/ttf","20652f89acb90f97dcfed71aa24721e08d4da745381f98990ec6bb6483ac54fb",1],"assets/ui/fonts/CrimsonPro-SemiBold.ttf":["font/ttf","00c0a877e9bdbe9198bf092671ce6f7ae485ef84979bbe50aa941348ba34ea16",1],"assets/ui/fonts/EBGaramond-Italic.ttf":["font/ttf","d768823ea0ae9e313b2eca15133a4688e11b8e2b7f6eca93711b5d913ee86f7d",1],"assets/ui/fonts/Inter-Medium.ttf":["font/ttf","6aac76a8b24f9d75d4887cbfc43f5b1a706b11c288c69490dd398f3ae4ee36b3",1],"assets/ui/manifest.json":["application/json","30c364abb7a4e047abc29e333491e1c3c7c36c85259fbdc4e9d0a691e471201d",1],"assets/vfx/lunar/lunar_crescent.webp":["image/webp","ef0223706edb507660db239819f5d4fddaf50e2f8fa00942cd458e599161e574",0],"assets/vfx/lunar/lunar_glints_2x2.webp":["image/webp","ac992486fb07cc9c7854343c1fca4ac6d2a3a07ce0702932941fa5296333ac51",0],"assets/vfx/lunar/lunar_moon.webp":["image/webp","c22815906893a9ec53a930444cb3c6c32b459d27609972b31b858373413b8520",0],"assets/vfx/lunar/lunar_rabbit.webp":["image/webp","56f25c538564b2cdefd98d3597f0e88f560177c32fa0be8aa8875726b5975675",0]};
/** This build's own page, lock and gate, so a page and its files always match. */
const PAGE = 'vigil-build-' + BUILD;
/** The sealed files of every build, kept by content hash: an update fetches only the files that changed. */
const STORE = 'vigil-files';
/** Kept for offline first: the courts and the heroes. */
const FIRST = ['assets/biomes/', 'assets/heroes/'];
const GATE = ['manifest.webmanifest', 'gate-font.ttf', 'icon-180.png', 'icon-192.png', 'icon-512.png', 'icon-512-maskable.png'];
let key = null;

const at = (path) => new URL(path, self.registration.scope).href;
/** A sealed file's address: its hash in the query, so neither the browser's HTTP cache nor ours mixes builds. */
const sealedAt = (path) => at('enc/' + path) + '?h=' + FILES[path][1];
const pathOf = (url) => decodeURIComponent(new URL(url).pathname.slice(new URL(at('enc/')).pathname.length));
const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const hex = async (data) =>
  Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', data)), (b) => b.toString(16).padStart(2, '0')).join('');

async function pool(items, work, n = 4) {
  const queue = [...items];
  await Promise.all(Array.from({ length: n }, async () => {
    while (queue.length) await work(queue.shift());
  }));
}

// A new build installs beside the one in charge and takes over only when no open copy is mid-night: as it
// installs, or later when the gate or a page back at the title asks ('skip'). An open night keeps its own build's
// files to the end.
self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const page = await caches.open(PAGE);
    for (const path of ['play.html', 'lock.json']) {
      const res = await fetch(at(path), { cache: 'reload' });
      if (!res.ok) throw new Error(res.status + ' ' + path);
      await page.put(at(path), res);
    }
    await Promise.all(['./', ...GATE].map(async (path) => {
      try {
        const res = await fetch(at(path), { cache: 'reload' });
        if (res.ok) await page.put(at(path), res);
      } catch {}
    }));
    // Offline play survives the update: each file the last build kept and this one changed is fetched now; the
    // rest carry over by hash. Not when the password kept here does not open this build (a new password: the gate
    // asks again first).
    if (!(await unlock(page))) return;
    const store = await caches.open(STORE);
    const kept = await store.keys();
    const paths = new Set(kept.map((r) => pathOf(r.url)));
    const urls = new Set(kept.map((r) => r.url));
    await pool(Object.keys(FILES).filter((p) => paths.has(p) && !urls.has(sealedAt(p))), (p) => fetchSealed(p, store));
  })().then(async () => {
    // Nothing under way anywhere (or only pages from before builds asked): take over now.
    if (await idle()) await self.skipWaiting();
  }));
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    // The builds before this one: their pages and locks, and every sealed file this build does not name.
    for (const name of await caches.keys())
      if (name.startsWith('vigil-') && name !== PAGE && name !== STORE) await caches.delete(name);
    const store = await caches.open(STORE);
    const wanted = new Set(Object.keys(FILES).map(sealedAt));
    for (const request of await store.keys()) if (!wanted.has(request.url)) await store.delete(request);
    await self.clients.claim();
  })());
});

/**
 * Whether no open copy is mid-night. The gate and a game page at the title answer that they are at rest, one
 * mid-night that it is busy (it keeps its build to the end). A page that does not answer is from before builds
 * asked (its worker skipped waiting): left on that worker it could not unseal the new files, so it is taken over,
 * and moves to the new build at its title, as it always did.
 */
async function idle() {
  const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  const answers = await Promise.all(all.map((client) => new Promise((res) => {
    const channel = new MessageChannel();
    const late = setTimeout(() => res('silent'), 3000);
    channel.port1.onmessage = (m) => {
      clearTimeout(late);
      res(m.data);
    };
    client.postMessage('state?', [channel.port2]);
  })));
  return !answers.includes('busy');
}

self.addEventListener('message', (e) => {
  // The gate locking: forget the key held.
  if (e.data === 'lock') key = null;
  else if (e.data === 'precache') e.waitUntil(precache());
  else if (e.data === 'skip') e.waitUntil(idle().then((yes) => yes && self.skipWaiting()));
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

async function unseal(kek, lock) {
  const sealed = b64(lock.key);
  const raw = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: sealed.slice(0, 12) }, kek, sealed.slice(12));
  return crypto.subtle.importKey('raw', raw, 'AES-GCM', false, ['decrypt']);
}

/** The content key from this build's kept lock and the password's key kept here, or null. */
async function unlock(page) {
  const kek = await idb('readonly', (s) => s.get('key'));
  const kept = kek && (await page.match(at('lock.json')));
  if (!kept) return null;
  try {
    return await unseal(kek, await kept.json());
  } catch {
    return null;
  }
}

/**
 * The content key, or why there is none: 'gate' (no password kept here, or it no longer opens this build's lock:
 * then forgotten, and the gate asks again) or 'offline' (this build's lock neither kept nor reachable). `check`
 * looks again that the password's key is still kept (the game's page opening, after a lock).
 */
async function buildKey(check = false) {
  if (key && !check) return key;
  const kek = await idb('readonly', (s) => s.get('key'));
  if (!kek) {
    key = null;
    return 'gate';
  }
  if (key) return key;
  // This build's own lock (kept as it installed); only if missing, the site's.
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
  } catch {
    return 'offline';
  }
  try {
    key = await unseal(kek, lock);
    return key;
  } catch {
    // The password has changed: forget the old one, and the gate asks again.
    await idb('readwrite', (s) => s.delete('key'));
    return 'gate';
  }
}

const inflight = new Map();
/** A sealed file of this build: kept, or fetched, checked and kept. */
async function sealed(path) {
  const store = await caches.open(STORE);
  const hit = await store.match(sealedAt(path));
  if (hit) return hit.arrayBuffer();
  return fetchSealed(path, store);
}
function fetchSealed(path, store) {
  const url = sealedAt(path);
  if (!inflight.has(url))
    inflight.set(url, (async () => {
      // Past the browser's HTTP cache (GitHub Pages lets it keep a file for ten minutes, an older build's after an
      // update), then checked against this build's hash: a stale copy is fetched once more, and refused (loudly) if
      // it is still not this build's.
      for (const cache of ['no-cache', 'reload']) {
        const res = await fetch(url, { cache });
        if (!res.ok) throw new Error(res.status + ' ' + path);
        const data = await res.arrayBuffer();
        if ((await hex(data)) === FILES[path][1]) {
          await store.put(url, new Response(data));
          return data;
        }
      }
      throw new Error(path + ' is not the file build ' + BUILD + ' sealed (a stale copy)');
    })().finally(() => inflight.delete(url)));
  return inflight.get(url);
}

let filling = null;
/** Every file of this build kept for offline play, the courts and heroes first; what is kept already is skipped. */
function precache() {
  filling ??= (async () => {
    if (typeof (await buildKey()) === 'string') return;
    const store = await caches.open(STORE);
    const have = new Set((await store.keys()).map((r) => r.url));
    const rank = (p) => {
      const i = FIRST.findIndex((f) => p.startsWith(f));
      return i < 0 ? FIRST.length : i;
    };
    const todo = Object.keys(FILES).filter((p) => !have.has(sealedAt(p))).sort((a, b) => rank(a) - rank(b));
    // (Each looked for again first: the game may have fetched it meanwhile.)
    await pool(todo, async (p) => {
      if (!(await store.match(sealedAt(p)))) await fetchSealed(p, store).catch((err) => console.warn('Vigil: ' + err));
    }, 3);
  })().finally(() => (filling = null));
  return filling;
}

const offline = () =>
  new Response(
    '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Vigil</title>' +
      '<body style="margin:0;height:100vh;display:grid;place-items:center;background:#0a0c11;color:#e9e2d0;' +
      'font:16px Georgia,serif"><p>Vigil needs the network once to open this version.</p>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  const scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  const path = decodeURIComponent(url.pathname.slice(scope.pathname.length));
  // The game's page: only when unlocked; else the gate.
  if (path === 'play.html') {
    e.respondWith((async () => {
      const k = await buildKey(true);
      if (k === 'gate') return Response.redirect(at('./'), 302);
      if (k === 'offline') return offline();
      // This build's own page (kept as it installed), so its files are the ones this worker unseals.
      const page = await caches.open(PAGE);
      const kept = await page.match(at('play.html'));
      if (kept) return kept;
      try {
        const res = await fetch(e.request);
        if (res.ok) await page.put(at('play.html'), res.clone());
        return res;
      } catch {
        return offline();
      }
    })());
    return;
  }
  // The gate and the manifest: fresh when online, kept for offline.
  const gate = path === '' || path === 'index.html' ? './' : GATE.includes(path) ? path : null;
  if (gate) {
    e.respondWith((async () => {
      const page = await caches.open(PAGE);
      try {
        const res = await fetch(e.request);
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
  e.respondWith((async () => {
    const k = await buildKey();
    if (typeof k === 'string') return new Response('Locked', { status: 401 });
    try {
      const data = new Uint8Array(await sealed(path));
      const plain = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: data.subarray(0, 12), additionalData: new TextEncoder().encode(path) },
        k,
        data.subarray(12),
      );
      const body = file[2] ? new Blob([plain]).stream().pipeThrough(new DecompressionStream('gzip')) : plain;
      return new Response(body, { headers: { 'Content-Type': file[0] } });
    } catch (err) {
      console.error('Vigil: ' + path + ': ' + err);
      return new Response(String(err), { status: 502 });
    }
  })());
});

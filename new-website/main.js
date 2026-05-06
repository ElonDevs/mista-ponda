import * as THREE from 'three';

// ---------- Renderer ----------
const canvas = document.querySelector('#webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;

// ---------- Scene + Camera ----------
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100,
);
camera.position.set(0, 0, 7);
scene.add(camera);

// ---------- Characters (each texture loaded separately) ----------
const CHARACTERS = ['regular', 'kpop', 'samurai', 'pirate', 'zombie'];
const SPACING = 4.2; // distance between characters along X
const TOTAL = SPACING * CHARACTERS.length;

const loader = new THREE.TextureLoader();

const planes = CHARACTERS.map((name, i) => {
  const texture = loader.load(`./textures/${name}.png`, (tex) => {
    // once we know the image's real aspect, lock the plane's width to it
    const aspect = tex.image.width / tex.image.height;
    mesh.scale.set(aspect, 1, 1);
  });
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    alphaTest: 0.01,
    depthWrite: false,
  });

  // height = 3 world units, width follows texture aspect via mesh.scale
  const geometry = new THREE.PlaneGeometry(1, 3);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = { name, baseX: i * SPACING };
  mesh.position.x = mesh.userData.baseX;

  scene.add(mesh);
  return mesh;
});

// ---------- Scroll state ----------
let target = 0;          // where the scroll wants to be
let current = 0;         // smoothed value actually applied
let lastInput = performance.now();

const SCROLL_SENSITIVITY = 0.0035;
const SMOOTHING = 0.085;

const IDLE_MS = 2200;     // wait this long with no input before auto-scroll kicks in
const AUTO_SPEED = 0.012; // base auto-scroll velocity (world units / frame)

window.addEventListener(
  'wheel',
  (e) => {
    // use whichever axis the wheel reports more strongly — supports
    // vertical wheels (most mice) and horizontal trackpads alike
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    target += delta * SCROLL_SENSITIVITY;
    lastInput = performance.now();
  },
  { passive: true },
);

// touch support — drag horizontally to scroll
let touchX = null;
window.addEventListener('touchstart', (e) => {
  touchX = e.touches[0].clientX;
  lastInput = performance.now();
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (touchX === null) return;
  const x = e.touches[0].clientX;
  target += (touchX - x) * 0.01;
  touchX = x;
  lastInput = performance.now();
}, { passive: true });

window.addEventListener('touchend', () => { touchX = null; });

// ---------- Resize ----------
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// ---------- Wrap a value into [-TOTAL/2, TOTAL/2) for seamless looping ----------
function wrap(v) {
  const m = ((v % TOTAL) + TOTAL) % TOTAL;
  return m > TOTAL / 2 ? m - TOTAL : m;
}

// ---------- Frame loop ----------
function tick() {
  const now = performance.now();
  const idle = now - lastInput;

  // After IDLE_MS of no scroll input, ease into a continuous infinite scroll.
  if (idle > IDLE_MS) {
    const ramp = Math.min((idle - IDLE_MS) / 900, 1); // 0 → 1 ease-in
    target += AUTO_SPEED * ramp;
  }

  current += (target - current) * SMOOTHING;

  for (const mesh of planes) {
    mesh.position.x = wrap(mesh.userData.baseX - current);
  }

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();

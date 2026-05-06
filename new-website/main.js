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

// ---------- Characters ----------
//
// Each character has an EXACT authored position on the strip.
// Edit `x` / `y` here to place them precisely.
// The strip wraps every STRIP_LENGTH units — characters with x outside
// [0, STRIP_LENGTH) are still fine; they'll be folded in at runtime.
//
const STRIP_LENGTH = 21; // world units before the strip repeats

const PLACEMENT = [
  { name: 'regular', x: 0,    y: 0 },
  { name: 'kpop',    x: 4.2,  y: 0 },
  { name: 'samurai', x: 8.4,  y: 0 },
  { name: 'pirate',  x: 12.6, y: 0 },
  { name: 'zombie',  x: 16.8, y: 0 },
];

const loader = new THREE.TextureLoader();

const planes = PLACEMENT.map(({ name, x, y }) => {
  const texture = loader.load(`./textures/${name}.png`, (tex) => {
    // lock the plane's width to the texture's true aspect
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
  mesh.userData = { name, baseX: x, baseY: y };
  mesh.position.set(x, y, 0);

  scene.add(mesh);
  return mesh;
});

// ---------- Scroll state ----------
//
// `scrollX` is the camera's position on the strip. Wheel input nudges
// `target`, which `scrollX` eases toward each frame. The world stays put;
// the camera moves through it.
//
let target = 0;
let scrollX = 0;

const SCROLL_SENSITIVITY = 0.0035;
const SMOOTHING = 0.085;

window.addEventListener(
  'wheel',
  (e) => {
    // use whichever axis the wheel reports more strongly — supports
    // vertical wheels (most mice) and horizontal trackpads alike
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    target += delta * SCROLL_SENSITIVITY;
  },
  { passive: true },
);

// touch support — drag horizontally to scroll
let touchX = null;
window.addEventListener('touchstart', (e) => {
  touchX = e.touches[0].clientX;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (touchX === null) return;
  const x = e.touches[0].clientX;
  target += (touchX - x) * 0.01;
  touchX = x;
}, { passive: true });

window.addEventListener('touchend', () => { touchX = null; });

// ---------- Resize ----------
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// ---------- Frame loop ----------
//
// Move the camera. To make the strip feel infinite, we displace each mesh
// by ±STRIP_LENGTH so it always sits within [-half, +half] of the camera.
// Authored x/y is preserved — the mesh just appears in the closest copy
// of the world to the camera.
//
const half = STRIP_LENGTH / 2;

function tick() {
  scrollX += (target - scrollX) * SMOOTHING;
  camera.position.x = scrollX;

  for (const mesh of planes) {
    let dx = mesh.userData.baseX - scrollX;
    dx = ((dx % STRIP_LENGTH) + STRIP_LENGTH) % STRIP_LENGTH;
    if (dx > half) dx -= STRIP_LENGTH;
    mesh.position.x = scrollX + dx;
    mesh.position.y = mesh.userData.baseY;
  }

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}

tick();

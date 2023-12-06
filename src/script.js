import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Object
 */

const loadingManager = new THREE.LoadingManager();

loadingManager.onStart = () => console.log("Started loading");

loadingManager.onProgress = (url, loaded, total) => {
  console.log("Progressed");
  console.log(`url ${url} loaded ${loaded} total ${total}`);
};
loadingManager.onLoad = () => {
  console.log("loading finished");
};
loadingManager.onError = () => {
  console.log("loading error");
};

const textureLoader = new THREE.TextureLoader(loadingManager);

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
// const doorColorTexture = textureLoader.load(
//   "/textures/checkerboard-1024x1024.png"
// );

doorColorTexture.colorSpace = THREE.SRGBColorSpace;

// Texture repeats
doorColorTexture.repeat.x = 4;
doorColorTexture.repeat.y = 2;
// (not set by default)
doorColorTexture.wrapS = THREE.RepeatWrapping;
doorColorTexture.wrapT = THREE.RepeatWrapping;

//---------- 3fas ----------
// Mirrored repeats
doorColorTexture.wrapS = THREE.MirroredRepeatWrapping;
doorColorTexture.wrapT = THREE.MirroredRepeatWrapping;

// Texture offset
doorColorTexture.offset.x = 0.5;
doorColorTexture.offset.y = 0.2;

// Texture rotation
doorColorTexture.rotation = Math.PI * 0.25; // rotates around the (0, 0) UV coordinates (pivot )

// Texture center/pivot
doorColorTexture.center.x = 0.5;
doorColorTexture.center.y = 0.5;
// filtering/min-mapping
doorColorTexture.minFilter = THREE.NearestMipmapNearestFilter;

// const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
// const heightTexture = textureLoader.load('/textures/door/height.jpg')
// const normalTexture = textureLoader.load('/textures/door/normal.jpg')
// const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
// const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
// const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: doorColorTexture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

console.log("uv ", geometry.attributes.uv);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 1;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
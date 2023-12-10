import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Load Texture
 */

const textureLoader = new THREE.TextureLoader();

const doorTexture = textureLoader.load("./textures/door/color.jpg");
const doorAmbientOcclusationTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
const doorMetalnessTexture = textureLoader.load(
  "./textures/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "./textures/door/roughness.jpg"
);
const doorNormalTexture = textureLoader.load("./textures/door/normal.jpg");
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");

const matcapTexture = textureLoader.load("./textures/matcaps/8.png");
const gradientTexture = textureLoader.load("./textures/gradients/5.jpg");

const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/environmentMap/2k.hdr", (environmentMap) => {
  environmentMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = environmentMap;
  scene.environment = environmentMap;
  material.metalness = 0.9;
  material.roughness = 0.2;
});

// doorTexture.colorSpace = THREE.SRGBColorSpace;
// matcapTexture.colorSpace = THREE.SRGBColorSpace;

// const material = new THREE.MeshBasicMaterial({
//   wireframe: false,
//   map: doorTexture,
// });

// material.transparent = true;
// material.opacity = 0.4;
// material.side = THREE.DoubleSide;

// const material = new THREE.MeshNormalMaterial();
// material.flatShading = true;

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;
// const material = new THREE.MeshDepthMaterial();
// const material = new THREE.MeshLambertMaterial();
/**
 * Lights
 */
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

// const pointLight = new THREE.PointLight(0xffffff, 30);
// pointLight.position.x = 2;
// pointLight.position.y = 3;
// pointLight.position.z = 4;
// scene.add(pointLight);

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 10;
// material.specular = new THREE.Color(0x1188ff);
// const material = new THREE.MeshToonMaterial({ gradientMap: gradientTexture });
// gradientTexture.minFilter = THREE.NearestFilter; /// Fixes gradient texture being blended by gpu
// gradientTexture.magFilter = THREE.NearestFilter;
const material = new THREE.MeshStandardMaterial();
material.metalness = 0.6;
material.roughness = 0.6;
material.map = doorTexture;
material.aoMap = doorAmbientOcclusationTexture;
material.displacementMap = doorHeightTexture;
material.displacementScale = 0.1;
material.metalnessMap = doorMetalnessTexture;
material.roughnessMap = doorRoughnessTexture;
material.normalMap = doorNormalTexture;
material.normalScale.set(0.5, 0.5);
material.transparent = true;
material.alphaMap = doorAlphaTexture;

material.side = THREE.DoubleSide;

const geo = new THREE.SphereGeometry(0.5, 16, 16);
const sphere = new THREE.Mesh(geo, material);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 10, 10), material);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 16, 32),
  material
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

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
camera.position.z = 4;
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
// const clock = new THREE.Clock();

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  // update objects
  sphere.rotation.y = 0.1 * elapsedTime * Math.PI;
  plane.rotation.y = 0.1 * elapsedTime * Math.PI;
  torus.rotation.y = 0.1 * elapsedTime * Math.PI;

  sphere.rotation.x = 0.15 * elapsedTime * Math.PI;
  plane.rotation.x = 0.15 * elapsedTime * Math.PI;
  torus.rotation.x = 0.15 * elapsedTime * Math.PI;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

const gui = new GUI();
gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
gui
  .add(material, "aoMapIntensity")
  .min(0)
  .max(100)
  .step(1 / 10000);
gui.add(material, "displacementScale").min(0).max(1);

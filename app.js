import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { gsap } from "https://cdn.skypack.dev/gsap";

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 20;

const scene = new THREE.Scene();

let bee, secondModel;
let mixer, secondModelMixer;

const loader = new GLTFLoader();
loader.load("/bee.glb", (gltf) => {
  bee = gltf.scene;
  bee.scale.set(10, 10, 10  );
  bee.position.set(-1, -1, -1);
  scene.add(bee);

  mixer = new THREE.AnimationMixer(bee);
  mixer.clipAction(gltf.animations[0]).play();
});

loader.load("/headphones.glb", (gltf) => {
  secondModel = gltf.scene;
  secondModel.scale.set(5, 5, 5);
  secondModel.position.set(5, -1, 1);
  scene.add(secondModel);

  secondModelMixer = new THREE.AnimationMixer(secondModel);
  if (gltf.animations.length) {
    secondModelMixer.clipAction(gltf.animations[0]).play();
  }
});

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

scene.add(new THREE.AmbientLight(0xffffff, 2.0));
const topLight = new THREE.DirectionalLight(0xffffff, 3.0);
topLight.position.set(500, 500, 500);
scene.add(topLight);

const reRender3D = () => {
  requestAnimationFrame(reRender3D);
  renderer.render(scene, camera);
  if (mixer) mixer.update(0.02);
  if (secondModelMixer) secondModelMixer.update(0.02);
};
reRender3D();

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const rotationSpeed = scrollY * 0.001;

  if (bee) {
    bee.rotation.x += rotationSpeed;
    bee.rotation.y += rotationSpeed;
    bee.rotation.z += rotationSpeed;
  }
  if (secondModel) {
    secondModel.rotation.x += rotationSpeed;
    secondModel.rotation.y += rotationSpeed;
    secondModel.rotation.z += rotationSpeed;
  }
});

window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectMatrix();
});

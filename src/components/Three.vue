<template>
  <div ref="container" id="container"></div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
// import "./demo";
import "./solider";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import Stats from "stats-js";
@Component
export default class Three extends Vue {
  container = null;
  stats = null;
  scene = null;
  camera = null;
  renderer = null;
  cube = null;
  innerCube = null;
  gltfLoader = null;
  animationMixer = null;
  actions = [];
  clock = null;
  mountedx() {
    this.container = this.$refs.container;
    this.stats = this.initStats();
    this.init3DEnvironmental();
    this.clock = new THREE.Clock();
    this.initLights();
    this.addPlane();
    this.initLoaders();
    this.loadGlb("/resource/Soldier.glb");
    this.initControls();
  }
  initStats() {
    const stats = new Stats();
    stats.setMode(0);
    stats.domElement.style = `
      position: absolute;
      top: 0;
      left: 0`;
    this.container.appendChild(stats.domElement);
    return stats;
  }
  init3DEnvironmental() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0xeeeeee);
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xa0a0a0);
    this.scene.fog = new THREE.Fog(0xa0a0a0, 10, 50);
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    this.camera.position.set(1, 2, -3);
    this.camera.lookAt(new THREE.Vector3(0, 1, 0));
    this.container.appendChild(this.renderer.domElement);
    window.onresize = this.resizeRenderer;
  }
  initControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.addEventListener("change", this.containRender);
  }
  resizeRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
  addPlane() {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const metrial = new THREE.MeshPhongMaterial({
      color: 0x999999,
      depthWrite: false,
    });
    const plane = new THREE.Mesh(geometry, metrial);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    this.scene.add(plane);
  }
  initLights() {
    const light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 20, 0);
    this.scene.add(light);
    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(-3, 10, -10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 100;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = 100;
    dirLight.shadow.camera.right = 100;
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 1000;
    this.scene.add(dirLight);
  }
  animate() {
    const mixerUpdateDelta = this.clock.getDelta();
    this.animationMixer.update(mixerUpdateDelta);
    this.containRender();
    this.stats.update();
    requestAnimationFrame(this.animate);
  }
  containRender() {
    this.renderer.render(this.scene, this.camera);
  }
  initLoaders() {
    this.gltfLoader = new GLTFLoader();
  }
  loadGlb(path) {
    this.gltfLoader.load(
      path,
      (gltf) => {
        const model = gltf.scene;
        this.scene.add(model);

        model.traverse((obj) => {
          obj.isMesh && (obj.castShadow = true);
          console.log(obj.isMesh);
        });

        const animations = gltf.animations;
        this.animationMixer = new THREE.AnimationMixer(model);
        const idleAction = this.animationMixer.clipAction(animations[0]);
        const walkAction = this.animationMixer.clipAction(animations[3]);
        const runAction = this.animationMixer.clipAction(animations[1]);
        this.actions = [idleAction, walkAction, runAction];
        this.allActionPlay();
        this.animate();
      },
      () => {},
      (error) => console.log(error)
    );
  }
  allActionPlay() {
    this.actions.forEach((action) => {
      action.enabled = true;
      action.setEffectiveTimeScale(1);
      action.setEffectiveWeight(1);
    });
    this.actions.forEach((action, e) => e == 1 && action.play());
  }
}
</script>

<style></style>

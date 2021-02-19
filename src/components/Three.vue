<template>
  <div ref="container"></div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
// import "./demo";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
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
  mounted() {
    this.container = this.$refs.container;
    this.stats = this.initStats();
    this.init3DEnvironmental();
    this.addCube();
    // this.addPlane();
    this.addLights();
    this.initControls();
    requestAnimationFrame(this.animate);
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
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x444444);
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.01,
      100
    );
    this.camera.position.z = 50;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    const axes = new THREE.AxesHelper(1000);
    this.scene.add(axes);
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
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 0), 3);
    const helper = new THREE.PlaneHelper(plane, 300, 0xdee1e6);
    this.scene.add(helper);
  }
  addCube() {
    const geomery = new THREE.BoxGeometry(10, 10, 10);
    const innerMaterial = new THREE.MeshDepthMaterial();
    // const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    // const wireframe = new THREE.WireframeGeometry(geomery);
    // const cube = new THREE.LineSegments(wireframe, material);
    // cube.material.depthTest = false;
    // cube.material.opacity = 0.25;
    // cube.material.transparent = true;
    const innerCube = new THREE.Mesh(geomery, innerMaterial);
    this.scene.add(innerCube);
    // this.scene.add(cube);
    this.containRender();
    // this.cube = cube;
    this.innerCube = innerCube;
  }
  addLights() {
    const lights = [];
    lights[0] = new THREE.PointLight(0xffffff, 1, 0);
    lights[1] = new THREE.PointLight(0xffffff, 1, 0);
    lights[2] = new THREE.PointLight(0xffffff, 1, 0);
    lights[0].position.set(0, 10, 0);
    lights[1].position.set(10, 20, 10);
    lights[2].position.set(-10, -20, -10);
    lights.forEach((e) => this.scene.add(e));
    return lights;
  }
  animate() {
    // this.cube.rotation.z += 0.01;
    this.innerCube.rotation.z += 0.01;
    this.containRender();
    this.stats.update();
    requestAnimationFrame(this.animate);
  }
  containRender() {
    this.renderer.render(this.scene, this.camera);
  }
}
</script>

<style></style>

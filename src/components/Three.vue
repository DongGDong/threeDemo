<template>
  <div ref="container"></div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import * as THREE from "three";
import Stats from "stats-js";
@Component
export default class Three extends Vue {
  container = null;
  stats = null;
  scene = null;
  camera = null;
  renderer = null;
  cube = null;
  mounted() {
    this.container = this.$refs.container;
    this.stats = this.initStats();
    this.init3DEnvironmental();
    this.cube = this.addCube();
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
    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      3,
      500
    );
    this.camera.position.x = 10;
    this.camera.position.y = 10;
    this.camera.position.z = 10;
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.container.appendChild(this.renderer.domElement);
    window.onresize = this.resizeRenderer;
  }
  resizeRenderer() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
  addCube() {
    const geomery = new THREE.BoxGeometry();
    const material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
    const edges = new THREE.EdgesGeometry(geomery);
    const cube = new THREE.LineSegments(edges, material);
    this.scene.add(cube);
    this.containRender();
    return cube;
  }
  animate() {
    this.cube.rotation.x += 0.1;
    this.cube.rotation.y += 0.1;
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

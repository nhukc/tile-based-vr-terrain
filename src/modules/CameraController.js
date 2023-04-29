import * as THREE from 'three';
import { MapControls } from 'three/addons/controls/MapControls.js';

class CameraController {
  constructor(settings, renderer) {
    this.settings = settings;
    this.camera = new THREE.PerspectiveCamera(
      settings.camera.fov,
      window.innerWidth / window.innerHeight,
      settings.camera.near,
      settings.camera.far
    );
    this.controls = new MapControls(this.camera, renderer);
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
  }

  initialize() {
    this.camera.position.set(
      this.settings.terrain.chunkSizeX * this.settings.terrain.tileSize / 2,
      this.settings.terrain.tileSize * this.settings.terrain.chunkSizeY,
      this.settings.terrain.chunkSizeY * this.settings.terrain.tileSize / 2
    );

    this.controls.listenToKeyEvents(window);
    this.controls.target = new THREE.Vector3(
      this.settings.terrain.chunkSizeX * this.settings.terrain.tileSize / 2,
      5,
      this.settings.terrain.chunkSizeY * this.settings.terrain.tileSize / 2
    );
  }

  update() {
    this.controls.update();
  }

  updateAspectRatio() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }

  getCameraTargetChunk() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    let horizontalPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    // Find the intersection point of the ray with the horizontal plane
    let intersectionPoint = new THREE.Vector3();
    if (this.raycaster.ray.intersectPlane(horizontalPlane, intersectionPoint)) {
      let x = Math.floor(intersectionPoint.x / (this.settings.terrain.tileSize));
      let y = Math.floor(intersectionPoint.z / (this.settings.terrain.tileSize));
      return { x: x, y: y };
    }
    return null;
  }
}

export default CameraController;


import * as THREE from 'three';

class Renderer {
  constructor(settings) {
    this.settings = settings;
    this.renderer = new THREE.WebGLRenderer({ antialias: settings.antialias });
  }

  initialize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);
  }

  handleResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

export default Renderer;


import Terrain from './modules/Terrain.js';
import CameraController from './modules/CameraController.js';
import Renderer from './modules/Renderer.js';
import settings from './config/settings.js';

const terrain = new Terrain(settings.terrain);
const renderer = new Renderer(settings.renderer);
const cameraController = new CameraController(settings, renderer.renderer.domElement);

init();
animate();

function init() {
  terrain.generate();
  renderer.initialize();
  cameraController.initialize();

  // Add event listeners
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  cameraController.updateAspectRatio();
  renderer.handleResize();
}

function animate() {
  requestAnimationFrame(animate);
  cameraController.update();
  const targetChunk = cameraController.getCameraTargetChunk();
  terrain.updateChunks(targetChunk);
  renderer.render(terrain.scene, cameraController.camera);
}


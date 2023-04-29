import * as THREE from 'three';
import Tile from './Tile.js';

class Terrain {
  constructor(settings) {
    this.settings = settings;
    this.grid = [];
    this.scene = new THREE.Scene();
    this.generateGrid();
  }

  generateGrid() {
    const geometry = new THREE.BoxGeometry(
      this.settings.tileSize,
      this.settings.tileHeight,
      this.settings.tileSize
    );

    for (let i = 0; i < this.settings.gridSizeX; i++) {
      this.grid[i] = [];
      for (let j = 0; j < this.settings.gridSizeY; j++) {
        const color = new THREE.Color(Math.random(), Math.random(), Math.random());
        const material = new THREE.MeshBasicMaterial({ color: color });

        const height = 1 + Math.ceil(Math.random() * 3);

        let tileStack = [];
        for (let h = 0; h < height; h++) {
          const tile = new THREE.Mesh(geometry, material);
          tile.position.set(
            i * this.settings.tileSize,
            h * this.settings.tileHeight,
            j * this.settings.tileSize
          );

          const tileData = new Tile(color, height);
          tile.userData = { tileData: tileData };
          tileStack.push(tile);
        }
        this.grid[i][j] = tileStack;
      }
    }

    // Load initial chunk
    this.loadChunk(0, 0);
  }

  generate() {
    // Placeholder for terrain generation algorithm
  }

  loadChunk(startX, startY) {
    for (let i = startX - this.settings.chunkSizeX / 2; i < startX + this.settings.chunkSizeX / 2; i++) {
      for (let j = startY - this.settings.chunkSizeY / 2; j < startY + this.settings.chunkSizeY / 2; j++) {
        if (this.grid[i] && this.grid[i][j]) {
          const tileStack = this.grid[i][j];
          for (let h = 0; h < tileStack.length; h++) {
            this.scene.add(tileStack[h]);
          }
        }
      }
    }
  }

  unloadChunk(startX, startY) {
    for (let i = startX - this.settings.chunkSizeX / 2; i < startX + this.settings.chunkSizeX / 2; i++) {
      for (let j = startY - this.settings.chunkSizeY / 2; j < startY + this.settings.chunkSizeY / 2; j++) {
        if (this.grid[i] && this.grid[i][j]) {
          const tileStack = this.grid[i][j];
          for (let h = 0; h < tileStack.length; h++) {
            this.scene.remove(tileStack[h]);
          }
        }
      }
    }
  }

  updateChunks(targetChunk) {
    if (targetChunk && (this.lastChunkX !== targetChunk.x || this.lastChunkY !== targetChunk.y)) {
      if (this.lastChunkX !== null && this.lastChunkY !== null) {
        this.unloadChunk(this.lastChunkX, this.lastChunkY);
      }
      this.loadChunk(targetChunk.x, targetChunk.y);
      this.lastChunkX = targetChunk.x;
      this.lastChunkY = targetChunk.y;
    }
  }
}

export default Terrain;


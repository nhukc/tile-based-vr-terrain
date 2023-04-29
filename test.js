import * as THREE from 'three';
import { MapControls } from 'three/addons/controls/MapControls.js';

// Define the Tile class
class Tile {
    constructor(color, height) {
    this.color = color;
    this.height = height;
    }
}

// Variables
let camera, scene, renderer, controls;
let gridSizeX = 100;
let gridSizeY = 100;
let chunkSizeX = 20;
let chunkSizeY = 10;
let tileSize = 3 * 15;
let tileHeight = 3 * 3;
let grid = [];

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let lastChunkX, lastChunkY;

// Initialization
init();
animate();

function init() {
    // Create the camera
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(chunkSizeX * tileSize / 2, tileSize * chunkSizeY, chunkSizeY * tileSize / 2);

    // Create the scene
    scene = new THREE.Scene();

    // Generate the tile grid
    const geometry = new THREE.BoxGeometry(tileSize, tileHeight, tileSize);

    for (let i = 0; i < gridSizeX; i++) {
    grid[i] = [];
    for (let j = 0; j < gridSizeY; j++) {
        const color = new THREE.Color(Math.random(), Math.random(), Math.random());
        const material = new THREE.MeshBasicMaterial({ color: color });

        // Random height for the tile
        const height = 1 + Math.ceil(Math.random() * 3);

        // Stack the geometry according to the height
        let tileStack = [];
        for (let h = 0; h < height; h++) {
        const tile = new THREE.Mesh(geometry, material);
        tile.position.set(i * tileSize, h * tileHeight, j * tileSize);

        // Store the tile data
        const tileData = new Tile(color, height);
        tile.userData = { tileData: tileData };
        tileStack.push(tile);
        }
        grid[i][j] = tileStack;
    }
    }

    // Set up the renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Set up orbit controls
    controls = new MapControls(camera, renderer.domElement);
    controls.listenToKeyEvents(window);
    controls.target = new THREE.Vector3 (chunkSizeX * tileSize / 2, 5, chunkSizeY *  tileSize / 2)

    // Add event listeners
    window.addEventListener('resize', onWindowResize, false);

    // Load initial chunk
    loadChunk(0, 0);
}

function getCameraTargetChunk() {
    raycaster.setFromCamera(mouse, camera);
    let horizontalPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);

    // Find the intersection point of the ray with the horizontal plane
    let intersectionPoint = new THREE.Vector3();
    if (raycaster.ray.intersectPlane(horizontalPlane, intersectionPoint)) {
        let x = Math.floor(intersectionPoint.x / (tileSize));
        let y = Math.floor(intersectionPoint.z / (tileSize));
        return { x: x, y: y };
    }
    return null;
}

function loadChunk(startX, startY) {
    for (let i = startX - chunkSizeX / 2; i < startX + chunkSizeX / 2; i++) {
        for (let j = startY - chunkSizeY / 2; j < startY + chunkSizeY / 2; j++) {
            if (grid[i] && grid[i][j]) {
                const tileStack = grid[i][j];
                for (let h = 0; h < tileStack.length; h++) {
                scene.add(tileStack[h]);
                }
            }
        }
    }
}

function unloadChunk(startX, startY) {
    for (let i = startX - chunkSizeX / 2; i < startX + chunkSizeX / 2; i++) {
        for (let j = startY - chunkSizeY / 2; j < startY + chunkSizeY / 2; j++) {
            if (grid[i] && grid[i][j]) {
                const tileStack = grid[i][j];
                for (let h = 0; h < tileStack.length; h++) {
                scene.remove(tileStack[h]);
                }
            }
        }
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // Check camera target chunk and load/unload accordingly
    let targetChunk = getCameraTargetChunk();
    console.log(targetChunk)
    if (targetChunk && (lastChunkX !== targetChunk.x || lastChunkY !== targetChunk.y)) {
        if (lastChunkX !== undefined && lastChunkY !== undefined) {
            unloadChunk(lastChunkX, lastChunkY);
        }
        loadChunk(targetChunk.x, targetChunk.y);
        lastChunkX = targetChunk.x;
        lastChunkY = targetChunk.y;
    }

    // Render the scene
    renderer.render(scene, camera);
}

import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const textureLoader = new THREE.TextureLoader();
const textures = [
    's5.png',
    's5p2.png',
    's5p3.png'
].map(img => textureLoader.load(img));

const geometry = new THREE.SphereGeometry(1, 32, 32);
const material = new THREE.MeshBasicMaterial({ map: textures[0] });

const sphere = new THREE.Mesh(geometry, material);
scene.add(sphere);

camera.position.z = 2;

// Export as .glb
function exportGLB() {
    const exporter = new GLTFExporter();
    exporter.parse(scene, (gltf) => {
        const blob = new Blob([gltf], { type: 'model/gltf-binary' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'model.glb';
        a.click();
    }, { binary: true });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 's') exportGLB();
});

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

animate();
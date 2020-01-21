import { scene, camera, emitter, userLasers, enemyLasers, currentDelta, cameraSpeed } from './main.js';
import * as THREE from '../three.js-dev/build/three.module.js';
import * as EXPLOSION from './explosion.js';

var laserGeometry = new THREE.CubeGeometry(0.2, 0.2, 10);
var redLaserMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5 });
var greenLaserMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.5 });
var laserSpeed = 5000;

export function userFire () {
    var laserMesh = new THREE.Mesh(laserGeometry, greenLaserMaterial);
    var ewpVector = new THREE.Vector3();
    emitter.getWorldPosition(ewpVector);
    
    laserMesh.position.copy(ewpVector);
    laserMesh.quaternion.copy(camera.quaternion);
    laserMesh.updateWorldMatrix();
    userLasers.push(laserMesh);
    scene.add(laserMesh);
}

export function enemyFire () {
    var laserMesh = new THREE.Mesh(laserGeometry, redLaserMaterial);
    
    // TODO find stomtrooper's gun's and tie fighter's mid positions. they are the emitter
    // update here to
    var ewpVector = new THREE.Vector3();
    emitter.getWorldPosition(ewpVector);
    laserMesh.position.copy(ewpVector);
    laserMesh.quaternion.copy(camera.quaternion);
    // here
    
    laserMesh.updateWorldMatrix();
    enemyLasers.push(laserMesh);
    scene.add(laserMesh);
}

export function userLaserTranslate (item, index, object) {
    // TODO Hit test for enemies
    // TODO -5000 degeri ne olmali? adam cook uzaktaki birine ates edebilir mi?
    if (item.position.z < -5000) {
        object.splice(index, 1);
        scene.remove(item);
    } else {
        item.translateZ(currentDelta * -(Math.abs(cameraSpeed.z) + laserSpeed));   // move along the local z-axis
        console.log(item.position.z);
    }
}

export function enemyLaserTranslate (item) {
    // Hit test for user
    item.translateZ(currentDelta * (Math.abs(cameraSpeed.z) + laserSpeed));   // move along the local z-axis
}

function testHit () {
    
    // if hit
    EXPLOSION.explode();      // fonksiyonlara bak ne durumda hatirlamiyorum ornekten aldim
    
}
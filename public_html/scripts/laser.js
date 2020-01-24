import { scene, camera, emitter, userLasers, enemyLasers, currentDelta, cameraSpeed } from './main.js';
import * as THREE from '../three.js-dev/build/three.module.js';
import * as EXPLOSION from './explosion.js';

var userLaserGeometry = new THREE.CubeGeometry(0.2, 0.2, 10);
var enemyLaserGeometry = new THREE.CubeGeometry(1.5, 1.5, 10);
var redLaserMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5 });
var greenLaserMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.5 });
var laserSpeed = 500;

var laserX = [];
var laserY = [Math.PI/36, -Math.PI/36, Math.PI/34, -Math.PI/34, Math.PI/30, -Math.PI/30];
var laserZ = [-Math.PI/32, Math.PI/32, Math.PI/34, -Math.PI/34, Math.PI/30, -Math.PI/30];


export function userFire () {
    var laserMesh = new THREE.Mesh(userLaserGeometry, greenLaserMaterial);
    
    laserMesh.position.copy(emitter.position);
    laserMesh.quaternion.copy(emitter.quaternion);
    laserMesh.updateWorldMatrix();
    userLasers.push(laserMesh);
    camera.add(laserMesh);
}

export function enemyFire (enemy) {
    var laserMesh = new THREE.Mesh(enemyLaserGeometry, redLaserMaterial);
    
    // TODO find stomtrooper's gun's and tie fighter's mid positions. they are the emitter
    // update here to
    laserMesh.position.set(enemy.position.x, enemy.position.y + 600, enemy.position.z - 100);
    var quaternionY = new THREE.Quaternion();
    var quaternionZ = new THREE.Quaternion();

    quaternionY.setFromAxisAngle(new THREE.Vector3(0, 1, 0), laserY[Math.floor(Math.random() * 4)]);
    quaternionZ.setFromAxisAngle(new THREE.Vector3(0, 0, 1), laserZ[Math.floor(Math.random() * 4)]);

    laserMesh.quaternion.copy(enemy.quaternion);
    laserMesh.applyQuaternion(quaternionY);
    laserMesh.applyQuaternion(quaternionZ);
    // here
    
    laserMesh.updateWorldMatrix();
    enemyLasers.push(laserMesh);
    scene.add(laserMesh);
}

export function userLaserTranslate (item, index, object) {
    // TODO Hit test for enemies
    // TODO -5000 degeri ne olmali? adam cook uzaktaki birine ates edebilir mi?
    if (item.position.distanceTo(camera.position) > 10000) {
        object.splice(index, 1);
        camera.remove(item);
    } else {
        item.translateZ(currentDelta * -(Math.abs(cameraSpeed.z) + laserSpeed));   // move along the local z-axis
    }
}

export function enemyLaserTranslate (item, index, object) {
    // Hit test for user
    if (item.position.z > 5000) {
        object.splice(index, 1);
        scene.remove(item);
    } else {
        item.translateZ(currentDelta * (Math.abs(cameraSpeed.z) + laserSpeed));   // move along the local z-axis
    }
}

function testHit () {
    
    // if hit
    EXPLOSION.explode();      // fonksiyonlara bak ne durumda hatirlamiyorum ornekten aldim
    
}
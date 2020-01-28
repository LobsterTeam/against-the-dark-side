import { scene, camera, emitter, userLasers, enemyLasers, currentDelta, cameraSpeed,
        audioListener, gunSoundBuffer, explosionSoundBuffer } from './main.js';
import { stormtroopers } from './loaders.js';
import * as THREE from '../three.js-dev/build/three.module.js';
import * as EXPLOSION from './explosion.js';
import * as USERINPUTS from './userInputs.js';


var userLaserGeometry = new THREE.CubeGeometry(0.2, 0.2, 20000);
var enemyLaserGeometry = new THREE.CubeGeometry(1.5, 1.5, 10000);
var redLaserMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5 });
var greenLaserMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, opacity: 0.5 });
var laserSpeed = 200;
var enemyLaserSpeed = 500;

var laserX = [];
var laserY = [Math.PI/36, -Math.PI/36, Math.PI/34, -Math.PI/34, Math.PI/30, -Math.PI/30];
var laserZ = [-Math.PI/32, Math.PI/32, Math.PI/34, -Math.PI/34, Math.PI/30, -Math.PI/30];


export function userFire () {
    var laserMesh = new THREE.Mesh(userLaserGeometry, greenLaserMaterial);
    
    laserMesh.position.copy(emitter.position);
    laserMesh.quaternion.copy(emitter.quaternion);
    laserMesh.updateWorldMatrix();
    
    setTimeout(function(){
        camera.remove(laserMesh);
    }, 50);
    userLasers.push(laserMesh); 
    camera.add(laserMesh);
    if (!USERINPUTS.muted){
        var gunSound = new THREE.Audio(audioListener);
        gunSound.setBuffer(gunSoundBuffer);
        gunSound.setLoop(false);
        gunSound.setVolume(1.0);
        camera.add(gunSound);
        gunSound.play();
    }
}

export function enemyFire (enemy) {
    var laserMesh = new THREE.Mesh(enemyLaserGeometry, redLaserMaterial);
    
    // TODO find stomtrooper's gun's and tie fighter's mid positions. they are the emitter
    // update here to
    var gun = enemy.children[1];
    var pos = new THREE.Vector3();
    pos.copy(gun.position);
    pos.y -= 50;
    laserMesh.position.copy(pos);
  

    laserMesh.quaternion.copy(gun.quaternion);
    enemyLaserGeometry.computeFaceNormals();

    setTimeout(function(){
        enemy.remove(laserMesh);
    }, 50);
    
    laserMesh.updateWorldMatrix();
    enemyLasers.push(laserMesh);
    enemy.add(laserMesh);
    
    if (!USERINPUTS.muted){
        var gunSound = new THREE.PositionalAudio(audioListener);
        gunSound.setBuffer(gunSoundBuffer);
        gunSound.setLoop(false);
        gunSound.setVolume(1.0);
        gunSound.setRefDistance(2000);
        enemy.add(gunSound);
        gunSound.play();
    }
}

export function userLaserTranslate (item, index, object) {
    // TODO Hit test for enemies
    // TODO -5000 degeri ne olmali? adam cook uzaktaki birine ates edebilir mi?,
    var itemWorldPos = new THREE.Vector3();
    item.getWorldPosition(itemWorldPos);
    var distance = itemWorldPos.distanceTo(camera.position);
    if (distance > 2000) {
        object.splice(index, 1);
        camera.remove(item);
        console.log("removed");
    } else {
        //item.translateZ(currentDelta * -(Math.abs(cameraSpeed.z) + laserSpeed));   // move along the local z-axis
        for (var i = 0; i < stormtroopers.length; i++) {
            testHit(item, stormtroopers[i]);
        }
    }
    //userLaserGeometry.computeVertexNormals();
    item.updateWorldMatrix();
}

export function enemyLaserTranslate (item, index, object) {
    // Hit test for user
    if (item.position.z > 5000) {
        object.splice(index, 1);
        scene.remove(item);
    } else {
        //item.translateZ(currentDelta * (Math.abs(cameraSpeed.z) + enemyLaserSpeed));   // move along the local z-axis
    }
}

function testHit (beam, target) {
    
    var itemBox = new THREE.Box3().setFromObject(beam);
    var stormtrooperBox = new THREE.Box3().setFromObject(target);

    var collision = itemBox.intersectsBox(stormtrooperBox);
    
    if (collision) {
        EXPLOSION.explode(target.position.x, target.position.y, target.position.z, target);
        var geometry = new THREE.BoxBufferGeometry();
        var material = new THREE.MeshBasicMaterial();
        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.copy(target.position);
        scene.add( mesh );
        
        if (!USERINPUTS.muted){
            var explosionSound = new THREE.PositionalAudio(audioListener);
            explosionSound.setBuffer(explosionSoundBuffer);
            explosionSound.setLoop(false);
            explosionSound.setVolume(1.0);
            explosionSound.setRefDistance(10000);
            mesh.add(explosionSound);
            explosionSound.play();
            scene.remove(mesh);
        }
        scene.remove(target);
        stormtroopers.splice(stormtroopers.indexOf(target), 1);
    }
    
}
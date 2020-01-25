import { scene, camera, emitter, userLasers, enemyLasers, currentDelta, cameraSpeed } from './main.js';
import { stormtroopers } from './loaders.js';
import * as THREE from '../three.js-dev/build/three.module.js';
import * as EXPLOSION from './explosion.js';

var userLaserGeometry = new THREE.CubeGeometry(0.2, 0.2, 20000);
var enemyLaserGeometry = new THREE.CubeGeometry(1.5, 1.5, 10);
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
}

export function enemyFire (enemy) {
    var laserMesh = new THREE.Mesh(enemyLaserGeometry, redLaserMaterial);
    
    // TODO find stomtrooper's gun's and tie fighter's mid positions. they are the emitter
    // update here to
    var gun = enemy.children[1];
    laserMesh.position.copy(gun.position);
  

    laserMesh.quaternion.copy(gun.quaternion);
    enemyLaserGeometry.computeFaceNormals();

    // here
    
    laserMesh.updateWorldMatrix();
    enemyLasers.push(laserMesh);
    enemy.add(laserMesh);
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
        item.translateZ(currentDelta * (Math.abs(cameraSpeed.z) + enemyLaserSpeed));   // move along the local z-axis
    }
}

function testHit (item, stormtrooper) {
    
    var itemBox = new THREE.Box3().setFromObject(item);
    var stormtrooperBox = new THREE.Box3().setFromObject(stormtrooper);
    //var box = new THREE.BoxHelper( item, 0xffff00 );
    //scene.add( box );
    var collision = itemBox.intersectsBox(stormtrooperBox);
    
    if (collision) {

        scene.remove(stormtrooper);
    }
    
    //var raycaster = new THREE.Raycaster();
    //var direction = new THREE.Vector3();
    //var itemWorldPos = new THREE.Vector3();
    //item.getWorldPosition(itemWorldPos);
    //direction.subVectors(stormtrooper.position, itemWorldPos).normalize();
    //raycaster.set(item, direction);
    
    
    //var intersects = raycaster.intersectObjects(stormtrooper.children, true);
    //if (intersects.length !== 0){
        //console.log("intersect at", intersects[0].point);
    //}
    // if hit
    EXPLOSION.explode();      // fonksiyonlara bak ne durumda hatirlamiyorum ornekten aldim
    
}
import * as DAT from '../three.js-dev/examples/jsm/libs/dat.gui.module.js';
import * as SKYANDSUN from './skyAndSun.js';
import * as THREE from '../three.js-dev/build/three.module.js';


export function createGUI () {
    
    var tattooOneParameters = {
        intensity: SKYANDSUN.tatooOne.intensity,
        translateX: SKYANDSUN.tatooOne.position.x,
        translateY: SKYANDSUN.tatooOne.position.y,
        translateZ: SKYANDSUN.tatooOne.position.z,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0
    }

    var tattooTwoParameters = {
        intensity: SKYANDSUN.tatooTwo.intensity,
        translateX: SKYANDSUN.tatooTwo.position.x,
        translateY: SKYANDSUN.tatooTwo.position.y,
        translateZ: SKYANDSUN.tatooTwo.position.z,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0
    }
    
    var a = 0;
    
    var gui = new DAT.GUI();
    
    // Tatoo One
    var tatooOneFolder = gui.addFolder('Tatoo I');
    tatooOneFolder.add( tattooOneParameters, 'intensity', 0, 2, 0.1 ).onChange (function(value) {
        console.log(SKYANDSUN.tatooOne.children[1]);
        
        if (value === 0.0) {        // if intensity is 0 then no suj flares
            SKYANDSUN.tatooOne.children[1].visible = false;
        } else {
            if (SKYANDSUN.tatooOne.children[1].visible === false) {
                SKYANDSUN.tatooOne.children[1].visible = true;
            }
            SKYANDSUN.tatooOne.children[1].opacity = value;     // TODO opacity?
        }
        
        SKYANDSUN.tatooOne.intensity = value;
    });
    tatooOneFolder.add( tattooOneParameters, 'translateX', -1230000, 1230000, 100 ).onChange(function(value) {
        SKYANDSUN.tatooOne.position.x = value;
    });
    tatooOneFolder.add( tattooOneParameters, 'translateY', -600000, 600000, 100 ).onChange(function(value) {
        SKYANDSUN.tatooOne.position.y = value;
    });
    tatooOneFolder.add( tattooOneParameters, 'translateZ', -600000, -200000, 100).onChange(function(value) {
        SKYANDSUN.tatooOne.position.z = value;
    });
    tatooOneFolder.add( tattooOneParameters, 'rotateX', 0, 2*Math.PI, 0.001 ).onChange(function(value) {
        var pivot = new THREE.Vector3(SKYANDSUN.tatooOne.position.x, SKYANDSUN.tatooOne.position.y, SKYANDSUN.tatooOne.position.z);
        var axis = new THREE.Vector3(1, 0, 0)
        rotateAboutPoint(SKYANDSUN.tatooOne.target, pivot, axis, value, false);
        SKYANDSUN.tatooOne.target.updateMatrixWorld();
        a = value - a;
        console.log(value);
        console.log(SKYANDSUN.tatooOne.target.position);
    });
    tatooOneFolder.add( tattooOneParameters, 'rotateY', 0, 2*Math.PI, 0.001 ).onChange(function(value) {
        var pivot = new THREE.Vector3(SKYANDSUN.tatooOne.position.x, SKYANDSUN.tatooOne.position.y, SKYANDSUN.tatooOne.position.z);
        var axis = new THREE.Vector3(0, 1, 0)
        rotateAboutPoint(SKYANDSUN.tatooOne.target, pivot, axis, a, false);
        a = a + Math.PI / 4;
        SKYANDSUN.tatooOne.target.updateMatrixWorld();
        //a = value - a;
        console.log(SKYANDSUN.tatooOne.target.position);
    });
    tatooOneFolder.add( tattooOneParameters, 'rotateZ', 0, 2*Math.PI, 0.001).onChange(function(value) {
        var pivot = new THREE.Vector3(SKYANDSUN.tatooOne.position.x, SKYANDSUN.tatooOne.position.y, SKYANDSUN.tatooOne.position.z);
        var axis = new THREE.Vector3(0, 0, 1)
        rotateAboutPoint(SKYANDSUN.tatooOne.target, pivot, axis, value - a, false);
        SKYANDSUN.tatooOne.target.updateMatrixWorld();
        a = value - a;
        console.log(SKYANDSUN.tatooOne.target.position);
    });
    tatooOneFolder.open();
    
    // Tatoo Two
    var tatooTwoFolder = gui.addFolder('Tatoo II');
    tatooTwoFolder.add( tattooTwoParameters, 'intensity', 0, 2, 0.1).onChange(function(value) {
        
        if (value === 0.0) {        // if intensity is 0 then no suj flares
            SKYANDSUN.tatooTwo.children[1].visible = false;
        } else {
            if (SKYANDSUN.tatooTwo.children[1].visible === false) {
                SKYANDSUN.tatooTwo.children[1].visible = true;
            }
            SKYANDSUN.tatooTwo.children[1].opacity = value;     // TODO opacity works?
        }
        
        SKYANDSUN.tatooTwo.intensity = value;
    });
    tatooTwoFolder.add( tattooTwoParameters, 'translateX', -1230000, 1230000, 100).onChange(function(value) {
        SKYANDSUN.tatooTwo.position.x = value;
    });
    tatooTwoFolder.add( tattooTwoParameters, 'translateY', -600000, 600000, 100).onChange(function(value) {
        SKYANDSUN.tatooTwo.position.y = value;
    });
    tatooTwoFolder.add( tattooTwoParameters, 'translateZ', -600000, -200000, 100).onChange(function(value) {
        SKYANDSUN.tatooTwo.position.z = value;
    });
    tatooTwoFolder.add( tattooTwoParameters, 'rotateX', 0, 2*Math.PI, 0.001).onChange(function(value) {
        var pivot = new THREE.Vector3(SKYANDSUN.tatooTwo.position.x, SKYANDSUN.tatooTwo.position.y, SKYANDSUN.tatooTwo.position.z);
        var axis = new THREE.Vector3(1, 0, 0);
        SKYANDSUN.tatooTwo.target.set(0.0, 0.0, 0.0);
        rotateAboutPoint(SKYANDSUN.tatooTwo.target, pivot, axis, value - a, false);
        SKYANDSUN.tatooTwo.target.updateMatrixWorld();
        a = value - a;
        console.log(a);
        console.log(SKYANDSUN.tatooTwo.target.position);
    });
    tatooTwoFolder.add( tattooTwoParameters, 'rotateY', 0, 2*Math.PI, 0.001).onChange(function(value) {
        var pivot = new THREE.Vector3(SKYANDSUN.tatooTwo.position.x, SKYANDSUN.tatooTwo.position.y, SKYANDSUN.tatooTwo.position.z);
        var axis = new THREE.Vector3(0, 1, 0)
        rotateAboutPoint(SKYANDSUN.tatooTwo.target, pivot, axis, value - a, false);
        SKYANDSUN.tatooTwo.target.updateMatrixWorld();
        a = value - a;
        console.log(SKYANDSUN.tatooTwo.target.position);
    });
    tatooTwoFolder.add( tattooTwoParameters, 'rotateZ', 0, 2*Math.PI, 0.001).onChange(function(value) {
        var pivot = new THREE.Vector3(SKYANDSUN.tatooTwo.position.x, SKYANDSUN.tatooTwo.position.y, SKYANDSUN.tatooTwo.position.z);
        var axis = new THREE.Vector3(0, 0, 1)
        rotateAboutPoint(SKYANDSUN.tatooTwo.target, pivot, axis, value - a, false);
        SKYANDSUN.tatooTwo.target.updateMatrixWorld();
        a = value - a;
        console.log(SKYANDSUN.tatooTwo.target.position);
    });
    tatooTwoFolder.open();        
    
    
    // R2D2 ?
    
    
}

function rotateAboutPoint(obj, point, axis, theta, pointIsWorld){
    pointIsWorld = (pointIsWorld === undefined)? false : pointIsWorld;

    if(pointIsWorld){
        obj.parent.localToWorld(obj.position); // compensate for world coordinate
    }
    
    obj.position.sub(point); // remove the offset
    console.log(obj.position);
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset

    if(pointIsWorld){
        obj.parent.worldToLocal(obj.position); // undo world coordinates compensation
    }

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
}
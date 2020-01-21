import * as DAT from '../three.js-dev/examples/jsm/libs/dat.gui.module.js';
import * as SKYANDSUN from './skyAndSun.js';
import * as THREE from '../three.js-dev/build/three.module.js';
import {setBlasterTransX, setBlasterTransY, setBlasterTransZ, setBlasterRotX,
        setBlasterRotY, setBlasterRotZ} from './main.js';

var gui;

export function createGUI () {
    
    var tattooOneParameters = {
        intensity: SKYANDSUN.tatooOne.intensity,
        translateX: SKYANDSUN.tatooOne.position.x,
        translateY: SKYANDSUN.tatooOne.position.y,
        translateZ: SKYANDSUN.tatooOne.position.z,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0
    };

    var tattooTwoParameters = {
        intensity: SKYANDSUN.tatooTwo.intensity,
        translateX: SKYANDSUN.tatooTwo.position.x,
        translateY: SKYANDSUN.tatooTwo.position.y,
        translateZ: SKYANDSUN.tatooTwo.position.z,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0
    };
    
    var blasterParameters = {
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0
    }
    
    var mirrorParameters = {
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0
    }
    
    var boxParameters = {
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0
    }
    
    var r2d2Parameters = {
        translateX: 0,
        translateY: 0,
        translateZ: 0,
        rotateX: 0,
        rotateY: 0,
        rotateZ: 0
    }
    
    var a = 0;
    
    gui = new DAT.GUI();
    
    // Tatoo One
    var tatooOneFolder = gui.addFolder('Tatoo I');
    tatooOneFolder.add( tattooOneParameters, 'intensity', 0, 2, 0.1 ).onChange (function(value) {
        console.log(SKYANDSUN.tatooOne.children[1]);
        
        if (value === 0.0) {        // if intensity is 0 then no sun flares
            SKYANDSUN.tatooOne.children[0].visible = false;
        } else {
            if (SKYANDSUN.tatooOne.children[0].visible === false) {
                SKYANDSUN.tatooOne.children[0].visible = true;
            }
            SKYANDSUN.tatooOne.children[0].opacity = value;     // TODO opacity?
        }
        
        SKYANDSUN.tatooOne.intensity = value;
    });
    tatooOneFolder.add( tattooOneParameters, 'translateX', -123000, 123000, 100 ).onChange(function(value) {
        SKYANDSUN.tatooOne.position.x = value;
        SKYANDSUN.tatooOneMesh.position.x = value;
    });
    tatooOneFolder.add( tattooOneParameters, 'translateY', -150000, 150000, 100 ).onChange(function(value) {
        SKYANDSUN.tatooOne.position.y = value;
        SKYANDSUN.tatooOneMesh.position.y = value;
    });
    tatooOneFolder.add( tattooOneParameters, 'translateZ', -200000, -120000, 100).onChange(function(value) {
        SKYANDSUN.tatooOne.position.z = value;
        SKYANDSUN.tatooOneMesh.position.z = value - 11000;
    });
    tatooOneFolder.add( tattooOneParameters, 'rotateX', 0, 2*Math.PI, 0.001 ).onChange(function(value) {
        var axis = new THREE.Vector3(1, 0, 0);
        rotateAboutPoint(SKYANDSUN.tatooOne.target, SKYANDSUN.tatooOne.position, axis, value);
    });
    tatooOneFolder.add( tattooOneParameters, 'rotateY', 0, 2*Math.PI, 0.001 ).onChange(function(value) {
        var axis = new THREE.Vector3(0, 1, 0);
        rotateAboutPoint(SKYANDSUN.tatooOne.target, SKYANDSUN.tatooOne.position, axis, value);
    });
    tatooOneFolder.add( tattooOneParameters, 'rotateZ', 0, 2*Math.PI, 0.001).onChange(function(value) {
        var axis = new THREE.Vector3(0, 0, 1)
        rotateAboutPoint(SKYANDSUN.tatooOne.target, SKYANDSUN.tatooOne.position, axis, value);
    });
    tatooOneFolder.open();
    
    // Tatoo Two
    var tatooTwoFolder = gui.addFolder('Tatoo II');
    tatooTwoFolder.add( tattooTwoParameters, 'intensity', 0, 2, 0.1).onChange(function(value) {
        
        if (value === 0.0) {        // if intensity is 0 then no sun flares
            SKYANDSUN.tatooTwo.children[0].visible = false;
        } else {
            if (SKYANDSUN.tatooTwo.children[0].visible === false) {
                SKYANDSUN.tatooTwo.children[0].visible = true;
            }
            SKYANDSUN.tatooTwo.children[0].opacity = value;     // TODO opacity works?
        }
        
        SKYANDSUN.tatooTwo.intensity = value;
    });
    tatooTwoFolder.add( tattooTwoParameters, 'translateX', -123000, 123000, 100).onChange(function(value) {
        SKYANDSUN.tatooTwo.position.x = value;
        SKYANDSUN.tatooTwoMesh.position.x = value;
    });
    tatooTwoFolder.add( tattooTwoParameters, 'translateY', -150000, 150000, 100).onChange(function(value) {
        SKYANDSUN.tatooTwo.position.y = value;
        SKYANDSUN.tatooTwoMesh.position.y = value;
    });
    tatooTwoFolder.add( tattooTwoParameters, 'translateZ', -200000, -120000, 100).onChange(function(value) {
        SKYANDSUN.tatooTwo.position.z = value;
        SKYANDSUN.tatooTwoMesh.position.z = value - 11000;
    });
    tatooTwoFolder.add( tattooTwoParameters, 'rotateX', 0, 2*Math.PI, 0.001).onChange(function(value) {
        var axis = new THREE.Vector3(1, 0, 0);
        rotateAboutPoint(SKYANDSUN.tatooTwo.target, SKYANDSUN.tatooTwo.position, axis, value);
    });
    tatooTwoFolder.add( tattooTwoParameters, 'rotateY', 0, 2*Math.PI, 0.001).onChange(function(value) {
        var axis = new THREE.Vector3(0, 1, 0);
        rotateAboutPoint(SKYANDSUN.tatooTwo.target, SKYANDSUN.tatooTwo.position, axis, value);
    });
    tatooTwoFolder.add( tattooTwoParameters, 'rotateZ', 0, 2*Math.PI, 0.001).onChange(function(value) {
        var axis = new THREE.Vector3(0, 0, 1)
        rotateAboutPoint(SKYANDSUN.tatooTwo.target, SKYANDSUN.tatooTwo.position, axis, value);
    });
    tatooTwoFolder.open();
    
    var blasterFolder = gui.addFolder('Blaster');
    blasterFolder.add( blasterParameters, 'translateX', -20, 20, 1).onChange(function(value) {
        setBlasterTransX(value);
    });
    blasterFolder.add( blasterParameters, 'translateY', -20, 20, 1).onChange(function(value) {
        setBlasterTransY(value);
    });
    blasterFolder.add( blasterParameters, 'translateZ', -20, 20, 1).onChange(function(value) {
        setBlasterTransZ(value);
    });
    blasterFolder.add( blasterParameters, 'rotateX', 0, 2*Math.PI, 0.001).onChange(function(value) {
        setBlasterRotX(value);
    });
    blasterFolder.add( blasterParameters, 'rotateY', 0, 2*Math.PI, 0.001).onChange(function(value) {
        setBlasterRotY(value);
    });
    blasterFolder.add( blasterParameters, 'rotateZ', 0, 2*Math.PI, 0.001).onChange(function(value) {
        setBlasterRotZ(value);
    });
    blasterFolder.open();
    
    var mirrorFolder = gui.addFolder('Mirror');
    mirrorFolder.add( mirrorParameters, 'translateX', -20, 20, 1).onChange(function(value) {
        setBlasterTransX(value);
    });
    mirrorFolder.add( mirrorParameters, 'translateY', -20, 20, 1).onChange(function(value) {
        setBlasterTransY(value);
    });
    mirrorFolder.add( mirrorParameters, 'translateZ', -20, 20, 1).onChange(function(value) {
        setBlasterTransZ(value);
    });
    mirrorFolder.add( mirrorParameters, 'rotateX', 0, 2*Math.PI, 0.001).onChange(function(value) {
        setBlasterRotX(value);
    });
    mirrorFolder.add( mirrorParameters, 'rotateY', 0, 2*Math.PI, 0.001).onChange(function(value) {
        setBlasterRotY(value);
    });
    mirrorFolder.add( mirrorParameters, 'rotateZ', 0, 2*Math.PI, 0.001).onChange(function(value) {
        setBlasterRotZ(value);
    });
    mirrorFolder.open();
    
    var boxFolder = gui.addFolder('Box');
    boxFolder.add( boxParameters, 'translateX', -20, 20, 1).onChange(function(value) {
        setBlasterTransX(value);
    });
    boxFolder.add( boxParameters, 'translateY', -20, 20, 1).onChange(function(value) {
        setBlasterTransY(value);
    });
    boxFolder.add( boxParameters, 'translateZ', -20, 20, 1).onChange(function(value) {
        setBlasterTransZ(value);
    });
    boxFolder.add( boxParameters, 'rotateX', 0, 2*Math.PI, 0.001).onChange(function(value) {
        setBlasterRotX(value);
    });
    boxFolder.add( boxParameters, 'rotateY', 0, 2*Math.PI, 0.001).onChange(function(value) {
        setBlasterRotY(value);
    });
    boxFolder.add( boxParameters, 'rotateZ', 0, 2*Math.PI, 0.001).onChange(function(value) {
        setBlasterRotZ(value);
    });
    boxFolder.open();
    
    var r2d2Folder = gui.addFolder('R2D2');
    r2d2Folder.add( r2d2Parameters, 'translateX', -20, 20, 1).onChange(function(value) {
        setBlasterTransX(value);
    });
    r2d2Folder.add( r2d2Parameters, 'translateY', -20, 20, 1).onChange(function(value) {
        setBlasterTransY(value);
    });
    r2d2Folder.add( r2d2Parameters, 'translateZ', -20, 20, 1).onChange(function(value) {
        setBlasterTransZ(value);
    });
    r2d2Folder.add( r2d2Parameters, 'rotateX', 0, 2*Math.PI, 0.001).onChange(function(value) {
        setBlasterRotX(value);
    });
    r2d2Folder.add( r2d2Parameters, 'rotateY', 0, 2*Math.PI, 0.001).onChange(function(value) {
        setBlasterRotY(value);
    });
    r2d2Folder.add( r2d2Parameters, 'rotateZ', 0, 2*Math.PI, 0.001).onChange(function(value) {
        setBlasterRotZ(value);
    });
    r2d2Folder.open();
    
    // R2D2 ?
    
    
}

export function clearGUI () {
    if (gui != undefined) {
        gui.destroy();
    }
}

function rotateAboutPoint(obj, point, axis, theta) {
        obj.position.set(0, 0, -1000000);

    

    obj.position.sub(point); // remove the offset
    //console.log(obj.position);
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION

    obj.position.add(point); // re-add the offset

    obj.rotateOnAxis(axis, theta); // rotate the OBJECT

    
    console.log(obj.position);
    
    obj.updateMatrixWorld();
}
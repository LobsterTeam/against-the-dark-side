import * as DAT from '../three.js-dev/examples/jsm/libs/dat.gui.module.js';
import * as SKYANDSUN from './skyAndSun.js';
import * as THREE from '../three.js-dev/build/three.module.js';
import {setShowSphereMirror} from './main.js';
import {showHitboxes} from './laser.js';

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
    
    var sphereMirrorParameters = {
        on: false
    };
    var showEnemyHitboxesParameters = {
        on: false
    };
        
    gui = new DAT.GUI();
    
    // Tatoo One
    var tatooOneFolder = gui.addFolder('Tatoo I');
    tatooOneFolder.add( tattooOneParameters, 'intensity', 0, 2, 0.1 ).name('Intensity').onChange (function(value) {
        
        if (value === 0.0) {        // if intensity is 0 then no sun flares
            SKYANDSUN.tatooOne.children[0].visible = false;
        } else {
            if (SKYANDSUN.tatooOne.children[0].visible === false) {
                SKYANDSUN.tatooOne.children[0].visible = true;
            }
            SKYANDSUN.tatooOne.children[0].opacity = value;
        }
        
        SKYANDSUN.tatooOne.intensity = value;
    });
    tatooOneFolder.add( tattooOneParameters, 'translateX', -123000, 123000, 100 ).name('Translate X').onChange(function(value) {
        SKYANDSUN.tatooOne.position.x = value;
        SKYANDSUN.tatooOneMesh.position.x = value;
    });
    tatooOneFolder.add( tattooOneParameters, 'translateY', -150000, 150000, 100 ).name('Translate Y').onChange(function(value) {
        SKYANDSUN.tatooOne.position.y = value;
        SKYANDSUN.tatooOneMesh.position.y = value;
    });
    tatooOneFolder.add( tattooOneParameters, 'translateZ', -200000, -120000, 100).name('Translate Z').onChange(function(value) {
        SKYANDSUN.tatooOne.position.z = value;
        SKYANDSUN.tatooOneMesh.position.z = value - 11000;
    });
    tatooOneFolder.add( tattooOneParameters, 'rotateX', 0, 2*Math.PI, 0.001 ).name('Rotate X').onChange(function(value) {
        var axis = new THREE.Vector3(1, 0, 0);
        rotateAboutPoint(SKYANDSUN.tatooOne.target, SKYANDSUN.tatooOne.position, axis, value);
    });
    tatooOneFolder.add( tattooOneParameters, 'rotateY', 0, 2*Math.PI, 0.001 ).name('Rotate Y').onChange(function(value) {
        var axis = new THREE.Vector3(0, 1, 0);
        rotateAboutPoint(SKYANDSUN.tatooOne.target, SKYANDSUN.tatooOne.position, axis, value);
    });
    tatooOneFolder.add( tattooOneParameters, 'rotateZ', 0, 2*Math.PI, 0.001).name('Rotate Z').onChange(function(value) {
        var axis = new THREE.Vector3(0, 0, 1)
        rotateAboutPoint(SKYANDSUN.tatooOne.target, SKYANDSUN.tatooOne.position, axis, value);
    });
    tatooOneFolder.close();
    
    // Tatoo Two
    var tatooTwoFolder = gui.addFolder('Tatoo II');
    tatooTwoFolder.add( tattooTwoParameters, 'intensity', 0, 2, 0.1).name('Intensity').onChange(function(value) {
        
        if (value === 0.0) {        // if intensity is 0 then no sun flares
            SKYANDSUN.tatooTwo.children[0].visible = false;
        } else {
            if (SKYANDSUN.tatooTwo.children[0].visible === false) {
                SKYANDSUN.tatooTwo.children[0].visible = true;
            }
            SKYANDSUN.tatooTwo.children[0].opacity = value;
        }
        
        SKYANDSUN.tatooTwo.intensity = value;
    });
    tatooTwoFolder.add( tattooTwoParameters, 'translateX', -123000, 123000, 100).name('Translate X').onChange(function(value) {
        SKYANDSUN.tatooTwo.position.x = value;
        SKYANDSUN.tatooTwoMesh.position.x = value;
    });
    tatooTwoFolder.add( tattooTwoParameters, 'translateY', -150000, 150000, 100).name('Translate Y').onChange(function(value) {
        SKYANDSUN.tatooTwo.position.y = value;
        SKYANDSUN.tatooTwoMesh.position.y = value;
    });
    tatooTwoFolder.add( tattooTwoParameters, 'translateZ', -200000, -120000, 100).name('Translate Z').onChange(function(value) {
        SKYANDSUN.tatooTwo.position.z = value;
        SKYANDSUN.tatooTwoMesh.position.z = value - 11000;
    });
    tatooTwoFolder.add( tattooTwoParameters, 'rotateX', 0, 2*Math.PI, 0.001).name('Rotate X').onChange(function(value) {
        var axis = new THREE.Vector3(1, 0, 0);
        rotateAboutPoint(SKYANDSUN.tatooTwo.target, SKYANDSUN.tatooTwo.position, axis, value);
    });
    tatooTwoFolder.add( tattooTwoParameters, 'rotateY', 0, 2*Math.PI, 0.001).name('Rotate Y').onChange(function(value) {
        var axis = new THREE.Vector3(0, 1, 0);
        rotateAboutPoint(SKYANDSUN.tatooTwo.target, SKYANDSUN.tatooTwo.position, axis, value);
    });
    tatooTwoFolder.add( tattooTwoParameters, 'rotateZ', 0, 2*Math.PI, 0.001).name('Rotate Z').onChange(function(value) {
        var axis = new THREE.Vector3(0, 0, 1);
        rotateAboutPoint(SKYANDSUN.tatooTwo.target, SKYANDSUN.tatooTwo.position, axis, value);
    });
    tatooTwoFolder.close();
    
    gui.add(sphereMirrorParameters, 'on').name('Activate Shpere Mirror').onChange(function(value) {
        setShowSphereMirror(value);
    });
    
    gui.add(showEnemyHitboxesParameters, 'on').name('Show Hitboxes').onChange(function(value) {
        showHitboxes(value);
    });
}

export function clearGUI () {
    if (gui !== undefined) {
        gui.destroy();
    }
}

function rotateAboutPoint(obj, point, axis, theta) {
    obj.position.set(0, 0, 0);
    obj.position.sub(point); // remove the offset
    obj.position.applyAxisAngle(axis, theta); // rotate the POSITION
    obj.position.add(point); // re-add the offset
    obj.rotateOnAxis(axis, theta); // rotate the OBJECT
    obj.updateMatrixWorld();
}
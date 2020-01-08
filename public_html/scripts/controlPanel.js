import * as DAT from '../three.js-dev/examples/jsm/libs/dat.gui.module.js';
import * as SKYANDSUN from './skyAndSun.js';





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
    
    var gui = new DAT.GUI();
    
    // Tatoo One
    var tatooOneFolder = gui.addFolder('Tatoo I');
    var tatooOneIntensity = tatooOneFolder.add( tattooOneParameters, 'intensity' ).min(0).max(1).step(0.1).listen();
    var tatooOneTransX = tatooOneFolder.add( tattooOneParameters, 'translateX' ).min(-1230000).max(1230000).step(100).listen();
    var tatooOneTransY = tatooOneFolder.add( tattooOneParameters, 'translateY' ).min(-600000).max(600000).step(100).listen();
    var tatooOneTransZ = tatooOneFolder.add( tattooOneParameters, 'translateZ' ).min(-600000).max(-200000).step(100).listen();
    var tatooOneRotX = tatooOneFolder.add( tattooOneParameters, 'rotateX' ).min(0).max(2*Math.PI).step(0.001).listen();
    var tatooOneRotY = tatooOneFolder.add( tattooOneParameters, 'rotateY' ).min(0).max(2*Math.PI).step(0.001).listen();
    var tatooOneRotZ = tatooOneFolder.add( tattooOneParameters, 'rotateZ' ).min(0).max(2*Math.PI).step(0.001).listen();
    tatooOneFolder.open();
    
    tatooOneIntensity.onChange(function(value) {
        SKYANDSUN.tatooOne.intensity = value;
    });
    
    tatooOneTransX.onChange(function(value) {
        SKYANDSUN.tatooOne.position.x = value;
    });
    
    tatooOneTransY.onChange(function(value) {
        SKYANDSUN.tatooOne.position.y = value;
    });
    
    tatooOneTransZ.onChange(function(value) {
        SKYANDSUN.tatooOne.position.z = value;
    });
    
    tatooOneRotX.onChange(function(value) {
        SKYANDSUN.tatooOne.rotate.x = value;
    });
    
    tatooOneRotX.onChange(function(value) {
        SKYANDSUN.tatooOne.rotate.y = value;
    });
    
    tatooOneRotX.onChange(function(value) {
        SKYANDSUN.tatooOne.rotate.z = value;
    });

    
    
    // Tatoo Two
    var tatooTwoFolder = gui.addFolder('Tatoo II');
    var tatooTwoIntensity = tatooTwoFolder.add( tattooTwoParameters, 'intensity' ).min(0).max(1).step(0.1).listen();
    var tatooTwoTransX = tatooTwoFolder.add( tattooTwoParameters, 'translateX' ).min(-1230000).max(1230000).step(100).listen();
    var tatooTwoTransY = tatooTwoFolder.add( tattooTwoParameters, 'translateY' ).min(-600000).max(600000).step(100).listen();
    var tatooTwoTransZ = tatooTwoFolder.add( tattooTwoParameters, 'translateZ' ).min(-600000).max(-200000).step(100).listen();
    var tatooTwoRotX = tatooTwoFolder.add( tattooOneParameters, 'rotateX' ).min(0).max(2*Math.PI).step(0.001).listen();
    var tatooTwoRotY = tatooTwoFolder.add( tattooOneParameters, 'rotateY' ).min(0).max(2*Math.PI).step(0.001).listen();
    var tatooTwoRotZ = tatooTwoFolder.add( tattooOneParameters, 'rotateZ' ).min(0).max(2*Math.PI).step(0.001).listen();
    tatooTwoFolder.open();
    
    tatooTwoIntensity.onChange(function(value) {
        SKYANDSUN.tatooTwo.intensity = value;
    });
    
    tatooTwoTransX.onChange(function(value) {
        SKYANDSUN.tatooTwo.position.x = value;
    });
    
    tatooTwoTransY.onChange(function(value) {
        SKYANDSUN.tatooTwo.position.y = value;
    });
    
    tatooTwoTransZ.onChange(function(value) {
        SKYANDSUN.tatooTwo.position.z = value;
    });
    
    
    
    // R2D2 ?
    
    
}
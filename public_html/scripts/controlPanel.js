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
    tatooOneFolder.add( tattooOneParameters, 'intensity', 0, 1, 0.1 ).onChange (function(value) {
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
        //SKYANDSUN.tatooOne.position.x = 500 * Math.sin(value);
        //SKYANDSUN.tatooOne.position.z = 500 * Math.cos(value);
        //console.log(SKYANDSUN.tatooOne.target);
        //SKYANDSUN.tatooOne.target.position.x = -4645456123586;
        
        //SKYANDSUN.tatooOne.target.position.y = 0;
        
        //SKYANDSUN.tatooOne.target.position.x = 500000 * Math.sin(value);
        //console.log(SKYANDSUN.tatooOne.target.position.x);
        //SKYANDSUN.tatooOne.target.position.z = 500000 * Math.cos(value);
        //console.log(SKYANDSUN.tatooOne.target.position.y);
        
        //SKYANDSUN.tatooOne.target.updateMatrixWorld();
        //SKYANDSUN.tatooOne.lookAt();
        //SKYANDSUN.tatooOne.rotate.x = value;
    });
    tatooOneFolder.add( tattooOneParameters, 'rotateY', 0, 2*Math.PI, 0.001 ).onChange(function(value) {
        //SKYANDSUN.tatooOne.rotate.y = value;
    });
    tatooOneFolder.add( tattooOneParameters, 'rotateZ', 0, 2*Math.PI, 0.001).onChange(function(value) {
        //SKYANDSUN.tatooOne.rotate.z = value;
    });
    tatooOneFolder.open();
    
    // Tatoo Two
    var tatooTwoFolder = gui.addFolder('Tatoo II');
    tatooTwoFolder.add( tattooTwoParameters, 'intensity', 0, 1, 0.1).onChange(function(value) {
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
    });
    tatooTwoFolder.add( tattooTwoParameters, 'rotateY', 0, 2*Math.PI, 0.001).onChange(function(value) {
    });
    tatooTwoFolder.add( tattooTwoParameters, 'rotateZ', 0, 2*Math.PI, 0.001).onChange(function(value) {
    });
    tatooTwoFolder.open();        
    
    
    // R2D2 ?
    
    
}
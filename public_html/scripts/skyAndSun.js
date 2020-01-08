import { scene, camera, renderer} from './main.js';
import { Sky } from '../three.js-dev/examples/jsm/objects/Sky.js';
import * as THREE from '../three.js-dev/build/three.module.js';

export var sunPos, tatooOne, tatooTwo;

var sky;

export function createTatooSuns(topSkyColor, bottomSkyColor,
                tatooOneColor, tatooOneRayleigh, tatooOneMieCoefficient,
                tatooOneMieDirectionalG, tatooOneLuminance, tatooOneInclination, tatooOneAzimuth,
                tatooTwoColor, tatooTwoRayleigh, tatooTwoMieCoefficient,
                tatooTwoMieDirectionalG, tatooTwoLuminance, tatooTwoInclination, tatooTwoAzimuth) {

    createSky(topSkyColor, bottomSkyColor);
    tatooOne = new THREE.DirectionalLight( 0xffffff, 0.5 );
    createSun(tatooOne, tatooOneColor, 123000, 60000, -400000);
    tatooTwo = new THREE.DirectionalLight( 0xffffff, 0.5 );
    createSun(tatooTwo, tatooTwoColor, 0, 123000, -400000);
}

function createSky (topColor, bottomColor) {
    
    var vertexShader = document.getElementById( 'skyVertexShader' ).textContent;
    var fragmentShader = document.getElementById( 'skyFragmentShader' ).textContent;
    var uniforms = {
            "topColor": { value: new THREE.Color(topColor) },
            "bottomColor": { value: new THREE.Color(bottomColor) },
            "exponent": { value: 0.6 }
    };

    var skyGeo = new THREE.SphereBufferGeometry( 700000, 32, 15 );  // TODO 700000
    var skyMat = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.BackSide
    } );

    var sky = new THREE.Mesh( skyGeo, skyMat );
    scene.add( sky );
}

function createSun (sun, color, x, y, z) {

    //sun = new THREE.DirectionalLight( 0xffffff, 0.5 );
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;        // TODO
    sun.shadow.mapSize.height = 2048;       // TODO

    // TODO
    var d = 50;
    sun.shadow.camera.left = - d;
    sun.shadow.camera.right = d;
    sun.shadow.camera.top = d;
    sun.shadow.camera.bottom = - d;
    sun.shadow.camera.far = 3500;
    sun.shadow.bias = - 0.0001;
    
    sun.add(new THREE.Mesh(
            new THREE.SphereBufferGeometry( 20000, 16, 8 ),     // TODO 10000
            new THREE.MeshBasicMaterial( { color: color } )
    ));
    
    sun.position.x = x;
    sun.position.y = y;
    sun.position.z = z;;
    //sunPos = sun.position;
    scene.add( sun );
}
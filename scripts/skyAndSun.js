import { scene, camera, renderer} from './main.js';
import { Sky } from '../three.js-dev/examples/jsm/objects/Sky.js';
import * as THREE from '../three.js-dev/build/three.module.js';

export var sunPos;

var sky;

export function createTatooSuns(topSkyColor, bottomSkyColor,
                tatooOneColor, tatooOneRayleigh, tatooOneMieCoefficient,
                tatooOneMieDirectionalG, tatooOneLuminance, tatooOneInclination, tatooOneAzimuth,
                tatooTwoColor, tatooTwoRayleigh, tatooTwoMieCoefficient,
                tatooTwoMieDirectionalG, tatooTwoLuminance, tatooTwoInclination, tatooTwoAzimuth) {
    // Add Sky
    //sky = new Sky();
    //sky.scale.setScalar( 450000 ); // skybox size
    //scene.add( sky );

    //formSun(tatooOneColor, tatooOneRayleigh, tatooOneMieCoefficient, tatooOneMieDirectionalG,
    //            tatooOneLuminance, tatooOneInclination, tatooOneAzimuth);
    //formSun(tatooTwoColor, tatooTwoRayleigh, tatooTwoMieCoefficient, tatooTwoMieDirectionalG,
    //            tatooTwoLuminance, tatooTwoInclination, tatooTwoAzimuth);
    
    createSky(topSkyColor, bottomSkyColor);
    createSun(tatooOneColor, tatooOneInclination, tatooOneAzimuth);
    createSun(tatooTwoColor, tatooTwoInclination, tatooTwoAzimuth);
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

function createSun (color, inclination, azimuth) {
    
    var sunSphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry( 10000, 16, 8 ),     // TODO 10000
            new THREE.MeshBasicMaterial( { color: color } )
    );
    
    var distance = 400000;      // TODO 400000
    var theta = Math.PI * ( inclination - 0.5 );
    var phi = 2 * Math.PI * ( azimuth - 0.5 );
    sunSphere.position.x = distance * Math.cos( phi );
    sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
    sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
    sunPos = sunSphere.position;
    scene.add( sunSphere );
}

function formSun (color, rayleigh, mieCoefficient, mieDirectionalG, luminance, inclination, azimuth) {
    
    // Add Sun Helper
    var sunSphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry( 10000, 16, 8 ),
            new THREE.MeshBasicMaterial( { color: color } )
    );
    sunSphere.position.y = - 700000;
    //scene.add( sunSphere );

    /// GUI

    var effectController = {
            turbidity: 0,
            rayleigh: rayleigh,
            mieCoefficient: mieCoefficient,
            mieDirectionalG: mieDirectionalG,
            luminance: luminance,
            inclination: inclination, // elevation / inclination
            azimuth: azimuth, // Facing front,
            sun: true
    };

    var distance = 400000;
    var uniforms = sky.material.uniforms;
    uniforms[ "turbidity" ].value = effectController.turbidity;
    uniforms[ "rayleigh" ].value = effectController.rayleigh;
    uniforms[ "mieCoefficient" ].value = effectController.mieCoefficient;
    uniforms[ "mieDirectionalG" ].value = effectController.mieDirectionalG;
    uniforms[ "luminance" ].value = effectController.luminance;        // !!!
    
    var theta = Math.PI * ( effectController.inclination - 0.5 );
    var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );
    
    sunSphere.position.x = distance * Math.cos( phi );
    sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
    sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
    
    
    sunPos = sunSphere.position;

    sunSphere.visible = effectController.sun;

    uniforms[ "sunPosition" ].value.copy( sunSphere.position );
    console.log();
}
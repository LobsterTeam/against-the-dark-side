import { scene, camera, renderer} from './main.js';
import { Sky } from '../three.js-dev/examples/jsm/objects/Sky.js';
import * as THREE from '../three.js-dev/build/three.module.js';

export var sunPos;

var sky;

export function createSuns() {
    // Add Sky
    sky = new Sky();
    sky.scale.setScalar( 450000 ); // skybox size
    scene.add( sky );

    formSun(0xffffff, 0.49, 0.25);
    formSun(0xffffff, 0.5074, 0.2689);
    

}

function formSun (color, inc, azi) {
    
    // Add Sun Helper
    var sunSphere = new THREE.Mesh(
            new THREE.SphereBufferGeometry( 10000, 16, 8 ),
            new THREE.MeshBasicMaterial( { color: color } )
    );
    sunSphere.position.y = - 700000;
    scene.add( sunSphere );

    /// GUI

    var effectController = {
            turbidity: 10,
            rayleigh: 2,
            mieCoefficient: 0.005,
            mieDirectionalG: 0.8,
            luminance: 1,
            inclination: inc, // elevation / inclination
            azimuth: azi, // Facing front,
            sun: true
    };

    var distance = 400000;
    
    var uniforms = sky.material.uniforms;
    uniforms[ "turbidity" ].value = effectController.turbidity;
    uniforms[ "rayleigh" ].value = effectController.rayleigh;
    uniforms[ "mieCoefficient" ].value = effectController.mieCoefficient;
    uniforms[ "mieDirectionalG" ].value = effectController.mieDirectionalG;
    uniforms[ "luminance" ].value -= effectController.luminance;        // !!!
    
    var theta = Math.PI * ( effectController.inclination - 0.5 );
    var phi = 2 * Math.PI * ( effectController.azimuth - 0.5 );
    
    sunSphere.position.x = distance * Math.cos( phi );
    sunSphere.position.y = distance * Math.sin( phi ) * Math.sin( theta );
    sunSphere.position.z = distance * Math.sin( phi ) * Math.cos( theta );
    
    
    sunPos = sunSphere.position;

    sunSphere.visible = effectController.sun;

    uniforms[ "sunPosition" ].value.copy( sunSphere.position );
}


function createUpperSun() {
    
    
}

function createLowerSun() {
    
    
}
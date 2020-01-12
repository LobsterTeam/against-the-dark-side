import { scene, camera, renderer} from './main.js';
import { Sky } from '../three.js-dev/examples/jsm/objects/Sky.js';
import * as THREE from '../three.js-dev/build/three.module.js';
import { Lensflare, LensflareElement } from '../three.js-dev/examples/jsm/objects/Lensflare.js';

export var tatooOne, tatooTwo;

var sky, textureFlare, textureFlare2;

export function createTatooSuns(topSkyColor, bottomSkyColor, tatooOneColor, tatooTwoColor) {
                    
    var textureLoader = new THREE.TextureLoader();
    textureFlare = textureLoader.load( "textures/sunFlare.png" );
    textureFlare2 = textureLoader.load( "textures/sunFlare2.png" );
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
    scene.add( sun );
    
    var lensflare = new Lensflare();
    lensflare.addElement( new LensflareElement( textureFlare, 300, 0, sun.color) );
    lensflare.addElement( new LensflareElement( textureFlare2, 60, 0.6 ) );
    lensflare.addElement( new LensflareElement( textureFlare2, 120, 0.8 ) );
    lensflare.addElement( new LensflareElement( textureFlare2, 70, 1 ) );

    sun.add( lensflare );
}
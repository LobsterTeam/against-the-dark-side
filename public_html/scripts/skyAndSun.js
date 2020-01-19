import { scene, camera, renderer} from './main.js';
import { Sky } from '../three.js-dev/examples/jsm/objects/Sky.js';
import * as THREE from '../three.js-dev/build/three.module.js';
import { Lensflare, LensflareElement } from '../three.js-dev/examples/jsm/objects/Lensflare.js';

export var tatooOne, tatooTwo, tatooOneMesh, tatooTwoMesh;

var sky, textureFlare, textureFlare2;

export function createTatooSuns(topSkyColor, bottomSkyColor, tatooOneColor, tatooTwoColor) {
                    
    var textureLoader = new THREE.TextureLoader();
    textureFlare = textureLoader.load( "textures/sunFlare.png" );
    textureFlare2 = textureLoader.load( "textures/sunFlare2.png" );
    createSky(topSkyColor, bottomSkyColor);
    tatooOne = new THREE.DirectionalLight( 0xffffff, 0.5 );
    tatooOneMesh =  new THREE.Mesh(
            new THREE.SphereBufferGeometry( 7000, 16, 8 ),
            new THREE.MeshBasicMaterial( { color: tatooOneColor, fog: false } )
    );
    createSun(tatooOne, tatooOneMesh, 50000, 30000, -150000);
    tatooTwo = new THREE.DirectionalLight( 0xffffff, 0.5 );
    tatooTwoMesh =  new THREE.Mesh(
            new THREE.SphereBufferGeometry( 7000, 16, 8 ),
            new THREE.MeshBasicMaterial( { color: tatooTwoColor, fog: false } )
    );
    createSun(tatooTwo, tatooTwoMesh, 0, 60000, -150000);
}

function createSky (topColor, bottomColor) {
    
    //var loader = new THREE.TextureLoader(), texture = loader.load( "img/sky2.jpg" );
    //scene.background = texture;
    
    var vertexShader = document.getElementById( 'skyVertexShader' ).textContent;
    var fragmentShader = document.getElementById( 'skyFragmentShader' ).textContent;
    var uniforms = {
            "topColor": { value: new THREE.Color(topColor) },
            "bottomColor": { value: new THREE.Color(bottomColor) },
            "exponent": { value: 0.6 }
    };

    var skyGeo = new THREE.SphereBufferGeometry( 1000000000, 32, 15 );  // TODO 700000
    var skyMat = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            side: THREE.BackSide
    } );

    var sky = new THREE.Mesh( skyGeo, skyMat );
    scene.add( sky );
}

function createSun (sun, mesh, x, y, z) {

    sun.castShadow = true;
    sun.shadow.mapSize.width = 4096;        // TODO
    sun.shadow.mapSize.height = 4096;       // TODO

    // TODO
    var d = 150000;
    
    sun.shadow.camera.left = - d;
    sun.shadow.camera.right = d;
    sun.shadow.camera.top = d;
    sun.shadow.camera.bottom = - d;
    sun.shadow.camera.far = 400000;
    sun.shadow.bias = - 1;
    sun.position.set(x, y, z);
    scene.add( sun );
    
    mesh.position.set(x, y, z - 11000);
    scene.add(mesh);
    
    var lensflare = new Lensflare();
    //lensflare.addElement( new LensflareElement( textureFlare2, 300, 0, sun.color) );
    lensflare.addElement( new LensflareElement( textureFlare, 40, 0.6 ) );
    lensflare.addElement( new LensflareElement( textureFlare, 100, 0.8 ) );
    lensflare.addElement( new LensflareElement( textureFlare, 50, 1 ) );

    sun.add( lensflare );
    scene.add(sun.target);
}
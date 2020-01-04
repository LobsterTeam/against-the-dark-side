import { GLTFLoader } from '../three.js-dev/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '../three.js-dev/examples/jsm/loaders/DRACOLoader.js';

export function gltfLoad(path, scene, camera) {
    // Instantiate a loader
    var loader = new GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    var dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '../three.js-dev/examples/js/libs/draco/' );
    loader.setDRACOLoader( dracoLoader );

    // Load a glTF resource
    loader.load(
            // resource URL
            path,
            // called when the resource is loaded
            function ( gltf ) {

                    scene.add( gltf.scene );

                    gltf.scene.scale.set(100, 100, 100); // THREE.Scene
                    
                    gltf.scene.position.x = camera.position.x;
                    gltf.scene.position.y = camera.position.y;
                    gltf.scene.position.z = camera.position.z;
                    

            },
            // called while loading is progressing
            function ( xhr ) {

                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
            function ( error ) {

                    console.log( 'An error happened' );

            }
    );
}
import { GLTFLoader } from '../three.js-dev/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '../three.js-dev/examples/jsm/loaders/DRACOLoader.js';
import { MTLLoader } from '../three.js-dev/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from '../three.js-dev/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from '../three.js-dev/examples/jsm/loaders/FBXLoader.js';
import { TGALoader } from '../three.js-dev/examples/jsm/loaders/TGALoader.js';

export async function gltfLoad(path, scene, camera) {
    // Instantiate a loader
    var loader = new GLTFLoader();
    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    var dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '../three.js-dev/examples/js/libs/draco/' );
    loader.setDRACOLoader( dracoLoader );

    // Load a glTF resource
    await loader.load(
            // resource URL
            path,
            // called when the resource is loaded
            function ( gltf ) {

                    gltf.scene.scale.set(100, 100, 100); // THREE.Scene
                    gltf.scene.rotation.set(0,Math.PI,0);
                    gltf.scene.name = "OSG_Scene" ;
                    gltf.scene.position.set(camera.position.x - 130, camera.position.y - 300, camera.position.z - 250);
                    scene.add( gltf.scene );
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

export async function objLoad (mtlPath, objPath, scene, camera, objName, x, y, z, scale, yRotation) {
    
    var mtlLoader = new MTLLoader();
    await mtlLoader.load(mtlPath, function(materials){

        materials.preload();
        var objLoader = new OBJLoader();
        objLoader.setMaterials(materials);
        objLoader.load(objPath, function(obj){
            obj.name = objName;
            obj.position.set(x, y, z);
            obj.scale.set(scale, scale, scale);
            obj.rotation.y += yRotation;
            obj.castShadow = true;
            scene.add(obj);
        }, onProgress, onError);
    });
    
    function onProgress( xhr ) {
        if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );
        }
    }
    
    function onError() {
        console.log("Error while loading model");
    }
}

export async function fbxLoad (path, scene, camera, objName, x, y, z, scale, yRotation) {
    
    var loader = new FBXLoader();
    await loader.load( path, function ( object ) {
            mixer = new THREE.AnimationMixer( object );
            var action = mixer.clipAction( object.animations[ 0 ] );
            action.play();
            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                        childscale.set(scale, scale, scale);
                        child.castShadow = true;
                        child.receiveShadow = true;
                }
            } );
            scene.add( object );
    } );
}
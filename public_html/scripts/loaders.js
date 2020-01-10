import { GLTFLoader } from '../three.js-dev/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '../three.js-dev/examples/jsm/loaders/DRACOLoader.js';
import { MTLLoader } from '../three.js-dev/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from '../three.js-dev/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from '../three.js-dev/examples/jsm/loaders/FBXLoader.js';
import { TGALoader } from '../three.js-dev/examples/jsm/loaders/TGALoader.js';
import { AnimationMixer } from '../three.js-dev/src/animation/AnimationMixer.js';

export var mixer;

export async function gltfLoad(manager, path, scene, camera, objName, x, y, z, scale, yRotation) {
    // Instantiate a loader
    var loader = new GLTFLoader(manager);
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

                    gltf.scene.scale.set(scale, scale, scale); // THREE.Scene
                    gltf.scene.rotation.set(0, yRotation, 0);
                    gltf.scene.name = objName ;
                    gltf.scene.position.set(x, y, z);
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

export async function animatedGltfLoad(manager, path, scene, camera, objName, x, y, z, scale, yRotation) {
    // Instantiate a loader
    var loader = new GLTFLoader(manager);
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

                    mixer = new AnimationMixer( gltf.scene );
                    console.log(gltf);
                    var action = mixer.clipAction( gltf.animations[ 0 ] );
                    action.play();

 
                    gltf.scene.scale.set(scale, scale, scale); // THREE.Scene
                    gltf.scene.rotation.set(0, yRotation, 0);
                    gltf.scene.name = objName ;
                    gltf.scene.position.set(x, y, z);
                    scene.add( gltf.scene );

            },
            // called while loading is progressing
            function ( xhr ) {

                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
            function ( error ) {
                    console.log(error);
                    console.log( 'An error happened' );

            }
    );
}

export async function objLoad (manager, mtlPath, objPath, scene, camera, objName, x, y, z, scale, yRotation) {
    
    var mtlLoader = new MTLLoader();
    await mtlLoader.load(mtlPath, function(materials){

        materials.preload();
        var objLoader = new OBJLoader(manager);
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

export async function fbxLoad (manager, path, scene, camera, objName, x, y, z, scale, yRotation) {
    
    var loader = new FBXLoader(manager);
    await loader.load( path, function ( object ) {
            mixer = new THREE.AnimationMixer( object );
            var action = mixer.clipAction( object.animations[ 0 ] );
            action.play();
            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                        child.scale.set(scale, scale, scale);
                        child.castShadow = true;
                        child.receiveShadow = true;
                }
            } );
            scene.add( object );
    } );
}
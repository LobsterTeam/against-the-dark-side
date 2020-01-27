import { GLTFLoader } from '../three.js-dev/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '../three.js-dev/examples/jsm/loaders/DRACOLoader.js';
import { MTLLoader } from '../three.js-dev/examples/jsm/loaders/MTLLoader.js';
import { OBJLoader } from '../three.js-dev/examples/jsm/loaders/OBJLoader.js';
import { FBXLoader } from '../three.js-dev/examples/jsm/loaders/FBXLoader.js';
import { TGALoader } from '../three.js-dev/examples/jsm/loaders/TGALoader.js';
import { AnimationMixer } from '../three.js-dev/src/animation/AnimationMixer.js';
import * as THREE from '../three.js-dev/build/three.module.js';
import { terrainMeshes } from './terrain.js';
import { TransformControls } from '../three.js-dev/examples/jsm/controls/TransformControls.js';
import { scene, camera, renderer, render, densityList, densityIndex, finishLine, landspeederObject} from './main.js';


export var mixer, stormtroopers = [];

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
                    if (objName === "stormtrooper"){
                        var raycaster = new THREE.Raycaster();
                        raycaster.set(gltf.scene.position, new THREE.Vector3(0, -1, 0));
                        var intersects = raycaster.intersectObject(terrainMeshes[1]);
                        if (intersects.length !== 0){
                            console.log("intersect at", intersects[0].point);
                            gltf.scene.position.y = intersects[0].point.y;
                        }
                        var emitter = new THREE.Object3D();
                        emitter.position.set(0.0, 100.0, 0.0);
                        emitter.updateMatrixWorld();
                        stormtroopers.push(gltf.scene);
                        gltf.scene.add(emitter);
                    }
                    if (objName === "blaster") {
                        camera.add(gltf.scene);
                    } else {
                        scene.add( gltf.scene );
                    }
                    
                    gltf.scene.castShadow = true;
                    gltf.scene.receiveShadow = true;
                    gltf.scene.updateMatrixWorld();
                    gltf.scene.traverse( function( node ) {

                        if ( node instanceof THREE.Mesh ) { node.castShadow = true; }

                    } );
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
                mixer = new AnimationMixer(gltf.scene);
                var action = mixer.clipAction(gltf.animations[0]);
                action.play();
                
                gltf.scene.scale.set(scale, scale, scale); // THREE.Scene
                gltf.scene.rotation.set(0, yRotation, 0);
                gltf.scene.name = objName ;
                gltf.scene.position.set(x, y, z);
                if(objName === "stormtrooper-level"){
                    var material = gltf.scene.children[0].children[1].material;
                    material.needsUpdate = true;
                    material.map.minFilter =  THREE.LinearFilter;
                    material.side = THREE.DoubleSide;
                }
                gltf.scene.traverse( function( node ) {

                        if ( node instanceof THREE.Mesh ) { node.castShadow = true; }

                    } );

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
            obj.receiveShadow = true;

            if (obj.name === "tie-fighter-1"){
                for (var i = 0; i < densityList[densityIndex]; ++i ) {
                    var obj2 = obj.clone();
                    obj2.position.set(x, y, z - (i * (-finishLine / densityList[densityIndex])));
                    scene.add(obj2);
                }
                
            } else {
                if (objName === "r2-d2" || objName === "bottle") {
                    landspeederObject.add(obj);
                } else {
                    scene.add(obj);
                }
            }
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

export async function animatedFbxLoad (manager, path, scene, camera, objName, x, y, z, scale, yRotation) {
    
    var loader = new FBXLoader(manager);
    await loader.load( path, function ( object ) {
            object.name = objName;
            mixer = new AnimationMixer( object );
            var action = mixer.clipAction( object.animations[ 0 ] );
            action.play();
            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                    if (child.name === "bb8-body") {
                        child.scale.set(scale, scale, scale);
                        child.castShadow = true;
                        child.receiveShadow = true;
                        child.position.set(x, y + 15, z);
                    } else {

                        child.scale.set(scale, scale, scale);
                        child.castShadow = true;
                        child.receiveShadow = true;
                        child.position.set(x - 2, y, z);
                    }
                    child.rotation.z += Math.PI/2;
                }
            } );
            scene.add( object );
    },
                // called while loading is progressing
            function ( xhr ) {

                    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
            function ( error ) {
                    console.log(error);
                    console.log( 'An error happened' );

            });
}

export async function bb8FbxLoad (manager, path, scene, camera, objName, x, y, z, scale, yRotation) {
    
    var loader = new FBXLoader(manager);
    await loader.load( path, function ( object ) {
            object.name = objName;
            
            object.traverse( function ( child ) {
                if ( child.isMesh ) {
                    if (child.name === "bb8-body") {
                                                child.scale.set(scale, scale, scale);
                        child.castShadow = true;
                        child.receiveShadow = true;
                        child.position.set(x, y + 15, z);
                    } else if (child.name === "bb8-head"){

                        child.scale.set(scale, scale, scale);
                        child.castShadow = true;
                        child.receiveShadow = true;
                        child.position.set(x - 2, y - 7, z);
                    }
                    child.rotation.z += Math.PI/2;
                }
            } );
            scene.add( object );
    },
        // called while loading is progressing
    function ( xhr ) {

            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    // called when loading has errors
    function ( error ) {
            console.log(error);
            console.log( 'An error happened' );

    });
}
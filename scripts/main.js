import { FirstPersonControls } from '../three.js-dev/examples/jsm/controls/FirstPersonControls.js';
import * as THREE from '../three.js-dev/build/three.module.js';
import * as TERRAIN from './terrain.js';
import * as SUN from './sun.js';
import * as INTRO from './intro.js';


var container;
export var camera, scene, renderer, onLevelMap, listener, directionalLight, 
        perpIntroGroup, audioLoader, introSound, gameNameAnimation, skewedIntroGroup, rotatedGroup;
var mouseX = 0, mouseY = 0;     // mouse movement variables
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var object;
var i, j;       // loop identifiers

var directionalLight;
var gameNameAnimation = false, introAnimation = false;      // booleans to animate intro texts
var audioLoader;
var introSound;
var fromIntro = true, onLevelMap = false;       // to avoid recreate of the space background

var controls;
var mesh, texture;
var worldWidth = 256, worldDepth = 256,
        worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;
var clock = new THREE.Clock();

var startTerrain = false;

window.createLevelMap = createLevelMap;
window.toggleSound = toggleSound;


function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1e6);
    camera.position.z = 100;
    
    // scene
    scene = new THREE.Scene();
    //var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    //scene.add( ambientLight );
    //var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    //camera.add( pointLight );
    //scene.add( camera );

    // manager
    function loadModel() {
        object.traverse( function ( child ) {
                //if ( child.isMesh ) child.material.map = texture;
        } );
        object.position.y = - 95;
        scene.add( object );
    }

    //var manager = new THREE.LoadingManager( loadModel );
    //manager.onProgress = function ( item, loaded, total ) {
    //        console.log( item, loaded, total );
    //};

    // model
    function onProgress( xhr ) {
        if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );
        }
    }

    function onError() {
        console.log("Error while loading model");
    }

    //var mtlLoader = new THREE.MTLLoader();
    //mtlLoader.load("models/r2d2-obj/r2-d2.mtl", function(materials){

    //    materials.preload();
    //    var objLoader = new THREE.OBJLoader();
    //    objLoader.setMaterials(materials);
    //    objLoader.load("models/r2d2-obj/r2-d2.obj", function(obj){
    //        scene.add(obj);
    //    }, onProgress, onError);
    //})

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    //document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    //window.addEventListener( 'resize', onWindowResize, false );
    
    showStarWarsEntry();
    
    document.addEventListener("mousedown", function() {
        if (onLevelMap) {
            clearScene();       // clear everything from the scene
            createGameScene();
        }
    });
    
    window.addEventListener( 'resize', onWindowResize, false );
}



function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    if (startTerrain) {
        controls.handleResize();
    }
}

function render() {
    //camera.position.x += ( mouseX - camera.position.x ) * .05;
    //camera.position.y += ( - mouseY - camera.position.y ) * .05;
    
    
    // INTRO CHECKS
    if (gameNameAnimation) {
        perpIntroGroup.position.z -= 15;
        INTRO.setGameNameOpacity(perpIntroGroup);
        
    } else if (introAnimation) {
        // if it is too far then we dont need to set opacity because it is already 0
        if (perpIntroGroup.position.z > -7000) {
            perpIntroGroup.position.z -= 15;
            INTRO.setGameNameOpacity(perpIntroGroup);
        }
        skewedIntroGroup.position.y += 3;
        if (INTRO.setIntroTextOpacity(skewedIntroGroup, 0) == INTRO.gameIntrotextArr.length) {
            // if intro text is done create level map
            introAnimation = false;
            createLevelMap();
        }
    }
    //else if (onLevelMap) {            //MAYBE
    //    camera.position.z -= 100;
    //}
    
    //camera.lookAt( scene.position );
    renderer.render( scene, camera );
    
    if (startTerrain && controls !== undefined) {
        controls.update( clock.getDelta() );
    }
    
    requestAnimationFrame(render);
}


function showStarWarsEntry () {
    INTRO.createBackgroundWithStars();       // create background with stars
    
    // initilize light for intro
    directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(0, 1, 1);
    directionalLight.name = 'textLight';
    
    // initialize text groups
    perpIntroGroup = new THREE.Group();      // to work with text as a group
    perpIntroGroup.position.y = 0;
    perpIntroGroup.name = "perpIntroObjects";
    skewedIntroGroup = new THREE.Group();
    skewedIntroGroup.position.y = 0;
    rotatedGroup = new THREE.Group();
    rotatedGroup.name = "rotatedGroup";
    
    // create a global audio source
    var listener = new THREE.AudioListener();
    introSound = new THREE.Audio(listener);
    audioLoader = new THREE.AudioLoader();
    INTRO.createLongTimeAgoText();
}

// manage sound button according to current sound mode
export function toggleSound() {
    var icon = $('#soundIcon');
    if (icon.attr('src') === "./img/sound_on.png") {
        icon.attr('src', './img/sound_off.png');
        introSound.setVolume(0.0);      // TODO check introSound
        
    } else {
        icon.attr('src', './img/sound_on.png');
        introSound.setVolume(1.0);      // TODO check introSound
    }
}

function clearScene () {
    for(i = scene.children.length - 1; i >= 0; i--) {
        scene.remove(scene.children[i]);
    }
    introAnimation = false;
}

export function createLevelMap () {
    console.log("level map");
    gameNameAnimation = false;
    introAnimation = false;
    onLevelMap = true;

    if (fromIntro) {        // no need to create space background again
        //scene.remove("introObjects");
        $('#skipButton').hide();
        
        for(i = scene.children.length - 1; i >= 0; i--) {
            if (scene.children[i].name == "perpIntroObjects" 
                    || scene.children[i].name == "rotatedGroup") {
                console.log(scene.children[i].name);
                scene.remove(scene.children[i]);
            }
        }
        fromIntro = false;
        introSound.pause();
        //muteAudioSlowly();
        // TODO LIGHT DURUYOR
    } else {
        clearScene();   // remove everything from the scene
        INTRO.createBackgroundWithStars();        // create space in the background
    }
    // create map
}

function muteAudioSlowly () {
    while (introSound.getVolume() >= 0.0) {
        console.log(introSound.getVolume());
        introSound.setVolume(introSound.getVolume() - 0.01);
    }
    introSound.setVolume(0.0);
}

function createGameScene() {
    camera.position.z = 0;
    onLevelMap = false; // these needs to be checked later
    directionalLight.color.setHex(0xffffff);
    SUN.createSuns();
    createTerrain();
    createSky();
}

function createTerrain() {
    startTerrain = true;
    var loader  = new THREE.TextureLoader(), texture = loader.load( "img/sky.jpg" );
    //scene.background = texture;
    var data = TERRAIN.generateTerrainHeight( worldWidth, worldDepth );
    camera.position.y = data[ worldHalfWidth + worldHalfDepth * worldWidth ] * 10 + 500;
    var geometry = new THREE.PlaneBufferGeometry( 7500, 7500, worldWidth - 1, worldDepth - 1 );
    geometry.rotateX( - Math.PI / 2 );
    var vertices = geometry.attributes.position.array;
    for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
        vertices[ j + 1 ] = data[ i ] * 10;
    }
    texture = new THREE.CanvasTexture( TERRAIN.generateTerrainTexture( data, worldWidth, worldDepth ) );
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );
    scene.add( mesh );

    controls = new FirstPersonControls( camera, renderer.domElement );
    controls.movementSpeed = 1000;
    controls.lookSpeed = 0.1;
}

function createSky () {
    
    
}

export function setGameNameAnimation (bool) {
    gameNameAnimation = bool;    
}

export function setIntroAnimation (bool) {
    introAnimation = bool;    
}

init();
render();

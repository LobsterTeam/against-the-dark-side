import { FirstPersonControls } from '../three.js-dev/examples/jsm/controls/FirstPersonControls.js';
import * as THREE from '../three.js-dev/build/three.module.js';
import * as TERRAIN from './terrain.js';
import * as SKYANDSUN from './skyAndSun.js';
import * as INTRO from './intro.js';
import * as LOADERS from './loaders.js';
import * as PANEL from './controlPanel.js';
import * as DAT from '../three.js-dev/examples/jsm/libs/dat.gui.module.js';
import { TGALoader } from '../three.js-dev/examples/jsm/loaders/TGALoader.js';


var container;
export var camera, scene, renderer, onLevelMap, listener, directionalLight, 
        perpIntroGroup, audioLoader, introSound, gameNameAnimation, skewedIntroGroup, rotatedGroup;

// tatoo one properties
export var tatooOneAzimuth = 0.3, tatooOneInclination = 0.45, tatooOneLuminance = 1,
        tatooOneMieDirectionalG = 0.8, tatooOneRayleigh = 2, tatooOneMieCoefficient = 0.005;
// tatoo two properties
export var tatooTwoAzimuth = 0.25, tatooTwoInclination = 0.4, tatooTwoLuminance = 1,
        tatooTwoMieDirectionalG = 0.8, tatooTwoRayleigh = 2, tatooTwoMieCoefficient = 0.005;
// terrain scene sky colors
//export var topSkyColor = 0xbfe5fc, bottomSkyColor = 0xf8fcff;
export var topSkyColor = 0xE8BDAB , bottomSkyColor = 0xd2edfd;
var mouseX = 0, mouseY = 0;     // mouse movement variables
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var object;
var i, j;       // loop identifiers

var gameNameAnimation = false, introAnimation = false;      // booleans to animate intro texts
var audioLoader;
var introSound;
var fromIntro = true, onLevelMap = false;       // to avoid recreate of the space background

var controls;
var mesh, texture;
var worldWidth = 256, worldDepth = 1024,
        worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;
var clock = new THREE.Clock();

var hasInitialUserInput = false;
var startTerrain = false;

var speedStep = 5;

var landSpeeder;
var r2d2RightMove = true, r2d2MoveSpeed = 0.01;
var laserContainer;
var laserMesh;
var loadingSprite;
var modelsLoading = false;
var manager;
var sprite;

window.createLevelMap = createLevelMap;
window.toggleSound = toggleSound;


function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1e9);
    camera.position.z = 100;
    
    // scene
    scene = new THREE.Scene();
    
    
    var spriteMap = new THREE.TextureLoader().load( "img/loading.png" );
    var spriteMaterial = new THREE.SpriteMaterial( { map: spriteMap, color: 0xffffff } );
    sprite = new THREE.Sprite( spriteMaterial );
    //var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    //scene.add( ambientLight );
    //var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    //camera.add( pointLight );
    //scene.add( camera );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );
    
    showClick();

    document.addEventListener("mousedown", function() {
        if (onLevelMap) {
                   // clear everything from the scene
            clearScene();
            modelsLoading = true;
            renderer.render( scene, camera );
            createSprite(createGameScene);
            //createGameScene();
        }
    });
    
    window.addEventListener( 'resize', onWindowResize, false );
}

async function createSprite (callback) {
    
    
    sprite.scale.set(10, 10, 1)
    scene.add( sprite );
    await renderer.render( scene, camera );
    callback();
}

function showClick() {
    const skipclickbox = document.getElementById('skipclickbox');
    skipclickbox.style.display = 'block';
    skipclickbox.style.marginLeft = `-${parseInt(
        skipclickbox.offsetWidth / 2
    )}px`;
    skipclickbox.style.marginTop = `-${parseInt(
        skipclickbox.offsetHeight / 2
    )}px`;
    document.addEventListener('click', skipClick);
    document.addEventListener('keydown', skipClick);

}

function skipClick() {
    if (document.getElementById("skipclickbox").style.display !== 'none'){
        showStarWarsEntry();
        document.getElementById("skipclickbox").style.display = 'none';
        document.getElementById("soundbutton").style.display = 'block';
        document.getElementById("skipButton").style.display = 'block';
    }
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
    if (!modelsLoading) {
        renderer.render( scene, camera );
    }
    
    if (startTerrain && controls !== undefined) {
        controls.update( clock.getDelta() );
    }
    
    if (landSpeeder) {
        for (i = scene.children.length - 1; i >= 0; i--) {
            var child = scene.children[i];
            if (child.name === "landspeeder"){
                child.position.set(camera.position.x - 130, camera.position.y - 300, camera.position.z - 250);
            } else if (child.name === "r2-d2") {
                child.position.set(camera.position.x - 130, camera.position.y - 480, camera.position.z - 700);
                r2d2Move(child);
            } else if (child.name === "blaster") {
                child.position.set(camera.position.x, camera.position.y - 5, camera.position.z - 10);
            }
        }
    }
    
    if(LOADERS.mixer){
        LOADERS.mixer.update( clock.getDelta() * 100 );
    }
    
    requestAnimationFrame(render);
}

function r2d2Move (r2d2) {
    
    if (r2d2.rotation.y > 5.0) {
        r2d2RightMove = false;
    } else if (r2d2.rotation.y < 1.0) {
        r2d2RightMove = true;
    }
    
    if (r2d2RightMove) {
        r2d2.rotation.y += r2d2MoveSpeed;
    } else {
        r2d2.rotation.y -= r2d2MoveSpeed;
    }    
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
    modelsLoading = true;
    SKYANDSUN.createTatooSuns(topSkyColor, bottomSkyColor,
                    0xFDE585, tatooOneRayleigh, tatooOneMieCoefficient, tatooOneMieDirectionalG,
                    tatooOneLuminance, tatooOneInclination, tatooOneAzimuth,
                    0xF9FFEF, tatooTwoRayleigh, tatooTwoMieCoefficient, tatooTwoMieDirectionalG,
                    tatooTwoLuminance, tatooTwoInclination, tatooTwoAzimuth);
    createTerrain();
    createTerrainSceneLights();
    loadR2D2();
    laser();
    PANEL.createGUI();

}

function createTerrainSceneLights () {
    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    //hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 50, 0 );
    scene.add( hemiLight );   
}

function createGUI () {
    var gui = new DAT.GUI();
    
    var parameters = {
        x: 0, y: 30, z: 0,
        color: "#ff0000",
        opacity: 1,
        visible: true,
        material: "Phong",
    };
    
    var folder1 = gui.addFolder('Posizyon');
    var cubeX = folder1.add( parameters, 'x' ).min(-200).max(200).step(1).listen();
    var cubeY = folder1.add( parameters, 'y' ).min(0).max(100).step(1).listen();
    var cubeZ = folder1.add( parameters, 'z' ).min(-200).max(200).step(1).listen();
    folder1.open();
    console.log(gui);
    
    //scene.add(gui);
    
    
}

function loadR2D2 () {
    
    manager = new THREE.LoadingManager();
    manager.onLoad = function ( ) {
            console.log( 'Loading complete!');
            loadStormtroopers();
    };
    
    LOADERS.objLoad(manager, "models/r2d2-obj/r2-d2.mtl", "models/r2d2-obj/r2-d2.obj", 
                    scene, camera, "r2-d2", camera.position.x - 130, camera.position.y - 480,
                    camera.position.z - 700, 3, 2.5);         // TODO onload
}

function loadStormtroopers () {
    //LOADERS.objLoad ("models/stormtrooper-obj/stormtrooper.mtl", "models/stormtrooper-obj/stormtrooper.obj",
    //                scene, camera, "objName",camera.position.x - 130, camera.position.y - 480,
    //                camera.position.z - 5000, 200, 0);
    manager = new THREE.LoadingManager();
    manager.onLoad = function ( ) {
            console.log( 'Stormtrooper loading complete!');
            loadBlaster();
    };
    
    LOADERS.animatedGltfLoad(manager, "models/animated/stormtrooper/untitled.glb", 
                    scene, camera, "stormtrooper", camera.position.x - 130, camera.position.y - 480,
                    camera.position.z - 700, 2500, 0);         // TODO onload
}

function loadTieFighters () {
    //LOADERS.objLoad ("models/tie-fighter-1-obj/starwars-tie-fighter.mtl", "models/tie-fighter-1-obj/starwars-tie-fighter.obj",
    //                scene, camera, "objName",camera.position.x - 130, camera.position.y - 480,
    //                camera.position.z - 5000, 200, 0);
}

function loadBlaster () {
    
    manager = new THREE.LoadingManager();
    manager.onLoad = function ( ) {
            console.log( 'Loading complete! BLASTER');
            loadLandspeeder();
    };
    
    LOADERS.gltfLoad(manager, 'models/blaster-gltf/blaster.gltf', scene, camera, 
                                "blaster", camera.position.x, camera.position.y - 5,
                                camera.position.z - 10, 2, Math.PI / 2);        // TODO onload
}


function loadLandspeeder () {
    
    manager = new THREE.LoadingManager();
    manager.onLoad = function ( ) {
            scene.remove(sprite);
            modelsLoading = false;
            console.log( 'Landspeeder loading complete!');
    };

    landSpeeder = LOADERS.gltfLoad(manager, 'models/landspeeder-gltf/landspeeder.gltf', scene, camera, 
                                "landspeeder", camera.position.x - 130, camera.position.y - 300,
                                camera.position.z - 250, 100, Math.PI);        // TODO onload

    if (landSpeeder) {      // when scene is loaded add controls
        controls = new FirstPersonControls( camera );
        controls.autoForward = true;
        controls.speedStep = speedStep;
        controls.movementSpeed = 500;
        controls.lookSpeed = 0.1;
    }    
}


function createTerrain1() {
    startTerrain = true;
    var loader  = new THREE.TextureLoader(), texture = loader.load( "img/sky.jpg" );
    //scene.background = texture;
    var data = TERRAIN.generateTerrainHeight( worldWidth, worldDepth );
    //camera.position.y = data[ worldHalfWidth + worldHalfDepth * worldWidth ] * 10 + 500;
    var geometry = TERRAIN.makeTile(0.1, 40);
    var terrain_material = new THREE.MeshLambertMaterial({color: new THREE.Color(0.9, 0.55, 0.4)});
    var terrain = new THREE.Mesh(geometry, terrain_material);
    terrain.position.x = -2;
    terrain.position.z = -2;
    terrain.updateMatrixWorld(true);
    console.log(terrain.position.x);
    scene.add(terrain);
    
    controls = new FirstPersonControls( camera );
    //controls.autoForward = true;
    controls.speedStep = speedStep;
    controls.movementSpeed = 500;
    controls.lookSpeed = 0.1;
}

function createTerrain() {
    startTerrain = true;
    //var loader  = new THREE.TextureLoader(), texture = loader.load( "img/sky.jpg" );
    //scene.background = texture;
    //var data = TERRAIN.generateTerrainHeight( worldWidth, worldDepth );
    //camera.position.y = data[ worldHalfWidth + worldHalfDepth * worldWidth ] * 10 + 500;
    //var geometry = new THREE.PlaneBufferGeometry( 7500, 30000, worldWidth - 1, worldDepth - 1 );
    //geometry.rotateX( - Math.PI / 2 );
    //var vertices = geometry.attributes.position.array;
    //for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
    //    vertices[ j + 1 ] = data[ i ] * 10;
    //}
    //texture = new THREE.CanvasTexture( TERRAIN.generateTerrainTexture( data, worldWidth, worldDepth ) );
    //texture.wrapS = THREE.ClampToEdgeWrapping;
    //texture.wrapT = THREE.ClampToEdgeWrapping;
    //mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );
    //scene.add( mesh );
    
    var heightMapWidth = 512;
    var heightMapDepth = 512;
    var worldMapWidth = 100 * 0.3 * heightMapWidth;
    var worldMapDepth = 100 * 0.3 * heightMapDepth;
    var worldMapMaxHeight = 1000;
    var terrain = new TERRAIN.Terrain();
    var terrainMesh = terrain.init(worldMapWidth, worldMapMaxHeight, worldMapDepth);
    scene.add(terrainMesh);
    camera.position.z = 6000;
    camera.position.y = 1000;

    
}

function laser () {
    laserContainer = new THREE.Object3D();
    laserContainer.scale.set(0.8, 0.8, 0.8);
    laserContainer.name = "laser";
    scene.add(laserContainer);
    var laser = new THREE.CubeGeometry(6, 800, 6);
    var material = new THREE.MeshBasicMaterial({ color: 0xf43b3c, opacity: 0.5 });

    laserMesh = new THREE.Mesh(laser, material);
    laserMesh.rotation.set(Math.PI / 2, 0, 0);
    laserContainer.add(laserMesh);
    laserMesh.visible = false;
}

export function fire (x, y, z) {
    laserContainer.position.set(x, camera.position.y - 5, camera.position.z - 10);
    console.log(laserContainer.position);
    //laserMesh.rotation.set(Math.PI / 2, 0, 0);        // must depend on mouse
    laserMesh.visible = true;
    var distance = 10000;
    var tweentime = 300;
    //var tween0 = new TWEEN.Tween(laserMesh.position)
    //    .to({ x: distance }, tweentime)
    //    .easing(TWEEN.Easing.Linear.EaseNone);
    //tween0.start();
}

export function setGameNameAnimation (bool) {
    gameNameAnimation = bool;    
}

export function setIntroAnimation (bool) {
    introAnimation = bool;    
}

init();
render();

import { FirstPersonControls } from '../three.js-dev/examples/jsm/controls/FirstPersonControls.js';
import * as THREE from '../three.js-dev/build/three.module.js';
import * as TERRAIN from './terrain.js';
import * as SKYANDSUN from './skyAndSun.js';
import * as INTRO from './intro.js';
import * as LOADERS from './loaders.js';
import * as PANEL from './controlPanel.js';
import * as EXPLOSION from './explosion.js';
import * as DAT from '../three.js-dev/examples/jsm/libs/dat.gui.module.js';
import { TransformControls } from '../three.js-dev/examples/jsm/controls/TransformControls.js';
import { CSS2DRenderer, CSS2DObject } from '../three.js-dev/examples/jsm/renderers/CSS2DRenderer.js';

var container;
export var camera, scene, renderer, onLevelMap, listener, directionalLight, 
        perpIntroGroup, audioLoader, introSound, levelSound, gameNameAnimation, skewedIntroGroup,
        rotatedGroup, particleArray = [], finishLine = -60000, enemyDensity;
var labelRenderer, gameOverRenderer;
// terrain scene sky colors
//export var topSkyColor = 0xbfe5fc, bottomSkyColor = 0xdcdbdf;
//export var topSkyColor = 0xE8BDAB , bottomSkyColor = 0xd2edfd;
export var topSkyColor = 0xE8BDAB , bottomSkyColor = 0xdcdbdf;

// blaster values
export var blasterTransX;
export var blasterTransY = 0, blasterTransZ = 0,
        blasterRotX = 0, blasterRotY = 0, blasterRotZ = 0;
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

var speedStep = 5;      // camera speed

var landSpeeder;
var r2d2RightMove = true, r2d2MoveSpeed = 0.01;
var loadingSprite;
var modelsLoading = false, manager;
var tween;
var transformControls;
var lasers = [], laserSpeed = 100, delta = 0;

var listener;

var levels = [1, 1, 0];

window.createLevelMap = createLevelMap;
window.toggleSound = toggleSound;


function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.5, 1e9);
    camera.position.z = 100;
    blasterTransX = 0;
    
    // scene
    scene = new THREE.Scene();
    //scene.add( camera );

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild( renderer.domElement );
    transformControls = new TransformControls( camera, renderer.domElement );
    
    showClick();
    EXPLOSION.addParticles();


    
    window.addEventListener( 'resize', onWindowResize, false );
}

function createLoadingText (callback) {    
    manager = new THREE.LoadingManager();
    manager.onLoad = function ( ) {
        console.log( 'Text loading complete!');
        loadBB8(callback);

    };
    
    manager.onError = function(error) {
        console.log(error);
    };
    
    var material = new THREE.MeshPhongMaterial( { color: 0xd6835b, dithering: true } );
    var geometry = new THREE.PlaneBufferGeometry( 2000, 2000 );
    var mesh = new THREE.Mesh( geometry, material );
    mesh.position.set( 0, - 100, -300 );
    mesh.receiveShadow = true;
    scene.add( mesh );
    camera.position.set(0.0, 0.0, 0.0);
    
    var loadingGroup =  new THREE.Group();
    loadingGroup.position.x = 130;
    loadingGroup.position.y = 0;
    loadingGroup.position.z = -230;
    loadingGroup.rotation.y = -Math.PI / 6;
    loadingGroup.name = "loading";
    INTRO.loadLoadingTextFont(manager, loadingGroup, "LOADING...", "fonts/arial.json", 10, 0xFFFFFF, 0, 0);
    scene.add(loadingGroup);
    
    createLoadingSpotlight(100, 0, 0, camera.position.x - 120, camera.position.y, camera.position.z - 300, Math.PI/10);
    createLoadingSpotlight(-100, 0, 0, camera.position.x + 150, camera.position.y, camera.position.z - 300, Math.PI/14);
}

function createLoadingSpotlight(posX, posY, posZ, tarX, tarY, tarZ, angle){
    var pl = new THREE.SpotLight( 0xffffff, 1.0 );
    pl.position.set(posX, posY, posZ );
    pl.target.position.set(tarX, tarY, tarZ);
    pl.angle = angle;
    pl.penumbra = 0.05;
    pl.decay = 1;
    pl.distance = 2000;

    pl.castShadow = true;
    pl.shadow.mapSize.width = 1024;
    pl.shadow.mapSize.height = 1024;
    pl.shadow.camera.near = 1;
    pl.shadow.camera.far = 2000;
    scene.add(pl);
    scene.add(pl.target);
}

function loadBB8(callback) {
    manager = new THREE.LoadingManager();
    manager.onLoad = function() {
        console.log( 'BB8 loading complete!');
        renderer.render( scene, camera );
        console.log(scene);
        callback();
    }
    manager.onError = function(error) {
        console.log(error);
    };
    LOADERS.bb8FbxLoad(manager, "models/animated/bb8/forceawakenslopo.blend.fbx", 
           scene, camera, "bb8-running", camera.position.x - 150, camera.position.y - 30,
            camera.position.z - 300, 50, 0);         // TODO onload
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
        // controls patliyor undefined da
        controls.handleResize();
    }
}

export function render() {
    //camera.position.x += ( mouseX - camera.position.x ) * .05;
    //camera.position.y += ( - mouseY - camera.position.y ) * .05;
    if (camera.position.z <= finishLine) {
        console.log("Game ended");
    }
    
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
    
    if (onLevelMap) {
        labelRenderer.render(scene, camera);
    }
    
    if (startTerrain && controls !== undefined) {
        controls.update( clock.getDelta() );
    }
    
    if (landSpeeder) {
                
        if (camera.position.z >= 50000) {
            // game over
        }
        
        for (i = scene.children.length - 1; i >= 0; i--) {
            var child = scene.children[i];
            if (child.name === "landspeeder"){
                child.position.set(camera.position.x - 130, camera.position.y - 300, camera.position.z - 250);
            } else if (child.name === "r2-d2") {
                child.position.set(camera.position.x - 130, camera.position.y - 480, camera.position.z - 700);
                r2d2Move(child);
            } else if (child.name === "blaster") {
                child.position.copy( camera.position );
                child.rotation.copy(camera.rotation);
                child.translateX(2 + blasterTransX);
                child.translateY(-2.3 + blasterTransY);
                child.translateZ(-3.5 + blasterTransZ);
                child.rotateX(blasterRotX);
                child.rotateY(Math.PI / 2 + blasterRotY);
                child.rotateZ(blasterRotZ);
                child.updateMatrix();
            } else if (child.name === "stormtrooper"){
                child.lookAt(camera.position);
            } else if (child.name === "bottle") {
                child.position.set(camera.position.x - 270, camera.position.y - 350, camera.position.z);
            } 
        }
        
         delta = clock.getDelta();
        lasers.forEach(b => 
            b.translateX(laserSpeed * delta) // move along the local z-axis
        );
    }
   

    
    if(LOADERS.mixer){
        LOADERS.mixer.update( clock.getDelta() );
    }
    
    TWEEN.update();
    
    requestAnimationFrame(render);
}

function gameOver() {
    var gameOverDiv = document.getElementById("game-over");
    var gameOverObject = new CSS2DObject(gameOverDiv);
    scene.add(gameOverObject);
    
    gameOverRenderer = new CSS2DRenderer();
    gameOverRenderer.setSize( window.innerWidth, window.innerHeight );
    gameOverRenderer.domElement.style.position = 'absolute';
    gameOverRenderer.domElement.style.top = 0;
    document.body.appendChild( gameOverRenderer.domElement );
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
    audioLoader = new THREE.AudioLoader();
    listener = new THREE.AudioListener();
    camera.add(listener);
    
    introSound = new THREE.Audio(listener);

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
        //muteAudioSlowly();
}

export function createLevelMap () {
    console.log("level map");
    var loader  = new THREE.TextureLoader(), texture = loader.load( "img/sky.jpg" );
    scene.background = texture;
    gameNameAnimation = false;
    introAnimation = false;
    onLevelMap = true;

    if (fromIntro) {        // no need to create space background again
        //scene.remove("introObjects");
        $('#skipButton').hide();
        
        for(i = scene.children.length - 1; i >= 0; i--) {
            if (scene.children[i].name === "perpIntroObjects" 
                    || scene.children[i].name === "rotatedGroup") {
                console.log(scene.children[i].name);
                scene.remove(scene.children[i]);
            }
        }
        fromIntro = false;
        introSound.setVolume(0.0);
        introSound.pause();
        //muteAudioSlowly();
        // TODO LIGHT DURUYOR
    }
    clearScene();   // remove everything from the scene
    
    
    
    var levelMapLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
    levelMapLight.position.set(0, 0, 0);
    scene.add(levelMapLight);
    //scene.add(levelMapLight.target);

    
    
    manager = new THREE.LoadingManager();
    manager.onLoad = function ( ) {
            //levelMapLight.target.position.set(scene.getObjectByName("stormtrooper-level").position);

            
            console.log( 'Level map stormtrooper Loading complete!');
    };
    
    loadLevelModel();
    
    var levelMapDiv = document.getElementById("levels");
    var levelMapObject = new CSS2DObject(levelMapDiv);
    scene.add(levelMapObject);
    
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = 0;
    document.body.appendChild( labelRenderer.domElement );
    
    var levelItems = document.getElementsByClassName("dot");
    
    for (i = 0; i < levelItems.length; i++){
        switch(levelItems[i].innerText){
            case "1":
                levelItems[i].addEventListener("mousedown", function() {
                    if(levels[0]){
                        enemyDensity = 10;
                        if (levelSound){
                            levelSound.pause();
                        }
                        generateLevelInit();
                    }
                });
                break;
            case "2":
                levelItems[i].addEventListener("mousedown", function() {
                    if (levels[1]){
                        enemyDensity = 17;
                        if (levelSound){
                            levelSound.pause();
                        }
                        generateLevelInit();
                    }
                });
                break;
            case "3":
                levelItems[i].addEventListener("mousedown", function() {
                    if (levels[2]){
                        enemyDensity = 30;
                        if (levelSound){
                            levelSound.pause();
                        }
                        generateLevelInit();
                    }
                });
                break;
        }
    }

    
    // create map
}

function generateLevelInit() {
    clearScene();
    modelsLoading = true;
    createLoadingText(createGameScene);

}

function loadLevelModel() {
    var rand = Math.floor(Math.random() * 3) + 1;
    if (rand === 1) {
        audioLoader.load('sounds/chicken-cut.ogg', function(buffer) {
            levelSound = new THREE.Audio(listener);
            levelSound.setBuffer(buffer);
            levelSound.setLoop(true);
            levelSound.setVolume(1.0);
            camera.add(levelSound);
            levelSound.play();

        });
        LOADERS.animatedGltfLoad(manager, "models/animated/stormtrooper/chicken.glb", 
        scene, camera, "stormtrooper-level", camera.position.x + 3, camera.position.y - 2,
        camera.position.z - 5, 1, -Math.PI/6);
    } else if (rand === 2) {
        audioLoader.load('sounds/twist-cut.ogg', function(buffer) {
            levelSound = new THREE.Audio(listener);
            levelSound.setBuffer(buffer);
            levelSound.setLoop(true);
            levelSound.setVolume(1.0);
            levelSound.play();
        });
        camera.add(levelSound);
        LOADERS.animatedGltfLoad(manager, "models/animated/stormtrooper/twist-dance.glb", 
        scene, camera, "stormtrooper-level", camera.position.x + 3, camera.position.y - 2,
        camera.position.z - 5, 0.9, -Math.PI/6);
    } else {
        LOADERS.animatedGltfLoad(manager, "models/animated/stormtrooper/stormtrooper-moonwalk.glb", 
        scene, camera, "stormtrooper-level", camera.position.x + 3, camera.position.y - 2,
        camera.position.z - 5, 0.8, -Math.PI/2);
    }

}

function muteAudioSlowly () {
    while (introSound.getVolume() >= 0.0) {
        console.log(introSound.getVolume());
        introSound.setVolume(introSound.getVolume() - 0.01);
    }
    introSound.setVolume(0.0);
}

function createGameScene() {
    camera.position.x = 0;
    camera.position.y = 300;
    camera.position.z = 0;
    scene.fog = new THREE.Fog( bottomSkyColor, 5000, 80000 );
    onLevelMap = false; // these needs to be checked later
    modelsLoading = true;
    SKYANDSUN.createTatooSuns(topSkyColor, bottomSkyColor, 0xFDE585, 0xfdf2c2);
    createTerrain();
    createTerrainSceneLights();
    loadTieFighters();
    loadR2D2();
}

function createTerrainSceneLights () {
    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    //hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 50, 0 );
    scene.add( hemiLight );   
}

function loadR2D2 () {
    
    manager = new THREE.LoadingManager();
    manager.onLoad = function ( ) {
            console.log( 'R2D2 Loading complete!');
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
    
    manager.onError = function(error) {
        console.log(error);
    };
    
    for (var j = 1; j < enemyDensity + 1; j++){
        var randomInt = Math.floor(Math.random() * (1000000 - 1 + 1)) + 1;
        var posX;
        if(randomInt % 2){
            posX = 4000;
        } else {
            posX = -4000;
        }
        LOADERS.gltfLoad(manager, "models/animated/stormtrooper/test.glb", 
        scene, camera, "stormtrooper", posX, camera.position.y,
        camera.position.z - (j * (-finishLine / enemyDensity)), 100, 0);         // TODO onload
    }
}

function loadTieFighters () {
    manager = new THREE.LoadingManager();
    manager.onLoad = function ( ) {
            console.log( 'Tiefighter loading complete!');
    };
    LOADERS.objLoad (manager, "models/tie-fighter-1-obj/starwars-tie-fighter.mtl", "models/tie-fighter-1-obj/starwars-tie-fighter.obj",
                    scene, camera, "tie-fighter-1",camera.position.x - 130, camera.position.y + 480,
                    -10000, 20, 0);
}

function loadBlaster () {
    
    manager = new THREE.LoadingManager();
    manager.onLoad = function ( ) {
            console.log( 'Loading complete! BLASTER');
            loadBottle();
    };
    
    LOADERS.gltfLoad(manager, 'models/blaster-gltf/blaster.gltf', scene, camera, 
                                "blaster", camera.position.x, camera.position.y - 5,
                                camera.position.z - 10, 2, Math.PI / 2);        // TODO onload
}
function loadBottle () {
    
    manager = new THREE.LoadingManager();
    manager.onLoad = function ( ) {
        loadLandspeeder();
        console.log( 'Bottle loading complete!');
    };
    LOADERS.objLoad (manager, "models/bottle-obj/bottle.mtl", "models/bottle-obj/bottle.obj", scene, camera,
                    "bottle", camera.position.x - 1.25, camera.position.y - 1.5, camera.position.z , 5, 0);
}

function loadLandspeeder () {
    
    manager = new THREE.LoadingManager();
    manager.onLoad = function ( ) {
            modelsLoading = false;
            for(i = 0; i < 7; i++ ){
                scene.remove(scene.children[0]);
            }
            EXPLOSION.explode();
            PANEL.createGUI();
            //SKYANDSUN.tatooOne.target = scene.getObjectByName( "landspeeder" );
            console.log(scene);
            console.log( 'Landspeeder loading complete!');
            clock = new THREE.Clock();
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

function createTerrain() {
    startTerrain = true;
    //var loader  = new THREE.TextureLoader(), texture = loader.load( "img/sky.jpg" );
    //scene.background = texture;
    var desertHeightMap = document.getElementById('heightMap');
    TERRAIN.generateDesertTerrain(desertHeightMap, scene);
}

export function fire (x, y, z) {
    
    var laser = new THREE.CubeGeometry(10, 0.2, 0.2);
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000, opacity: 0.5 });
    var laserMesh = new THREE.Mesh(laser, material);
    var blaster = scene.getObjectByName("blaster");
    
    laserMesh.position.set(blaster.position.x - 0.2, blaster.position.y + 0.7, blaster.position.z);
    laserMesh.quaternion.copy(blaster.quaternion);
    lasers.push(laserMesh);
    scene.add(laserMesh);
}

// SETTERS
export function setGameNameAnimation (bool) {
    gameNameAnimation = bool;    
}

export function setIntroAnimation (bool) {
    introAnimation = bool;    
}

export function setBlasterTransX (value) {
    blasterTransX = value;
}

export function setBlasterTransY (value) {
    blasterTransY = value;
}

export function setBlasterTransZ (value) {
    blasterTransZ = value;
}

export function setBlasterRotX (value) {
    blasterRotX = value;
}

export function setBlasterRotY (value) {
    blasterRotY = value;
}

export function setBlasterRotZ (value) {
    blasterRotZ = value;
}

init();
render();

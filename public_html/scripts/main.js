import { FirstPersonControls } from '../three.js-dev/examples/jsm/controls/FirstPersonControls.js';
import { PointerLockControls } from '../three.js-dev/examples/jsm/controls/PointerLockControls.js';
import Stats from '../three.js-dev/examples/jsm/libs/stats.module.js';
import * as THREE from '../three.js-dev/build/three.module.js';
import * as TERRAIN from './terrain.js';
import * as SKYANDSUN from './skyAndSun.js';
import * as INTRO from './intro.js';
import * as LOADERS from './loaders.js';
import * as PANEL from './controlPanel.js';
import * as EXPLOSION from './explosion.js';
import * as FLAG from './flag.js';
import * as DAT from '../three.js-dev/examples/jsm/libs/dat.gui.module.js';
import { CSS2DRenderer, CSS2DObject } from '../three.js-dev/examples/jsm/renderers/CSS2DRenderer.js';
import * as USERINPUTS from './userInputs.js';
import * as LASER from './laser.js';

export var camera, scene, renderer, onLevelMap, audioListener, directionalLight, 
        perpIntroGroup, audioLoader, introSound, levelSound, gameNameAnimation, skewedIntroGroup,
        rotatedGroup, particleArray = [], finishLine = -60000;
// terrain scene sky colors
export var topSkyColor = 0xE8BDAB , bottomSkyColor = 0xdcdbdf;
// blaster values
export var blasterTransX, blasterTransY = 0, blasterTransZ = 0,
        blasterRotX = 0, blasterRotY = 0, blasterRotZ = 0;
export var controls, gameMode = true, gameStarted, emitter, userLasers = [], 
        enemyLasers = [], currentDelta;
export var cameraSpeed, flagGeometry, landspeederObject, canvas, sphereMirror, crosshair;
export var levels = [1, 1, 0], densityList = [10, 17, 30], densityIndex = 0;
export var gunSound, gunSoundBuffer, modelsLoading = false;
export var flatShading = false;


var container;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var flagObject;
var i, j, k;       // loop identifiers
var labelRenderer, gameOverRenderer, finishedRenderer;
var gameNameAnimation = false, introAnimation = false;      // booleans to animate intro texts
var audioLoader, introSound;
var fromIntro = true, onLevelMap = false;       // to avoid recreate of the space background
var clock = new THREE.Clock();
var r2d2RightMove = true, r2d2MoveSpeed = 0.01;
var manager, loadingPlaneMesh;
var speedStep = 1, backwardFinishLine = 3000;
var sphereMirrorMaterial, cubeCamera, cubeCamera2, cubeCameraCount = 0, showSphereMirror = false;
var levelMapDiv, levelMapObject, gameOverDiv, gameOverObject, finishLevelDiv, finishLevelObject;
var gameOverHomeButton, gameOverRestartButton, finishHomeButton, finishNextButton;
var tick = 0, r2d2Object, stats;

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

    canvas = document.createElement( 'canvas' );
    var context = canvas.getContext( 'webgl2', { alpha: false } );
    renderer = new THREE.WebGLRenderer({canvas: canvas, context: context});
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild( renderer.domElement );
    $('html,body').css('cursor', 'default');
    
    showClick();

    window.addEventListener( 'resize', onWindowResize, false );
    document.addEventListener( 'keydown', USERINPUTS.onKeyDown, false );
    document.addEventListener( 'keyup', USERINPUTS.onKeyUp, false );
    document.addEventListener( 'mousemove', USERINPUTS.mouseMove, false );
    document.addEventListener( 'mousedown', USERINPUTS.mouseDown, false );
    
    stats = new Stats();
    container.appendChild(stats.dom);
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
    var loadingPlaneMesh = new THREE.Mesh( geometry, material );
    loadingPlaneMesh.position.set( 0, - 100, -300 );
    loadingPlaneMesh.receiveShadow = true;
    scene.add( loadingPlaneMesh );
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
    };
    manager.onError = function(error) {
        console.log(error);
    };
    LOADERS.bb8FbxLoad(manager, "models/animated/bb8/forceawakenslopo.blend.fbx", 
           scene, camera, "bb8-running", camera.position.x - 150, camera.position.y - 30,
            camera.position.z - 300, 50, 0);
}

function showClick() {
    const skipclickbox = document.getElementById('skipclickbox');

    document.addEventListener('click', skipClick);
    document.addEventListener('keydown', skipClick);
}

function skipClick() {
    if (document.getElementById("skipclickbox").style.display !== 'none'){
        showStarWarsEntry();
        document.getElementById("skipclickbox").style.display = 'none';
        document.getElementById("soundbutton").style.display = 'block';
        document.getElementById("skipButton").style.display = 'block';
        document.removeEventListener('click', skipClick);
        document.removeEventListener('keydown', skipClick);
    }
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

export function render() {
    stats.update();
    TWEEN.update();
    // INTRO CHECKS
    if (gameNameAnimation) {
        console.log(gameNameAnimation);
        if (onLevelMap || gameStarted) {
            gameNameAnimation = false;
        }
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
    } else if (introSound !== undefined && introSound.isPlaying) {
        introSound.stop();
    }

    if (!modelsLoading) {
        renderer.render( scene, camera );
    }
    
    
    if (gameStarted) {
                
        if (camera.position.z < backwardFinishLine && camera.position.z > finishLine && gameMode) {
            
            currentDelta = clock.getDelta();
            camera.position.x = cameraSpeed.x;
            camera.position.y = cameraSpeed.y;
            camera.position.z += currentDelta * cameraSpeed.z;
            for (i = 0; i < camera.children.length; i++){
                var child = camera.children[i];
                if (child.name === "blaster"){
                    var meshes = [];
                    child.traverse( function( node ) {

                        if ( node instanceof THREE.Mesh ) { 
                            meshes.push(node);
                        }
                    } );
                    for (j = 0; j < meshes.length; j++){
                        if (USERINPUTS.flatShading === 0){
                            meshes[j].material = new THREE.MeshPhongMaterial({color: meshes[j].material.color,
                                                                                map: meshes[j].material.map});
                        } else if (USERINPUTS.flatShading === 1) {
                            meshes[j].material = new THREE.MeshLambertMaterial({color: meshes[j].material.color,
                                                                                map: meshes[j].material.map});
                        } else if (USERINPUTS.flatShading === 2) {
                            meshes[j].material = new THREE.MeshStandardMaterial({color: meshes[j].material.color,
                                                                                map: meshes[j].material.map});
                        }
                    }
                }
            }
        
            for (i = scene.children.length - 1; i >= 0; i--) {
                var child = scene.children[i];
                if (child.name === "landspeeder"){
                    var children = child.children;
                    for (j = 1; j < children.length; j++){
                        if(children[j].name === "r2-d2"){
                            var mesh = children[j].children[0];
                            if (USERINPUTS.flatShading === 0){
                                mesh.material = new THREE.MeshPhongMaterial({map: mesh.material.map});
                            } else if (USERINPUTS.flatShading === 1) {
                                mesh.material = new THREE.MeshLambertMaterial({map: mesh.material.map});
                            } else if (USERINPUTS.flatShading === 2) {
                                mesh.material = new THREE.MeshStandardMaterial({map: mesh.material.map});
                            }
                        } else if (children[j].name === "box") {
                            var mesh = children[j];
                            if (USERINPUTS.flatShading === 0){
                                mesh.material = new THREE.MeshPhongMaterial({map: mesh.material.map});
                            } else if (USERINPUTS.flatShading === 1) {
                                mesh.material = new THREE.MeshLambertMaterial({map: mesh.material.map});
                            } else if (USERINPUTS.flatShading === 2) {
                                mesh.material = new THREE.MeshStandardMaterial({map: mesh.material.map});
                            }
                        } else if (children[j].name === "bottle") {
                            var materials = children[j].children[0].material;
                            for (k = 0; k < materials.length; k++){
                                if (USERINPUTS.flatShading === 0){
                                    materials[k] = new THREE.MeshPhongMaterial({color: materials[k].color});
                                } else if (USERINPUTS.flatShading === 1) {
                                    materials[k] = new THREE.MeshLambertMaterial({color: materials[k].color});
                                } else if (USERINPUTS.flatShading === 2) {
                                    materials[k] = new THREE.MeshStandardMaterial({color: materials[k].color});
                                }
                            }
                            
                        }
                    }
                    child.position.set(camera.position.x - 130, camera.position.y - 300, camera.position.z - 250);
                    var meshes = [];
                    
                    child.children[0].traverse( function( node ) {

                        if ( node instanceof THREE.Mesh ) { 
                            meshes.push(node);
                        }
                    } );
                    for (j = 0; j < meshes.length; j++){
                        if (USERINPUTS.flatShading === 0){
                            meshes[j].material = new THREE.MeshPhongMaterial({color: meshes[j].material.color});
                        } else if (USERINPUTS.flatShading === 1) {
                            meshes[j].material = new THREE.MeshLambertMaterial({color: meshes[j].material.color});
                        } else if (USERINPUTS.flatShading === 2) {
                            meshes[j].material = new THREE.MeshStandardMaterial({color: meshes[j].material.color});
                        }
                    }
                } else if (child.name === "stormtrooper"){
                    child.lookAt(camera.position);
                    var meshes = [];
                    child.traverse( function( node ) {

                        if ( node instanceof THREE.Mesh ) { 
                            meshes.push(node);
                        }
                    } );
                    for (j = 0; j < meshes.length; j++){
                        if (USERINPUTS.flatShading === 0){
                            meshes[j].material = new THREE.MeshPhongMaterial({color: meshes[j].material.color,
                                                                                map: meshes[j].material.map,
                                                                                skinning: meshes[j].material.skinning});
                        } else if (USERINPUTS.flatShading === 1) {
                            meshes[j].material = new THREE.MeshLambertMaterial({color: meshes[j].material.color,
                                                                                map: meshes[j].material.map,
                                                                                skinning: meshes[j].material.skinning});
                        } else if (USERINPUTS.flatShading === 2) {
                            meshes[j].material = new THREE.MeshStandardMaterial({color: meshes[j].material.color,
                                                                                map: meshes[j].material.map,
                                                                                skinning: meshes[j].material.skinning});
                        }
                    }
                    if (child.position.distanceTo(camera.position) < 8000) {
                        tick++;     // TODO gameStarted a al
                        if ((tick % 60) === 0) {
                            LASER.enemyFire(child);
                        }
                    }
                } else if (child.name === "terrain"){
                    if (USERINPUTS.flatShading === 0){
                        child.material = new THREE.MeshPhongMaterial({map: TERRAIN.terrainTexture});
                    } else if (USERINPUTS.flatShading === 1) {
                        child.material = new THREE.MeshLambertMaterial({map: TERRAIN.terrainTexture});
                    } else if (USERINPUTS.flatShading === 2) {
                        child.material = new THREE.MeshStandardMaterial({map: TERRAIN.terrainTexture});
                    }
                } else if (child.name === "tie-fighter"){
                    var meshes = [];
                    child.traverse( function( node ) {

                        if ( node instanceof THREE.Mesh ) { 
                            meshes.push(node);
                        }
                    } );
                    for (j = 0; j < meshes.length; j++){
                        if (USERINPUTS.flatShading === 0){
                            meshes[j].material = new THREE.MeshPhongMaterial({color: meshes[j].material.color,
                                                                                map: meshes[j].material.map});
                        } else if (USERINPUTS.flatShading === 1) {
                            meshes[j].material = new THREE.MeshLambertMaterial({color: meshes[j].material.color,
                                                                                map: meshes[j].material.map});
                        } else if (USERINPUTS.flatShading === 2) {
                            meshes[j].material = new THREE.MeshStandardMaterial({color: meshes[j].material.color,
                                                                                map: meshes[j].material.map});
                        }
                    }
                }
                
            }
            r2d2Move(r2d2Object);
            
            // FLAG WIND
            var time = Date.now();
            var windStrength = Math.cos( time / 7000 ) * 20 + 40;
            FLAG.windForce.set( Math.sin( time / 2000 ), Math.cos( time / 3000 ), Math.sin( time / 1000 ) );
            FLAG.windForce.normalize();
            FLAG.windForce.multiplyScalar( windStrength );
            FLAG.simulate( time );
            var p = FLAG.flag.particles;
            for ( var i = 0, il = p.length; i < il; i ++ ) {
                var v = p[ i ].position;
                flagGeometry.attributes.position.setXYZ( i, v.x, v.y, v.z );
            }
            flagGeometry.attributes.position.needsUpdate = true;
            flagGeometry.computeVertexNormals();
            
            userLasers.forEach(LASER.userLaserTranslate);
            enemyLasers.forEach(LASER.enemyLaserTranslate);

        } else if (camera.position.z >= backwardFinishLine) {
            gameStarted = false;
            controls.unlock();
            controls = undefined;
            gameOver();
        } else if (camera.position.z <= finishLine) {
            gameStarted = false;
            controls.unlock();
            controls = undefined;
            finishedLevel();
            // won
        }
        
        if (showSphereMirror) {
            sphereMirror.rotation.set(0, Math.PI, 0);
            // cubecamera pingpong
            if ( cubeCameraCount % 2 === 0 ) {
                cubeCamera.update( renderer, scene );
                sphereMirrorMaterial.envMap = cubeCamera.renderTarget.texture;
            } else {
                cubeCamera2.update( renderer, scene );
                sphereMirrorMaterial.envMap = cubeCamera2.renderTarget.texture;
            }
            cubeCameraCount++;
        }
    }

    if(LOADERS.mixer){
        LOADERS.mixer.update(clock.getDelta());
    }
    
    requestAnimationFrame(render);
}

function gameOver() {
    if (gameOverDiv === undefined && gameOverObject === undefined){
        gameOverDiv = document.getElementById("game-over");
        gameOverObject = new CSS2DObject(gameOverDiv);
        gameOverObject.position.set(0.0, 0.0, -10.0);
    }
    document.body.removeChild(labelRenderer.domElement);
    gameOverDiv.style.display = "block";
    gameOverDiv.style.zIndex = 100;
    camera.add(gameOverObject);
    
    if (gameOverHomeButton === undefined && gameOverRestartButton === undefined){
        gameOverHomeButton = document.getElementById("game-over-home-button");
        gameOverRestartButton = document.getElementById("game-over-restart-button");
    }

    gameOverRenderer = new CSS2DRenderer();
    gameOverRenderer.setSize( window.innerWidth, window.innerHeight );
    gameOverRenderer.domElement.style.position = 'absolute';
    gameOverRenderer.domElement.style.top = 0;
    document.body.appendChild( gameOverRenderer.domElement );
    gameOverRenderer.render(scene, camera);
    
    gameOverHomeButton.addEventListener("mousedown", function() {
        document.body.removeChild(gameOverRenderer.domElement);
        createLevelMap();
    });
    
    gameOverRestartButton.addEventListener("mousedown", function() {
        document.body.removeChild(gameOverRenderer.domElement);
        generateLevelInit();
    });
        
}

function finishedLevel() {
    if (finishLevelDiv === undefined && finishLevelObject === undefined){
        finishLevelDiv = document.getElementById("finish");
        finishLevelObject = new CSS2DObject(finishLevelDiv);
        finishLevelObject.position.set(0.0, 0.0, -10.0);
    }
    //document.body.removeChild(gameOverRenderer.domElement);

    finishLevelDiv.style.display = "absolute";
    finishLevelDiv.style.zIndex = 101;
    camera.add(finishLevelObject);
    console.log("finish");
    
    
    if (finishHomeButton === undefined && finishNextButton === undefined) {
        finishHomeButton = document.getElementById("finish-home-button");
        finishNextButton = document.getElementById("finish-next-button");
    }
    
    console.log(densityIndex);
    if (densityIndex === 2) {
        finishNextButton.style.display = "none";
    }

    
    finishedRenderer = new CSS2DRenderer();
    finishedRenderer.setSize( window.innerWidth, window.innerHeight );
    finishedRenderer.domElement.style.position = 'absolute';
    finishedRenderer.domElement.style.top = 0;
    document.body.appendChild( finishedRenderer.domElement );
    finishedRenderer.render(scene, camera);
    
    finishHomeButton.addEventListener("mousedown", function() {
        document.body.removeChild(finishedRenderer.domElement);
        createLevelMap();
    });

    finishNextButton.addEventListener("mousedown", function() {
        document.body.removeChild(finishedRenderer.domElement);
        if (densityIndex < 2) {
            densityIndex++;
        }
        generateLevelInit();   // TODO: handle next level
    });
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
    audioListener = new THREE.AudioListener();
    camera.add(audioListener);
    introSound = new THREE.Audio(audioListener);
    INTRO.createLongTimeAgoText();
}

// manage sound button according to current sound mode
export function toggleSound() {
    
    var icon = $('#soundIcon');
    if (icon.attr('src') === "./img/sound_on.png") {
        icon.attr('src', './img/sound_off.png');
        if (introSound !== undefined && introSound.isPlaying) {
            introSound.setVolume(0.0);
        }
        if (levelSound !== undefined && levelSound.isPlaying) {
            levelSound.setVolume(0.0);   
        }
        
    } else {
        icon.attr('src', './img/sound_on.png');
        if (introSound !== undefined && introSound.isPlaying) {
            introSound.setVolume(1.0);
        }
        if (levelSound !== undefined && levelSound.isPlaying) {
            levelSound.setVolume(1.0);   
        }
    }
}

function clearScene () {
    for(i = scene.children.length - 1; i >= 0; i--) {
        scene.remove(scene.children[i]);
    }
}

export function createLevelMap () {
    console.log("level map");
    var loader  = new THREE.TextureLoader(), texture = loader.load( "img/sky.jpg" );
    $('html,body').css('cursor', 'default');
    scene.background = texture;
    gameNameAnimation = false;
    introAnimation = false;
    onLevelMap = true;
    clearScene();   // remove everything from the scene

    if (fromIntro) {
        $('#skipButton').hide();
        fromIntro = false;
        introSound.setVolume(0.0);
        introSound.pause();
        introAnimation = false;
        
        levelMapDiv = document.getElementById("levels");
        levelMapObject = new CSS2DObject(levelMapDiv);

    }
    
    var levelMapLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1 );
    levelMapLight.position.set(0, 0, 0);
    scene.add(levelMapLight);

    manager = new THREE.LoadingManager();
    manager.onLoad = function ( ) {
            console.log( 'Level map stormtrooper Loading complete!');
    };
    
    loadLevelModel();
    scene.add(levelMapObject);
    labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = 0;
    document.body.appendChild( labelRenderer.domElement );
    labelRenderer.render(scene, camera);
    
    var levelItems = document.getElementsByClassName("dot");
    
    for (i = 0; i < levelItems.length; i++){
        switch(levelItems[i].innerText){
            case "1":
                levelItems[i].addEventListener("mousedown", function() {
                    if(levels[0]){
                        densityIndex = 0;
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
                        densityIndex = 1;
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
                        densityIndex = 2;
                        if (levelSound){
                            levelSound.pause();
                        }
                        generateLevelInit();
                    }
                });
                break;
        }
    }
}

function createCrosshair() {
    var crosshairMaterial = new THREE.LineBasicMaterial({
    color: 0xAAFFAA
    });

    // crosshair size
    var x = 0.5,
    y = 0.5;

    var crosshairGeometry = new THREE.Geometry();

    // crosshair
    crosshairGeometry.vertices.push(new THREE.Vector3(x, y, 0));
    crosshairGeometry.vertices.push(new THREE.Vector3(-x, y, 0));
    crosshairGeometry.vertices.push(new THREE.Vector3(-x, -y, 0));
    crosshairGeometry.vertices.push(new THREE.Vector3(x, -y, 0));
    crosshairGeometry.vertices.push(new THREE.Vector3(x, y, 0));
    crosshairGeometry.vertices.push(new THREE.Vector3(x, 0, 0));
    crosshairGeometry.vertices.push(new THREE.Vector3(-x, 0, 0));

    crosshair = new THREE.Line(crosshairGeometry, crosshairMaterial);
    // place it in the center
    var crosshairPercentX = 50;
    var crosshairPercentY = 50;
    var crosshairPositionX = (crosshairPercentX / 100) * 2 - 1;
    var crosshairPositionY = (crosshairPercentY / 100) * 2 - 1;
    crosshair.position.x = crosshairPositionX * camera.aspect;
    crosshair.position.y = crosshairPositionY;
    crosshair.position.z = -10;
    console.log("crosshair added");
    camera.add(crosshair);
}

function generateLevelInit() {
    clearScene();
    scene.background = new THREE.Color( 0x000000 );
    modelsLoading = true;
    createLoadingText(createGameScene);
}

function loadLevelModel() {
    var rand = Math.floor(Math.random() * 3) + 1;
    if (rand === 1) {
        if (!USERINPUTS.muted){
            audioLoader.load('sounds/chicken-cut.ogg', function(buffer) {
                levelSound = new THREE.Audio(audioListener);
                levelSound.setBuffer(buffer);
                levelSound.setLoop(true);
                levelSound.setVolume(1.0);
                camera.add(levelSound);
                levelSound.play();

            });
        }
        LOADERS.animatedGltfLoad(manager, "models/animated/stormtrooper/chicken.glb", 
        scene, camera, "stormtrooper-level", camera.position.x + 3, camera.position.y - 2,
        camera.position.z - 5, 1, -Math.PI/6);
    } else if (rand === 2) {
        if (!USERINPUTS.muted){
            audioLoader.load('sounds/twist-cut.ogg', function(buffer) {
                levelSound = new THREE.Audio(audioListener);
                levelSound.setBuffer(buffer);
                levelSound.setLoop(true);
                levelSound.setVolume(1.0);
                camera.add(levelSound);
                levelSound.play();
            });
        }
        LOADERS.animatedGltfLoad(manager, "models/animated/stormtrooper/twist-dance.glb", 
        scene, camera, "stormtrooper-level", camera.position.x + 3, camera.position.y - 2,
        camera.position.z - 5, 0.9, -Math.PI/6);
    } else {
        LOADERS.animatedGltfLoad(manager, "models/animated/stormtrooper/stormtrooper-moonwalk.glb", 
        scene, camera, "stormtrooper-level", camera.position.x + 3, camera.position.y - 2,
        camera.position.z - 5, 0.8, -Math.PI/2);
    }

}

function loadGameSounds() {
    audioLoader.load('sounds/laser-cut.ogg', function(buffer) {
        gunSoundBuffer = buffer;

        //gunSound.play();

    });
}


function muteAudioSlowly () {
    while (introSound.getVolume() >= 0.0) {
        console.log(introSound.getVolume());
        introSound.setVolume(introSound.getVolume() - 0.01);
    }
    introSound.setVolume(0.0);
}

function createGameScene() {
    PANEL.clearGUI();       // if there is already gui delete
    $('html,body').css('cursor', 'default');
    camera.position.set(0, 300, 0);
    scene.add( camera );
    cameraSpeed = new THREE.Vector3(0.0, 300.0, -300.0);        // initial camera speed
    scene.fog = new THREE.Fog( bottomSkyColor, 5000, 80000 );
    onLevelMap = false; // these needs to be checked later
    modelsLoading = true;
    SKYANDSUN.createTatooSuns(topSkyColor, bottomSkyColor, 0xFDE585, 0xfdf2c2);
    loadGameSounds();
    createTerrain();
    createTerrainSceneLights();
    loadTieFighters();
    loadFlag();
    loadStormtroopers();
    createCrosshair();
}

function createTerrainSceneLights () {
    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.position.set( 0, 50, 0 );
    scene.add( hemiLight );   
}

function loadBox () {
    var textureLoader = new THREE.TextureLoader();
    var boxTexture = textureLoader.load("textures/box_diffuse.png");
    var boxBumpMap = textureLoader.load("textures/box_bump.png");
    var boxNormalMap = textureLoader.load("textures/box_normal.png");

    var bumpCube = new THREE.Mesh(
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.MeshPhongMaterial({
            color:0xffffff,
            map: boxTexture,
            bumpMap: boxBumpMap,
            normalMap: boxNormalMap
        })
    );
    bumpCube.castShadow = true;
    bumpCube.receiveShadow = true;
    bumpCube.name = 'box';
    bumpCube.position.set(1.7, -0.35, -1.8);
    landspeederObject.add(bumpCube);
    loadSphereMirror();
}

function loadFlag () {
    var textureLoader = new THREE.TextureLoader();
    var flagTexture = textureLoader.load( 'textures/stormtrooper_flag.jpg' );
    flagTexture.anisotropy = 16;

    var flagMaterial = new THREE.MeshLambertMaterial( {
            map: flagTexture,
            side: THREE.DoubleSide,
            alphaTest: 0.5
    } );

    flagGeometry = new THREE.ParametricBufferGeometry( FLAG.flagFunction, FLAG.flag.w, FLAG.flag.h );
    var flagObject = new THREE.Mesh( flagGeometry, flagMaterial );
    flagObject.position.set( 4250, 800, -6000 );
    flagObject.castShadow = true;
    scene.add( flagObject );
    flagObject.customDepthMaterial = new THREE.MeshDepthMaterial( {
            depthPacking: THREE.RGBADepthPacking,
            map: flagTexture,
            alphaTest: 0.5
    } );
    
    var poleGeo = new THREE.CubeGeometry( 30, 2000, 5 );
    var poleMat = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0x111111, shininess: 100 } );
    var mesh = new THREE.Mesh( poleGeo, poleMat );
    mesh.position.set(3950, 750, -6010);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add( mesh );
}

function loadSphereMirror () {
    // cubecameras
    cubeCamera = new THREE.CubeCamera(0.1, 1000000, 256);
    cubeCamera.renderTarget.texture.generateMipmaps = true;
    cubeCamera.renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter;
    cubeCamera2 = new THREE.CubeCamera(0.1, 1000000, 256);
    cubeCamera2.renderTarget.texture.generateMipmaps = true;
    cubeCamera2.renderTarget.texture.minFilter = THREE.LinearMipmapLinearFilter;
    
    sphereMirrorMaterial = new THREE.MeshBasicMaterial({
        envMap: cubeCamera.renderTarget.texture
    });
    sphereMirror = new THREE.Mesh( new THREE.SphereBufferGeometry(0.5, 16, 16), sphereMirrorMaterial );
    sphereMirror.castShadow = true;
    sphereMirror.receiveShadow = true;
    sphereMirror.name = "mirror";
    sphereMirror.position.set(0, 1.62, 1);
    sphereMirror.rotation.y = (Math.PI);
    sphereMirror.add(cubeCamera);
    sphereMirror.add(cubeCamera2);
    landspeederObject.add(sphereMirror);
    
    console.log(landspeederObject);
    // all loadings are done, start game scene
    gameSceneLoadingEnded();
    controls = new PointerLockControls( camera, document.body );
    controls.lock();
}

function loadR2D2 () {
    manager = new THREE.LoadingManager();
    manager.onLoad = function ( ) {
        console.log( 'R2D2 Loading complete!');
        r2d2Object = scene.getObjectByName("r2-d2")
        loadBottle();
    };
    LOADERS.objLoad(manager, "models/r2d2-obj/r2-d2.mtl", "models/r2d2-obj/r2-d2.obj", 
                    scene, camera, "r2-d2", 0, 0, 5, 2, 2.5);
}

function loadStormtroopers () {
    manager = new THREE.LoadingManager();
    manager.onLoad = function ( ) {
        console.log( 'Stormtrooper loading complete!');
        loadBlaster();
    };
    
    manager.onError = function(error) {
        console.log(error);
    };
    
    for (var j = 1; j < densityList[densityIndex] + 1; j++){
        var randomInt = Math.floor(Math.random() * (1000000 - 1 + 1)) + 1;
        var posX;
        if(randomInt % 2){
            posX = 4000;
        } else {
            posX = -4000;
        }
        LOADERS.gltfLoad(manager, "models/animated/stormtrooper/one.glb", 
        scene, camera, "stormtrooper", posX, camera.position.y,
        camera.position.z - (j * (-finishLine / densityList[densityIndex])), 100, 0);
    }
}

function loadTieFighters () {
    manager = new THREE.LoadingManager();
    manager.onLoad = function ( ) {
            console.log( 'Tiefighter loading complete!');
    };
    LOADERS.objLoad (manager, "models/tie-fighter-obj/starwars-tie-fighter.mtl", "models/tie-fighter-obj/starwars-tie-fighter.obj",
                    scene, camera, "tie-fighter", camera.position.x - 5000, camera.position.y + 10000,
                    -40000, 200, 0);
    LOADERS.objLoad (manager, "models/tie-fighter-obj/starwars-tie-fighter.mtl", "models/tie-fighter-obj/starwars-tie-fighter.obj",
                    scene, camera, "tie-fighter", camera.position.x + 5000, camera.position.y + 10000,
                    -40000, 200, 0);
}

function loadBlaster () {
    manager = new THREE.LoadingManager();
    manager.onLoad = function ( ) {
            console.log( 'Loading complete! BLASTER');
            emitter = new THREE.Object3D();
            emitter.position.set(2, -1.8, -11.5);
            camera.add(emitter);
            loadLandspeeder();
    };
    LOADERS.gltfLoad(manager, 'models/blaster-gltf/blaster.gltf', scene, camera, 
                                "blaster", 2, -2.3, -3.5, 2, Math.PI / 2);
}

function loadBottle () {
    manager = new THREE.LoadingManager();
    manager.onLoad = function ( ) {
        console.log( 'Bottle loading complete!');
        loadBox();
    };
    LOADERS.objLoad (manager, "models/bottle-obj/bottle.mtl", "models/bottle-obj/bottle.obj", scene, camera,
                    "bottle", 1.5, -0.25, -2.7, 1, 0);
}

function gameSceneLoadingEnded () {
    modelsLoading = false;
    for(i = 0; i < 7; i++ ){
        scene.remove(scene.children[0]);
    }
    PANEL.createGUI();
    console.log(scene);
    clock = new THREE.Clock();
    USERINPUTS.initUserInputs();
    gameStarted = true;
}

function loadLandspeeder () {
    manager = new THREE.LoadingManager();
    manager.onLoad = function ( ) {
        EXPLOSION.addParticles();
        landspeederObject = scene.getObjectByName("landspeeder");
        loadR2D2();
    };

    LOADERS.gltfLoad(manager, 'models/landspeeder-gltf/landspeeder.gltf', scene, camera, 
                    "landspeeder", camera.position.x - 130, camera.position.y - 50,
                    camera.position.z - 150, 100, Math.PI);
}

function createTerrain() {
    var desertHeightMap = document.getElementById('heightMap');
    TERRAIN.generateDesertTerrain(desertHeightMap, scene);
}

// HELPERS
export function moveForward () {
    if (cameraSpeed.z > -2000) {
        cameraSpeed.z -= speedStep * 20;
    }
}

export function moveBackward () {
    if (cameraSpeed.z < 2000) {
        cameraSpeed.z += speedStep * 20;
    }
}

export function moveRight () {
    if (cameraSpeed.x < 2480) {
        cameraSpeed.x += speedStep * 20;
    }
}

export function moveLeft () {
    if (cameraSpeed.x > -2050) {
        cameraSpeed.x -= speedStep * 20;
    }
}

export function moveUp () {
    if (cameraSpeed.y < 750) {
        cameraSpeed.y += speedStep * 20;
    }
}

export function moveDown () {
    if (cameraSpeed.y > 130) {
        cameraSpeed.y -= speedStep * 20;
    }
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

export function setGameMode (value) {
    gameMode = value;
}

export function setShowSphereMirror (value) {
    showSphereMirror = value;
}

init();
render();
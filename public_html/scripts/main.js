import Stats from '../three.js-dev/examples/jsm/libs/stats.module.js';
import { ImprovedNoise } from '../three.js-dev/examples/jsm/math/ImprovedNoise.js';
import { FirstPersonControls } from '../three.js-dev/examples/jsm/controls/FirstPersonControls.js';
import * as THREE from '../three.js-dev/build/three.module.js';

var container;
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;     // mouse movement variables
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var object;
var radius = 6371;      // constant scalar for star background
var i, j;       // loop identifiers
var longTimeAgoText = "A long time ago, in a galaxy far, \nfar away...";
var gameName = "AGAINST THE\n  DARK SIDE";
var gameIntrotextArr = ["It is a period of civil war. Rebel",
                        "spaceships, striking from a hidden",
                        "base, have won their first victory", 
                        "against the evil Galactic Empire.", 
                        "During the battle, Rebel spies managed", 
                        "to steal secret plans to the Empire's", 
                        "ultimate weapon, the DEATH STAR an",
                        "armored space station with enough",
                        "power to destroy an entire planet.",
                        "You, as a rebel spy are received",
                        "the task to transmit the secret plans",
                        "to hidden base. Each level is continous", 
                        "to each other. You must fight against",
                        "the dark side. May the force be with you!"];
var directionalLight;
var textMesh;
var gameNameAnimation = false, introAnimation = false;      // booleans to animate intro texts
var group;
var audioLoader;
var introSound;
var fromIntro = true, onLevelMap = false;       // to avoid recreate of the space background

window.createLevelMap = createLevelMap;


function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1e6);
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
            console.log("miyav");
            clearScene();       // clear everything from the scene
            createGameScene();
        }
    });
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;
    
    if (gameNameAnimation) {
        group.position.z -= 25;
    } else if (introAnimation) {
        group.position.z -= 5;
        console.log(group.position.z);
    }
    
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
}

function showStarWarsEntry () {
    createBackgroundWithStars ();       // create background with stars
    
    // LIGHT
    directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(0, 1, 1);
    directionalLight.name = 'textLight';
    scene.add(directionalLight);
    
    // TEXT GROUP
    group = new THREE.Group();      // to work with text as a group
    group.position.y = 30;
    group.name = "introObjects";
    scene.add(group);
    createLongTimeAgoText();
}

function createLongTimeAgoText () {
    loadFont(longTimeAgoText, 'fonts/arial.json', 60, 0x64c8c5, 30, -1000, 0);
    // create an AudioListener and add it to the camera
    var listener = new THREE.AudioListener();
    camera.add(listener);
    // create a global audio source
    introSound = new THREE.Audio(listener);
    audioLoader = new THREE.AudioLoader();
    // load a sound and set it as the Audio object's buffer
    audioLoader.load('sounds/star_wars_intro.ogg', function(buffer) {
        introSound.setBuffer(buffer);
        introSound.setLoop(false);
        introSound.setVolume(1.0);
    });
    // after 5 seconds remove it add game name
    setTimeout(function(){
        createGameNameText();
    }, 5000);
}

function createGameNameText () {
    group.remove(textMesh);
    introSound.play();
    gameNameAnimation = true;
    loadFont(gameName, 'fonts/star_wars_entry/logo_font.json', 100, 0xfcdf00, 30, -300, 0);
    setTimeout(function(){
        createIntroText();
    }, 4000);
}

function createIntroText () {
    gameNameAnimation = false;
    introAnimation = true;
    //group.remove(textMesh);
    console.log(camera.position.x);
    console.log(camera.position.y);
    console.log(camera.position.z);
    var a = group.position.z;
    for (i = 0; i < gameIntrotextArr.length; i++) {
        loadFont(gameIntrotextArr[i], 'fonts/star_wars_entry/intro_font.json', 70, 0xfcdf00, 
                -window.innerHeight, window.innerHeight / 2 * i - a, -Math.PI / 4);
    }
    
    setTimeout(function(){
        introAnimation = false;
        // remove group elements one by one
        console.log("end intro");
    }, 30000);
}

function loadFont(text, font, textSize, colorHex, y, z, rotationX) {
    var loader = new THREE.FontLoader();
    loader.load(font, function (response) {
            createText(text, response, textSize, colorHex, y, z, rotationX);
    } );
}

function createText(text, font, textSize, colorHex, y, z, rotationX) {
    directionalLight.color.setHex(colorHex);
    var materials = [
            new THREE.MeshPhongMaterial( { color: colorHex, flatShading: true } ), // front
            new THREE.MeshPhongMaterial( { color: colorHex } ) // side
    ];
    
    var textGeo = new THREE.TextBufferGeometry(text, {
            font: font,
            size: textSize,
            height: 5,
            curveSegments: 12,
            bevelThickness: 5,
            bevelSize: 2,
            bevelEnabled: true
    } );
    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();
    // "fix" side normals by removing z-component of normals for side faces
    // (this doesn't work well for beveled geometry as then we lose nice curvature around z-axis)
    var centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
    //textGeo = new THREE.BufferGeometry().fromGeometry(textGeo);
    textMesh = new THREE.Mesh(textGeo, materials);
    textMesh.position.x = centerOffset;
    textMesh.position.y = y;
    textMesh.position.z = z;
    textMesh.rotation.x = rotationX;
    textMesh.rotation.y = Math.PI * 2;
    group.add(textMesh);
}

// This function adds stars with random position, color and sizes to scene
function createBackgroundWithStars () {
        
    var starsGeometry = [new THREE.BufferGeometry(), new THREE.BufferGeometry()];
    var starVertices1 = [];
    var starVertices2 = [];
    var vertex = new THREE.Vector3();
    for (i = 0; i < 250; i ++) {
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.multiplyScalar(radius);
        starVertices1.push(vertex.x, vertex.y, vertex.z);
    }
    for (i = 0; i < 1500; i ++) {
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.multiplyScalar(radius);
        starVertices2.push(vertex.x, vertex.y, vertex.z);
    }
    starsGeometry[0].setAttribute('position', new THREE.Float32BufferAttribute(starVertices1, 3));
    starsGeometry[1].setAttribute('position', new THREE.Float32BufferAttribute(starVertices2, 3));
    var stars;
    var starsMaterials = [
        new THREE.PointsMaterial({color: 0xffffff, size: 2, sizeAttenuation: false}),
        new THREE.PointsMaterial({color: 0xffffff, size: 1, sizeAttenuation: false}),
        new THREE.PointsMaterial({color: 0xeeeeee, size: 2, sizeAttenuation: false}),
        new THREE.PointsMaterial({color: 0xeeeeee, size: 1, sizeAttenuation: false}),
        new THREE.PointsMaterial({color: 0x666666, size: 2, sizeAttenuation: false}),
        new THREE.PointsMaterial({color: 0x666666, size: 1, sizeAttenuation: false})
    ];
    for (i = 10; i < 30; i ++) {
        stars = new THREE.Points(starsGeometry[i % 2], starsMaterials[i % 6]);
        stars.rotation.x = Math.random() * 6;
        stars.rotation.y = Math.random() * 6;
        stars.rotation.z = Math.random() * 6;
        stars.scale.setScalar(i * 10);
        stars.matrixAutoUpdate = false;
        stars.updateMatrix();
        scene.add(stars);
    }
}

// manage sound button according to current sound mode
function toggleSound() {
    console.log("hede");
    var icon = $('#soundIcon');
    if (icon.attr('src') === "./img/sound_on.png") {
        icon.attr('src', './img/sound_off.png');
        introSound.setVolume(0.0);
        
    } else {
        icon.attr('src', './img/sound_on.png');
        introSound.setVolume(1.0);
    }
}

function clearScene () {
    for( var i = scene.children.length - 1; i >= 0; i--) {
        scene.remove(scene.children[i]);
    }
}

export function createLevelMap () {
    console.log("level map");
    
    onLevelMap = true;

    if (fromIntro) {        // no need to create space background again
        //scene.remove("introObjects");
        $('#skipButton').hide();
        scene.traverse(function(child){
            if(child.name == "introObjects"){
               scene.remove(child);
            }
        });
        fromIntro = false;
        // LIGHT DURUYOR
    } else {
        clearScene();   // remove everything from the scene
        createBackgroundWithStars();        // create space in the background
    }
    
    // create map
}

function createGameScene() {
    directionalLight.color.setHex(0xffffff);
    createTerrain();
    createSky();
    createSuns();
}

function createTerrain() {
    

    var container, stats;
    var camera, controls, scene, renderer;
    var mesh, texture;
    var worldWidth = 256, worldDepth = 256,
            worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;
    var clock = new THREE.Clock();
    init();
    animate();
    function init() {
            container = document.getElementById( 'container' );
            camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );
            scene = new THREE.Scene();
            scene.background = new THREE.Color( 0xbfd1e5 );
            var data = generateHeight( worldWidth, worldDepth );
            camera.position.y = data[ worldHalfWidth + worldHalfDepth * worldWidth ] * 10 + 500;
            var geometry = new THREE.PlaneBufferGeometry( 7500, 7500, worldWidth - 1, worldDepth - 1 );
            geometry.rotateX( - Math.PI / 2 );
            var vertices = geometry.attributes.position.array;
            for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
                    vertices[ j + 1 ] = data[ i ] * 10;
            }
            texture = new THREE.CanvasTexture( generateTexture( data, worldWidth, worldDepth ) );
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );
            scene.add( mesh );
            renderer = new THREE.WebGLRenderer();
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( window.innerWidth, window.innerHeight );
            container.appendChild( renderer.domElement );
            controls = new FirstPersonControls( camera, renderer.domElement );
            controls.movementSpeed = 1000;
            controls.lookSpeed = 0.1;
            stats = new Stats();
            container.appendChild( stats.dom );
            //
            window.addEventListener( 'resize', onWindowResize, false );
    }
    function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize( window.innerWidth, window.innerHeight );
            controls.handleResize();
    }
    function generateHeight( width, height ) {
            var size = width * height, data = new Uint8Array( size ),
                    perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;
            for ( var j = 0; j < 4; j ++ ) {
                    for ( var i = 0; i < size; i ++ ) {
                            var x = i % width, y = ~ ~ ( i / width );
                            data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );
                    }
                    quality *= 5;
            }
            return data;
    }
    function generateTexture( data, width, height ) {
            var canvas, canvasScaled, context, image, imageData, vector3, sun, shade;
            vector3 = new THREE.Vector3( 0, 0, 0 );
            sun = new THREE.Vector3( 1, 1, 1 );
            sun.normalize();
            canvas = document.createElement( 'canvas' );
            canvas.width = width;
            canvas.height = height;
            context = canvas.getContext( '2d' );
            context.fillStyle = '#000';
            context.fillRect( 0, 0, width, height );
            image = context.getImageData( 0, 0, canvas.width, canvas.height );
            imageData = image.data;
            for ( var i = 0, j = 0, l = imageData.length; i < l; i += 4, j ++ ) {
                    vector3.x = data[ j - 2 ] - data[ j + 2 ];
                    vector3.y = 2;
                    vector3.z = data[ j - width * 2 ] - data[ j + width * 2 ];
                    vector3.normalize();
                    shade = vector3.dot( sun );
                    imageData[ i ] = ( 96 + shade * 128 ) * ( 0.5 + data[ j ] * 0.007 );
                    imageData[ i + 1 ] = ( 32 + shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
                    imageData[ i + 2 ] = ( shade * 96 ) * ( 0.5 + data[ j ] * 0.007 );
            }
            context.putImageData( image, 0, 0 );
            // Scaled 4x
            canvasScaled = document.createElement( 'canvas' );
            canvasScaled.width = width * 4;
            canvasScaled.height = height * 4;
            context = canvasScaled.getContext( '2d' );
            context.scale( 4, 4 );
            context.drawImage( canvas, 0, 0 );
            image = context.getImageData( 0, 0, canvasScaled.width, canvasScaled.height );
            imageData = image.data;
            for ( var i = 0, l = imageData.length; i < l; i += 4 ) {
                    var v = ~ ~ ( Math.random() * 5 );
                    imageData[ i ] += v;
                    imageData[ i + 1 ] += v;
                    imageData[ i + 2 ] += v;
            }
            context.putImageData( image, 0, 0 );
            return canvasScaled;
    }
    //
    function animate() {
            requestAnimationFrame( animate );
            render();
            stats.update();
    }
    function render() {
            controls.update( clock.getDelta() );
            renderer.render( scene, camera );
    }
}

function createSky () {
    
    // oguz bakir miyav
    
}

function createSuns () {}

init();
animate();

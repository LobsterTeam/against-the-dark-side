import * as THREE from '../three.js-dev/build/three.module.js';
import { scene, camera, renderer, onLevelMap, listener, directionalLight, perpIntroGroup,
    audioLoader, introSound, gameNameAnimation, setGameNameAnimation, setIntroAnimation,
    skewedIntroGroup, rotatedGroup, createLevelMap} from './main.js';

var gameName = ["AGAINST THE", "DARK SIDE"];
var longTimeAgoText = "A long time ago, in a galaxy far,\nfar away....";
export var gameIntrotextArr = [ "It is a period  of  civil war.  Rebel",
                                "spaceships,  striking from a hidden",
                                "base,  have won their first victory",
                                "against the evil  Galactic  Empire.", 
                                "During  the  battle,   Rebel  spies", 
                                "managed  to  steal  secret plans", 
                                "to the Empire's  ultimate weapon,",
                                "the  DEATH  STAR  an  armored",
                                "space station with enough power",
                                "to destroy an entire planet.  You",
                                "as a  rebel spy are received the",
                                "task to transmit the secret plans", 
                                "to the  hidden  base. Each  level",
                                "continues to the  next one.  You",
                                "must fight against the dark side.",
                                "May  the  force  be  with  you!"];
var textMesh, i;
var radius = 6371;      // constant scalar for star background

// This function adds stars with random position, color and sizes to scene
export function createBackgroundWithStars () {
        
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
        new THREE.PointsMaterial({color: 0xa9a9a9, size: 2, sizeAttenuation: false}),
        new THREE.PointsMaterial({color: 0xffffff, size: 1, sizeAttenuation: false}),
        new THREE.PointsMaterial({color: 0xc0c0c0, size: 2, sizeAttenuation: false}),
        new THREE.PointsMaterial({color: 0xeeeeee, size: 1, sizeAttenuation: false}),
        new THREE.PointsMaterial({color: 0x808080, size: 2, sizeAttenuation: false}),
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

export function createLongTimeAgoText () {
    // load a long time ago text
    //console.log(window.innerWidth);
    loadFont(perpIntroGroup, longTimeAgoText, 'fonts/arial.json', 60, 0x64c8c5, 30, -1000); // TODO y ve z
    
    // load intro text before so it does not create an interrupt
    for (i = 0; i < gameIntrotextArr.length; i++) {
        loadFont(skewedIntroGroup, gameIntrotextArr[i], 'fonts/star_wars_entry/intro_font.json',
            70, 0xfcdf00, -150 * i, -window.innerHeight);     // TODO y ve z
    }
    
    camera.add(introSound);     // add star wars intro sound
    audioLoader.load('sounds/star_wars_intro.ogg', function(buffer) {
        introSound.setBuffer(buffer);
        introSound.setLoop(false);
        introSound.setVolume(1.0);
    });
    
    scene.add(directionalLight);        // add light to scene
    scene.add(perpIntroGroup);      // add perpendicular text group to scene
    // after 5 seconds remove it show game name
    setTimeout(function(){
        if (!onLevelMap) {
            createGameNameText();
        }
    }, 5000);
}

function createGameNameText () {
    perpIntroGroup.remove(textMesh);    // remove a long time ago text
    loadFont(perpIntroGroup, gameName[0], 'fonts/star_wars_entry/logo_font.json', 
            150, 0xfcdf00, 30, -300);       // TODO y ve z
    loadFont(perpIntroGroup, gameName[1], 'fonts/star_wars_entry/logo_font.json', 
            150, 0xfcdf00, -120, -299);       // TODO y ve z
    introSound.play();      // add star wars intro sound
    setGameNameAnimation(true);
}

function createIntroText () {
    // add initialized skewed intro group
    rotatedGroup.rotateX(-1);
    rotatedGroup.add(skewedIntroGroup);
    scene.add(rotatedGroup);
    setGameNameAnimation(false);
    setIntroAnimation(true);
}

export function loadFont(groupName, text, font, textSize, colorHex, y, z) {
    var loader = new THREE.FontLoader();
    loader.load(font, function (response) {
        createText(groupName, text, response, textSize, colorHex, true, y, z);
    });
}

export function loadLoadingTextFont(manager, groupName, text, font, textSize, colorHex, y, z) {
    var loader = new THREE.FontLoader(manager);
    loader.load(font, function (response) {
        createText(groupName, text, response, textSize, colorHex, false, y, z);
    });
}

function createText(groupName, text, font, textSize, colorHex, bevel, y, z) {
    directionalLight.color.setHex(colorHex);
    var materials = [
            new THREE.MeshPhongMaterial({color: colorHex, flatShading: true, transparent: true}), // front
            new THREE.MeshPhongMaterial({color: colorHex, transparent: true}) // side
    ];
    
    var textGeo = new THREE.TextBufferGeometry(text, {
            font: font,
            size: textSize,
            height: 5,
            curveSegments: 12,
            bevelThickness: 5,
            bevelSize: 2,
            bevelEnabled: bevel
    });
    textGeo.computeBoundingBox();
    textGeo.computeVertexNormals();
    var centerOffset = - 0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x);
    textMesh = new THREE.Mesh(textGeo, materials);
    textMesh.position.x = centerOffset;
    textMesh.position.y = y;
    textMesh.position.z = z;
    groupName.add(textMesh);
}

// manage opacity of far texts
export function setGameNameOpacity(obj) {
    obj.children.forEach((child) => {
        setGameNameOpacity(child);
    });
    if ( obj.material ) {
        var position = new THREE.Vector3();
        position.setFromMatrixPosition(obj.matrixWorld);
        // to start intro text animation
        if (position.z == -3990) {
            if (!onLevelMap) {
                createIntroText();
            } else {
                createLevelMap();
                return;
            }
        }
        if (position.z < -7000) {
            obj.material[0].opacity = 0;
            obj.material[1].opacity = 0;
        }  else if (position.z > -6000) {
            obj.material[0].opacity =  1
            obj.material[1].opacity =  1;
        } else {
            obj.material[0].opacity =  1 + Math.sin(position.z * .002);
            obj.material[1].opacity =  1 + Math.sin(position.z * .002);
        }
    };
};

export function setIntroTextOpacity(obj, zeroOpacityCounter) {
    obj.children.forEach((child) => {
        zeroOpacityCounter = setIntroTextOpacity(child, zeroOpacityCounter);
    });
    if ( obj.material ) {
        var position = new THREE.Vector3();
        position.setFromMatrixPosition(obj.matrixWorld);
        if (position.y > 600) {
            zeroOpacityCounter++;
            obj.material[0].opacity = 0;
            obj.material[1].opacity = 0;
        } else if (position.y < 0) {
            obj.material[0].opacity =  1
            obj.material[1].opacity =  1;
        } else {
            obj.material[0].opacity =  1 + Math.sin(-position.y * .0025);
            obj.material[1].opacity =  1 + Math.sin(-position.y * .0025);
        }        
    };
    return zeroOpacityCounter;      // to understand when it ends
};

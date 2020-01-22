import { gameMode, controls, setGameMode, scene, camera, renderer, render,
    gameStarted, moveForward, moveBackward, moveRight, moveLeft, 
    moveUp, moveDown } from './main.js';
import { userFire } from './laser.js';
import { TransformControls } from '../three.js-dev/examples/jsm/controls/TransformControls.js';
import { OrbitControls } from '../three.js-dev/examples/jsm/controls/OrbitControls.js';
import {
        Raycaster,
        Vector2
} from "../three.js-dev/build/three.module.js";

var INTERSECTED, PARENT;
var transformControls;
var raycaster =  new Raycaster();
var objects;
var mouse = new Vector2();
var orbit;


export function initUserInputs () {
    transformControls = new TransformControls( camera, renderer.domElement );
    scene.add( transformControls );            
    var models = scene.getObjectByName( "bottle" ).children.concat(scene.getObjectByName( "r2-d2" ).children);
    objects = [scene.getObjectByName("mirror"), scene.getObjectByName("box")].concat(models);
    
}

// TODO game scene check
export function onKeyDown ( event ) {
    
    if (!gameStarted) return;
    
    switch ( event.keyCode ) {

        case 38: // up
        case 87: // w
            if (gameMode) {
                moveForward();
            }
            break;

        case 37: // left
        case 65: // a
            if (gameMode) {
                moveLeft();
            }
            break;

        case 40: // down
        case 83: // s
            if (gameMode) {
                moveBackward();
            }
            break;

        case 39: // right
        case 68: // d
            if (gameMode) {
                moveRight();
            } 
            break;
                
        case 34:    // pgdown
            if (gameMode) {
                moveDown();
            }
            break;
                
        case 33:    // pgup
            if (gameMode) {
                moveUp();
            }
            break;
            
        case 76:        // L key
            if (gameMode) {
                setGameMode(false);
                controls.unlock();

            } else {
                transformControls.detach(INTERSECTED);
                INTERSECTED = undefined;
                setGameMode(true);
                controls.lock();
            }
            break;
                
        case 82:        // R key
            if (!gameMode && transformControls.mode == "translate") {
                transformControls.setMode("rotate");
            }
            break;
                
        case 84:        // T key
            if (!gameMode && transformControls.mode == "rotate") {
                transformControls.setMode("translate");
            }
            break;

        case 77:        // M key
                toggleSound();
                break;

        case 80:        // P key
                // change shading
                break;
    }
};

// TODO sadece lock tayken yapabilirsin
export function mouseMove ( event ) {
    if (!gameStarted) return;

    if (!gameMode) {
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse, camera );
        var intersects = raycaster.intersectObjects( objects );

        if ( intersects.length > 0 ) {

            if ( INTERSECTED != intersects[0].object) {

                if (INTERSECTED) {
                    transformControls.detach(INTERSECTED);
                }
                INTERSECTED = intersects[0].object;
                transformControls.attach( INTERSECTED );
            }
        }
    }
}

export function mouseDown () {
    
    if (!gameStarted || !gameMode) return;
    
    switch ( event.button ) {

            case 0:     // left click
                console.log("button click");
                userFire();
                break;
            case 2:
                break;

    }
}
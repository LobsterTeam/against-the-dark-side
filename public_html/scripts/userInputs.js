import { gameMode, controls, setGameMode, scene, camera, renderer, render, fire,
    landSpeeder, moveForward, moveBackward, moveRight, moveLeft, 
    moveUp, moveDown } from './main.js';
import { TransformControls } from '../three.js-dev/examples/jsm/controls/TransformControls.js';
import {
        Raycaster,
        Vector2
} from "../three.js-dev/build/three.module.js";

var INTERSECTED, PARENT;
var control;
var raycaster =  new Raycaster();
var objects;
var mouse = new Vector2();
var orbit;


export function initUserInputs () {
    control = new TransformControls( camera, renderer.domElement );
    scene.add( control );
    control.setMode("rotate");
    control.addEventListener( 'change', render);

    control.addEventListener( 'dragging-changed', function ( event ) {

            orbit.enabled = ! event.value;
            console.log("bu ne");

    } );
    var b = scene.getObjectByName( "blaster" ).children[0].children[0].children[0].children;
    console.log(scene.getObjectByName( "blaster" ));
    var c = [b[0].children[0], b[1].children[0], b[2].children[0], b[3].children[0]];
    var a = scene.getObjectByName( "bottle" ).children;
    objects = scene.getObjectByName( "r2-d2" ).children.concat(a);
    console.log(objects);
}

// TODO game scene check
export function onKeyDown ( event ) {
    
    if (!landSpeeder) return;
    
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
                    control.detach(INTERSECTED);
                    setGameMode(true);
                    controls.lock();
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
    
    if (!landSpeeder) return;
    
    if (!gameMode) {
        
        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse, camera );
        var intersects = raycaster.intersectObjects( objects );

        if ( intersects.length > 0 ) {

            if ( INTERSECTED != intersects[0].object && PARENT != intersects[0].object.parent ) {

                if (INTERSECTED) {
                    control.detach(INTERSECTED);
                }
                INTERSECTED = intersects[0].object;
                PARENT = intersects[0].object.parent;
                control.attach( INTERSECTED );
            }
        }
    }
}

export function mouseDown () {
    
    if (!landSpeeder || !gameMode) return;
    
    switch ( event.button ) {

            case 0:     // left click
                console.log("button click");
                fire(mouse.x, mouse.y, 0);
                break;
            case 2:
                break;

    }
}
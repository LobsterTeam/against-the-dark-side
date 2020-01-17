/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

import {
	Math as _Math,
	Spherical,
	Vector3,
        Raycaster,
        Vector2
} from "../../../build/three.module.js";
import { TransformControls } from './TransformControls.js';
import { OrbitControls } from './OrbitControls.js';
import {fire, toggleSound, camera, scene, renderer, render } from '../../../../scripts/main.js';
import {explode} from '../../../../scripts/explosion.js';

var FirstPersonControls = function ( object, domElement ) {

	if ( domElement === undefined ) {

		console.warn( 'THREE.FirstPersonControls: The second parameter "domElement" is now mandatory.' );
		domElement = document;

	}

	this.object = object;
	this.domElement = domElement;

	// API

	this.enabled = true;

	this.movementSpeed = 1.0;
	this.lookSpeed = 0.005;

	this.lookVertical = true;
	this.autoForward = false;

	this.activeLook = true;

	this.heightSpeed = false;
	this.heightCoef = 1.0;
	this.heightMin = 0.0;
	this.heightMax = 1.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.mouseDragOn = false;

	// internals

	this.autoSpeedFactor = 0.0;

	this.mouseX = 0;
	this.mouseY = 0;

	this.moveForward = false;
	this.moveBackward = false;
	this.moveLeft = false;
	this.moveRight = false;
        this.gameMode = true;

	this.viewHalfX = 0;
	this.viewHalfY = 0;
        
        this.speedStep = 5; // speed step of keyboard inputs

	// private variables

	var lat = 0;
	var lon = 0;

	var lookDirection = new Vector3();
	var spherical = new Spherical();
	var target = new Vector3();
        
        var INTERSECTED, PARENT;
        var control = new TransformControls( camera, renderer.domElement );
        scene.add( control );
        control.setMode("rotate");
        var raycaster =  new Raycaster();
        control.addEventListener( 'change', render);

        control.addEventListener( 'dragging-changed', function ( event ) {

                orbit.enabled = ! event.value;
                console.log("bu ne");

        } );
        var b = scene.getObjectByName( "blaster" ).children[0].children[0].children[0].children;
        console.log(scene.getObjectByName( "blaster" ));
        var c = [b[0].children[0], b[1].children[0], b[2].children[0], b[3].children[0]];
        var a = scene.getObjectByName( "bottle" ).children;
        var objects = scene.getObjectByName( "r2-d2" ).children.concat(a);
        console.log(objects);
                    
        
        var mouse = new Vector2();
        var orbit;

	//

	if ( this.domElement !== document ) {

		this.domElement.setAttribute( 'tabindex', - 1 );

	}

	//

	this.handleResize = function () {

		if ( this.domElement === document ) {

			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;

		} else {

			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;

		}

	};

	this.onMouseDown = function ( event ) {

		if ( this.domElement !== document ) {

			this.domElement.focus();

		}

		event.preventDefault();
		event.stopPropagation();

		if ( this.activeLook ) {

			switch ( event.button ) {

				case 0:     // left click
                                    //this.moveForward = true;
                                    console.log("button click");
                                    console.log(this.mouseX);
                                    console.log(this.mouseY);
                                    fire(this.mouseX, this.mouseY, 0);
                                    //explode();
                                    //this.activeLook = false;
                                    break;
				case 2: this.moveBackward = true; console.log("ha"); break;

			}

		}

		this.mouseDragOn = true;

	};

	this.onMouseUp = function ( event ) {

		//event.preventDefault();
		//event.stopPropagation();

		if ( this.activeLook ) {

			switch ( event.button ) {

				case 0: this.moveForward = false; break;
				case 2: this.moveBackward = false; break;

			}

		}

		this.mouseDragOn = false;

	};

	this.onMouseMove = function ( event ) {

		if ( this.domElement === document ) {

			this.mouseX = event.pageX - this.viewHalfX;
			this.mouseY = event.pageY - this.viewHalfY;
                        mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
                        mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

		} else {

			this.mouseX = event.pageX - this.domElement.offsetLeft - this.viewHalfX;
			this.mouseY = event.pageY - this.domElement.offsetTop - this.viewHalfY;

		}
                
                if (!this.gameMode) {
                    
                    //camera.updateMatrixWorld();
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
                            console.log("a");
                        }

                    }
                }
	};

	this.onKeyDown = function ( event ) {

		//event.preventDefault();

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = true; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = true; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = true; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = true; break;

			case 33: /*PgUp*/ this.moveUp = true; break;
			case 34: /*PgDn*/ this.moveDown = true; break;
                            
                        case 77:        // M key
                            toggleSound();
                            break;
                            
                        case 80:        // P key
                            // change shading
                            break;
                        case 76:        // L key
                            if (this.gameMode) {
                                this.gameMode = false;
                                this.activeLook = false;
                                //orbit = new OrbitControls( camera, renderer.domElement );
				//orbit.update();
				//orbit.addEventListener( 'change', render );
                            } else {
                                control.detach(INTERSECTED);
                                this.gameMode = true;
                                this.activeLook = true;
                            }
                            break;
		}

	};

	this.onKeyUp = function ( event ) {

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = false; break;

			case 33: /*PgUp*/ this.moveUp = false; break;
			case 34: /*PgDn*/ this.moveDown = false; break;

		}

	};

	this.lookAt = function ( x, y, z ) {

		if ( x.isVector3 ) {

			target.copy( x );

		} else {

			target.set( x, y, z );

		}

		this.object.lookAt( target );

		setOrientation( this );

		return this;

	};

	this.update = function () {

		var targetPosition = new Vector3();

		return function update( delta ) {

			if ( this.enabled === false ) return;

			if ( this.heightSpeed ) {

				var y = _Math.clamp( this.object.position.y, this.heightMin, this.heightMax );
				var heightDelta = y - this.heightMin;

				this.autoSpeedFactor = delta * ( heightDelta * this.heightCoef );

			} else {

				this.autoSpeedFactor = 0.0;

			}

			var actualMoveSpeed = delta * this.movementSpeed;

			
                        if ( this.moveForward && ( this.autoForward && ! this.moveBackward) && this.gameMode) {
                            if (this.movementSpeed < 1500) {
                                this.movementSpeed += this.speedStep;
                            }
                        }
                        if ( (this.moveForward || this.autoForward) && this.gameMode ) {
                            this.object.position.z -= actualMoveSpeed;
                        }
                        // S
			if ( this.moveBackward && this.gameMode ) {       // if it is game mode
                            // position i kontrol et eger sinira ulastiysa game over
                            if (this.movementSpeed > -1500) {
                                this.movementSpeed -= this.speedStep;
                            }
                        }
                        // A
			if ( this.moveLeft && this.gameMode) {
                            this.object.position.x -= actualMoveSpeed;
                        }
                        // D
			if ( this.moveRight && this.gameMode) {    // if it is game mode
                            this.object.position.x += actualMoveSpeed;
                        }
                        // PgUp
			if ( this.moveUp && this.gameMode ) {    // if it is game mode
                            this.object.position.y += actualMoveSpeed;
                        }
                        // PgDn
			if ( this.moveDown && this.gameMode ) {  // if it is game mode
                            this.object.position.y -= actualMoveSpeed;
                        }

			var actualLookSpeed = delta * this.lookSpeed;

			if ( ! this.activeLook ) {

				actualLookSpeed = 0;

			}

			var verticalLookRatio = 1;

			if ( this.constrainVertical ) {

				verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

			}

			lon -= this.mouseX * actualLookSpeed;
			if ( this.lookVertical ) lat -= this.mouseY * actualLookSpeed * verticalLookRatio;

			lat = Math.max( - 85, Math.min( 85, lat ) );

			var phi = _Math.degToRad( 90 - lat );
			var theta = _Math.degToRad( lon );

			if ( this.constrainVertical ) {

				phi = _Math.mapLinear( phi, 0, Math.PI, this.verticalMin, this.verticalMax );

			}

			var position = this.object.position;
			targetPosition.setFromSphericalCoords( 1, phi, theta ).add( position );

                        this.object.lookAt( targetPosition );

		};

	}();

	function contextmenu( event ) {

		event.preventDefault();

	}

	this.dispose = function () {

		this.domElement.removeEventListener( 'contextmenu', contextmenu, false );
		this.domElement.removeEventListener( 'mousedown', _onMouseDown, false );
		this.domElement.removeEventListener( 'mousemove', _onMouseMove, false );
		this.domElement.removeEventListener( 'mouseup', _onMouseUp, false );

		window.removeEventListener( 'keydown', _onKeyDown, false );
		window.removeEventListener( 'keyup', _onKeyUp, false );

	};

	var _onMouseMove = bind( this, this.onMouseMove );
	var _onMouseDown = bind( this, this.onMouseDown );
	var _onMouseUp = bind( this, this.onMouseUp );
	var _onKeyDown = bind( this, this.onKeyDown );
	var _onKeyUp = bind( this, this.onKeyUp );

	this.domElement.addEventListener( 'contextmenu', contextmenu, false );
	this.domElement.addEventListener( 'mousemove', _onMouseMove, false );
	this.domElement.addEventListener( 'mousedown', _onMouseDown, false );
	this.domElement.addEventListener( 'mouseup', _onMouseUp, false );

	window.addEventListener( 'keydown', _onKeyDown, false );
	window.addEventListener( 'keyup', _onKeyUp, false );

	function bind( scope, fn ) {

		return function () {

			fn.apply( scope, arguments );

		};

	}

	function setOrientation( controls ) {

		var quaternion = controls.object.quaternion;

		lookDirection.set( 0, 0, - 1 ).applyQuaternion( quaternion );
		spherical.setFromVector3( lookDirection );

		lat = 90 - _Math.radToDeg( spherical.phi );
		lon = _Math.radToDeg( spherical.theta );

	}

	this.handleResize();

	setOrientation( this );

};

export { FirstPersonControls };

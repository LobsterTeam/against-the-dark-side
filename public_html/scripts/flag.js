import * as THREE from '../three.js-dev/build/three.module.js';
import { flagGeometry } from './main.js';

var DAMPING = 0.03;
var DRAG = 1 - DAMPING;
var MASS = 0.1;
var restDistance = 25;
var xSegs = 25;
var ySegs = 25;

export var flagFunction = plane( restDistance * xSegs, restDistance * ySegs );
export var flag = new Flag( xSegs, ySegs );
export var windForce = new THREE.Vector3( 0, 0, 0 );

var GRAVITY = 981 * 1.4;
var gravity = new THREE.Vector3( 0, - GRAVITY, 0 ).multiplyScalar( MASS );
var TIMESTEP = 18 / 1000;
var TIMESTEP_SQ = TIMESTEP * TIMESTEP;
var pins = [];
var ballPosition = new THREE.Vector3( 0, - 45, 0 );
var ballSize = 60; //40
var tmpForce = new THREE.Vector3();
var lastTime;


function plane( width, height ) {
    return function ( u, v, target ) {

        var x = ( u - 0.5 ) * width;
        var y = ( v + 0.5 ) * height;
        var z = 0;

        target.set( x, y, z );
    };
}

function Particle( x, y, z, mass ) {

    this.position = new THREE.Vector3();
    this.previous = new THREE.Vector3();
    this.original = new THREE.Vector3();
    this.a = new THREE.Vector3( 0, 0, 0 ); // acceleration
    this.mass = mass;
    this.invMass = 1 / mass;
    this.tmp = new THREE.Vector3();
    this.tmp2 = new THREE.Vector3();

    // init
    flagFunction( x, y, this.position ); // position
    flagFunction( x, y, this.previous ); // previous
    flagFunction( x, y, this.original );
}

// Force -> Acceleration
Particle.prototype.addForce = function ( force ) {
    this.a.add(
            this.tmp2.copy( force ).multiplyScalar( this.invMass )
    );
};

// Performs Verlet integration
Particle.prototype.integrate = function ( timesq ) {

    var newPos = this.tmp.subVectors( this.position, this.previous );
    newPos.multiplyScalar( DRAG ).add( this.position );
    newPos.add( this.a.multiplyScalar( timesq ) );

    this.tmp = this.previous;
    this.previous = this.position;
    this.position = newPos;
    this.a.set( 0, 0, 0 );
};


var diff = new THREE.Vector3();

function satisfyConstraints( p1, p2, distance ) {

    diff.subVectors( p2.position, p1.position );
    var currentDist = diff.length();
    if ( currentDist === 0 ) return; // prevents division by 0
    var correction = diff.multiplyScalar( 1 - distance / currentDist );
    var correctionHalf = correction.multiplyScalar( 0.5 );
    p1.position.add( correctionHalf );
    p2.position.sub( correctionHalf );
}

function Flag( w, h ) {

    w = w || 10;
    h = h || 10;
    this.w = w;
    this.h = h;

    var particles = [];
    var constraints = [];
    var u, v;

    // Create particles
    for ( v = 0; v <= h; v ++ ) {
        for ( u = 0; u <= w; u ++ ) {
            particles.push(
                new Particle( u / w, v / h, 0, MASS )
            );
        }
    }

    // Structural
    for ( v = 0; v < h; v ++ ) {
        for ( u = 0; u < w; u ++ ) {
            constraints.push( [
                    particles[ index( u, v ) ],
                    particles[ index( u, v + 1 ) ],
                    restDistance
            ] );

            constraints.push( [
                    particles[ index( u, v ) ],
                    particles[ index( u + 1, v ) ],
                    restDistance
            ] );
        }
    }

    for ( u = w, v = 0; v < h; v ++ ) {
        constraints.push( [
                particles[ index( u, v ) ],
                particles[ index( u, v + 1 ) ],
                restDistance

        ] );
    }

    for ( v = h, u = 0; u < w; u ++ ) {
        constraints.push( [
                particles[ index( u, v ) ],
                particles[ index( u + 1, v ) ],
                restDistance
        ] );
    }

    // While many systems use shear and bend springs,
    // the relaxed constraints model seems to be just fine
    // using structural springs.
    // Shear
    // var diagonalDist = Math.sqrt(restDistance * restDistance * 2);


    // for (v=0;v<h;v++) {
    // 	for (u=0;u<w;u++) {

    // 		constraints.push([
    // 			particles[index(u, v)],
    // 			particles[index(u+1, v+1)],
    // 			diagonalDist
    // 		]);

    // 		constraints.push([
    // 			particles[index(u+1, v)],
    // 			particles[index(u, v+1)],
    // 			diagonalDist
    // 		]);

    // 	}
    // }

    this.particles = particles;
    this.constraints = constraints;

    function index( u, v ) {
        return u + v * ( w + 1 );
    }

    this.index = index;
}

export function simulate( time ) {

    if ( ! lastTime ) {
        lastTime = time;
        return;
    }

    var i, j, il, particles, particle, constraints, constraint;

    // Aerodynamics forces
    var indx;
    var normal = new THREE.Vector3();
    var indices = flagGeometry.index;
    var normals = flagGeometry.attributes.normal;

    particles = flag.particles;

    for ( i = 0, il = indices.count; i < il; i += 3 ) {
        for ( j = 0; j < 3; j ++ ) {
            indx = indices.getX( i + j );
            normal.fromBufferAttribute( normals, indx );
            tmpForce.copy( normal ).normalize().multiplyScalar( normal.dot( windForce ) );
            particles[ indx ].addForce( tmpForce );
        }
    }

    for ( particles = flag.particles, i = 0, il = particles.length; i < il; i ++ ) {
        particle = particles[ i ];
        particle.addForce( gravity );
        particle.integrate( TIMESTEP_SQ );
    }

    // Start Constraints
    constraints = flag.constraints;
    il = constraints.length;

    for ( i = 0; i < il; i ++ ) {
        constraint = constraints[ i ];
        satisfyConstraints( constraint[ 0 ], constraint[ 1 ], constraint[ 2 ] );
    }

    // Ball Constraints
    ballPosition.z = - Math.sin( Date.now() / 600 ) * 90; //+ 40;
    ballPosition.x = Math.cos( Date.now() / 400 ) * 70;

    for ( particles = flag.particles, i = 0, il = particles.length; i < il; i ++ ) {

        particle = particles[ i ];
        var pos = particle.position;
        diff.subVectors( pos, ballPosition );
        if ( diff.length() < ballSize ) {

            // collided
            diff.normalize().multiplyScalar( ballSize );
            pos.copy( ballPosition ).add( diff );
        }
    }

    // Floor Constraints
    for ( particles = flag.particles, i = 0, il = particles.length; i < il; i ++ ) {
        particle = particles[ i ];
        pos = particle.position;
        if ( pos.y < - 250 ) {
            pos.y = - 250;
        }
    }

    // Pin Constraints
    for ( i = 0, il = pins.length; i < il; i ++ ) {
        var xy = pins[ i ];
        var p = particles[ xy ];
        p.position.copy( p.original );
        p.previous.copy( p.original );
    }
}

var pins = [];
for (var j = 0; j<= flag.h; j++) {
    pins.push(flag.index(0, j));
}

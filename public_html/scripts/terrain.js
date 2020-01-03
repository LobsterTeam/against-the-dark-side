import { ImprovedNoise } from '../three.js-dev/examples/jsm/math/ImprovedNoise.js';
import * as THREE from '../three.js-dev/build/three.module.js';
import { sunPos } from './sun.js';

export function generateTerrainHeight( width, height ) {
    var size = width * height, data = new Uint8Array( size ),
        perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 1;

    for ( var j = 0; j < 4; j ++ ) {
        for ( var i = 0; i < size; i ++ ) {
            
            var k = ~ ~ (i / 256);
            var x = i - (k * 256);
            //console.log(i);
            //console.log(k);
            
            if ((x < 106 || x > 156) || j < 2) {
                var x = i % width;
                var y = ~ ~ ( i / width );       // get floor
                data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.5 );
            }
            if ((x < 86 || x > 176) || j < 2) {
                var x = i % width;
                var y = ~ ~ ( i / width );       // get floor
                data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 2.0 );
            }
            
            
        }
        quality *= 2;
    }
    return data;
}

export function generateTerrainTexture( data, width, height ) {
    var canvas, canvasScaled, context, image, imageData, vector3, shade;
    vector3 = new THREE.Vector3( 0, 0, 0 );
    var sunDup = new THREE.Vector3(0, 0, 0);
    sunDup.x = sunPos.x;
    sunDup.y = sunPos.y;
    sunDup.z = sunPos.z;
    sunDup.normalize();
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
        shade = vector3.dot( sunDup );
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

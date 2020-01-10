import { ImprovedNoise } from '../three.js-dev/examples/jsm/math/ImprovedNoise.js';
import * as THREE from '../three.js-dev/build/three.module.js';
import { sunPos } from './skyAndSun.js';
import { getPixelValues } from './helpers/ImageHelpers.js';
import { HeightMapBufferGeometry } from './helpers/HeightMapGeometry.js';
import { HeightMapMesh } from './helpers/HeightMapMesh.js';

function getHeightData(img) {
        var canvas = document.createElement( 'canvas' );
        canvas.width = 40;
        canvas.height = 55;
        var context = canvas.getContext( '2d' );

        var size = 40 * 50, data = new Float32Array( size );

        context.drawImage(img,0,0);

        for ( var i = 0; i < size; i ++ ) {
                data[i] = 0;
        }

        var imgd = context.getImageData(0, 0, 40, 50);
        var pix = imgd.data;

        var j=0;
        for (var i = 0, n = pix.length; i < n; i += (4)) {
                var all = pix[i]+pix[i+1]+pix[i+2];
                data[j++] = all*4;
        }

        return data;

}

export function newTerrain(img, scene) {
    var data = getHeightData(img);
    // plane
    var plane = new THREE.PlaneGeometry( 32000, 60000, 39, 49 );

    for ( var i = 0, l = plane.vertices.length; i < l; i++ ) {
            plane.vertices[i].z = data[i];
    }


    var planeleft = new THREE.PlaneGeometry( 64000, 60000, 1, 49 );

    var h = 0;
    var j = 0;
    for ( var i = 0, l = planeleft.vertices.length; i < l; i++ ) {
            var bb = i%2;
            if (bb == 0) {
                    h = data[j*40];
                    ++j;
            }
            planeleft.vertices[i].z = h;
    }

    var planeright = new THREE.PlaneGeometry( 64000, 60000, 1, 49 );

    j = 0;
    for ( var i = 0, l = planeright.vertices.length; i < l; i++ ) {
            var bb = i%2;
            if (bb == 0) {
                    h = data[(j*40)+39];
                    ++j;
                    planeright.vertices[i].z = h;
            } else {
                    planeright.vertices[i].z = 0;
            }
    }


    plane.computeFaceNormals();
    plane.computeVertexNormals();

    planeleft.computeFaceNormals();
    planeleft.computeVertexNormals();
    planeright.computeFaceNormals();
    planeright.computeVertexNormals();



    var texture = THREE.ImageUtils.loadTexture( "textures/sand4.jpg" );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 3, 3 );
    var material = new THREE.MeshPhongMaterial( { opacity:1, map: texture, color: 0x999999, specular: 0xfff9c2, shininess: 5 } );


    var groundMesh1 = new THREE.Mesh( plane, material );
    groundMesh1.rotation.set(-Math.PI/2,0,0);
    groundMesh1.position.y = -300;
    groundMesh1.position.z = 30000;
    scene.add( groundMesh1 );

    var groundMesh2 = new THREE.Mesh( plane, material );
    groundMesh2.rotation.set(-Math.PI/2,0,0);
    groundMesh2.position.y = -300;
    groundMesh2.position.z = -30000;
    scene.add( groundMesh2 );

    var groundMesh3 = new THREE.Mesh( plane, material );
    groundMesh3.rotation.set(-Math.PI/2,0,0);
    groundMesh3.position.y = -300;
    groundMesh3.position.z = -90000;
    scene.add( groundMesh3 );

    groundMesh1.castShadow = false;
    groundMesh1.receiveShadow = true;

    groundMesh2.castShadow = false;
    groundMesh2.receiveShadow = true;


    var groundMesh1Left = new THREE.Mesh( plane, material );
    groundMesh1Left.rotation.set(-Math.PI/2,0,0);
    groundMesh1Left.position.y = -300;
    groundMesh1Left.position.z = 30000;
    groundMesh1Left.position.x = -32000;
    scene.add( groundMesh1Left );

    var groundMesh2Left = new THREE.Mesh( plane, material );
    groundMesh2Left.rotation.set(-Math.PI/2,0,0);
    groundMesh2Left.position.y = -300;
    groundMesh2Left.position.z = -30000;
    groundMesh2Left.position.x = -32000;
    scene.add( groundMesh2Left );

    var groundMesh3Left = new THREE.Mesh( plane, material );
    groundMesh3Left.rotation.set(-Math.PI/2,0,0);
    groundMesh3Left.position.y = -300;
    groundMesh3Left.position.z = -90000;
    groundMesh3Left.position.x = -32000;
    scene.add( groundMesh3Left );


    var groundMesh1Right = new THREE.Mesh( plane, material );
    groundMesh1Right.rotation.set(-Math.PI/2,0,0);
    groundMesh1Right.position.y = -300;
    groundMesh1Right.position.z = 30000;
    groundMesh1Right.position.x = 32000;
    scene.add( groundMesh1Right );

    var groundMesh2Right = new THREE.Mesh( plane, material );
    groundMesh2Right.rotation.set(-Math.PI/2,0,0);
    groundMesh2Right.position.y = -300;
    groundMesh2Right.position.z = -30000;
    groundMesh2Right.position.x = 32000;
    scene.add( groundMesh2Right );

    var groundMesh3Right = new THREE.Mesh( plane, material );
    groundMesh3Right.rotation.set(-Math.PI/2,0,0);
    groundMesh3Right.position.y = -300;
    groundMesh3Right.position.z = -90000;
    groundMesh3Right.position.x = 32000;
    scene.add( groundMesh3Right );

    groundMesh1Left.castShadow = false;
    groundMesh1Left.receiveShadow = true;

    groundMesh2Left.castShadow = false;
    groundMesh2Left.receiveShadow = true;

    groundMesh1Right.castShadow = false;
    groundMesh1Right.receiveShadow = true;

    groundMesh2Right.castShadow = false;
    groundMesh2Right.receiveShadow = true;


}


import * as THREE from '../three.js-dev/build/three.module.js';

export var terrainMeshes = [], terrainTexture;

function getHeightData(img) {
    var canvas = document.createElement( 'canvas' );
    canvas.width = 40;
    canvas.height = 55;
    var context = canvas.getContext( '2d' );
    var size = 40 * 50, data = new Float32Array( size );
    context.drawImage(img, 0, 0);

    for ( var i = 0; i < size; i ++ ) {
        data[i] = 0;
    }

    var imgData = context.getImageData(0, 0, 40, 50);
    var pix = imgData.data;

    var j=0;
    for (var i = 0, n = pix.length; i < n; i += (4)) {
        var all = pix[i] + pix[i+1] + pix[i+2];
        data[j++] = all*4;
    }

    return data;
}

export function generateDesertTerrain(img, scene) {
    var data = getHeightData(img);
    
    // plane
    var plane = new THREE.PlaneGeometry( 32000, 60000, 39, 49 );

    for ( var i = 0, l = plane.vertices.length; i < l; i++ ) {
            plane.vertices[i].z = data[i];
    }

    plane.verticesNeedUpdate = true;
    plane.computeFaceNormals();
    plane.computeVertexNormals();

    var textureLoader = new THREE.TextureLoader();
    terrainTexture = textureLoader.load( "textures/sand.jpg" );       // TODO
    terrainTexture.wrapS = terrainTexture.wrapT = THREE.RepeatWrapping;
    terrainTexture.repeat.set( 25, 25 );
    var material = new THREE.MeshPhongMaterial( { map: terrainTexture } );

    createGroundMesh (scene, plane, material, 0, 30000);
    createGroundMesh (scene, plane, material, 0, -30000);
    createGroundMesh (scene, plane, material, 0, -90000);
    createGroundMesh (scene, plane, material, -32000, 30000);
    createGroundMesh (scene, plane, material, -32000, -30000);
    createGroundMesh (scene, plane, material, -32000, -90000);
    createGroundMesh (scene, plane, material, 32000, 30000);
    createGroundMesh (scene, plane, material, 32000, -30000);
    createGroundMesh (scene, plane, material, 32000, -90000);
}

function createGroundMesh (scene, plane, material, x, z) {
    var groundMesh = new THREE.Mesh( plane, material );
    groundMesh.rotation.set(-Math.PI/2,0,0);
    groundMesh.position.y = -300;
    groundMesh.position.z = z;
    groundMesh.position.x = x;
    groundMesh.castShadow = false;
    groundMesh.receiveShadow = true;
    groundMesh.updateMatrixWorld();
    terrainMeshes.push(groundMesh);
    groundMesh.name = "terrain";
    scene.add( groundMesh );
}
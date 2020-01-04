import * as THREE from '../../three.js-dev/build/three.module.js';


export var HeightMapBufferGeometry = function(heightData, widthSegments, depthSegments, maxHeight) {
    "use strict";

    if (maxHeight === undefined) {
        maxHeight = 255;
    }

    // Create the mesh as a 1 x 1 mesh, each cell is (1/widthSegments) x (1/depthSegments).
    THREE.PlaneBufferGeometry.call(this, 1, 1, widthSegments-1, depthSegments-1);

    this.type = 'HeightMapBufferGeometry';
    this.parameters.scale = new THREE.Vector3(1,1,1);

    this.rotateX( - Math.PI / 2 );

    var vertices = this.attributes.position.array;

    for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {

        vertices[ j + 1 ] = heightData[ i ] / maxHeight;

    }

    this.computeVertexNormals();
    this.computeBoundingBox();
    this.computeBoundingSphere();
};

HeightMapBufferGeometry.prototype = Object.create( THREE.PlaneBufferGeometry.prototype );
HeightMapBufferGeometry.prototype.constructor = HeightMapBufferGeometry;

HeightMapBufferGeometry.prototype._computeVertexIndex = function(xPos, zPos) {
    "use strict";
    var widthVertices = this.parameters.widthSegments + 1;
    var depthVertices = this.parameters.heightSegments + 1;

    var transformedPos = this._computeRelativePosition(xPos, zPos);
    xPos = transformedPos.x;
    zPos = transformedPos.z;

    if (xPos < 0) {
        xPos = 0;
    } else if (xPos >= 1) {
        xPos = (widthVertices - 1)/widthVertices;
    }

    if (zPos < 0) {
        zPos = 0;
    } else if (zPos >= 1) {
        zPos = (depthVertices - 1)/depthVertices;
    }

    //console.log('will compute vertex index for params ' + xPos + ' and ' + zPos);

    xPos = Math.floor(xPos * widthVertices);
    zPos = Math.floor(zPos * depthVertices);

    //console.log('computed ' + xPos + ', ' + zPos + ' which gives ' + index);
    return zPos*widthVertices + xPos;
};

HeightMapBufferGeometry.prototype._computeRelativePosition = function(xPos, zPos) {
    var transformedXPos = xPos - this.boundingBox.min.x;
    var transformedZPos = zPos - this.boundingBox.min.z;

    transformedXPos = transformedXPos / this.parameters.scale.x;
    transformedZPos = transformedZPos / this.parameters.scale.z;

    return {
        x: transformedXPos,
        z: transformedZPos
    }
}

HeightMapBufferGeometry.prototype.withinBoundaries = function(localPos) {
    var relPos = this._computeRelativePosition(localPos.x, localPos.z);

    return (relPos.x >= 0 && relPos.x < 1) && (relPos.z >= 0 && relPos.z < 1);
}

HeightMapBufferGeometry.prototype.getHeightAtPoint = function(localPos) {
    "use strict";
    var vertexIndex = 3*this._computeVertexIndex(localPos.x, localPos.z);

    var height = this.attributes.position.array[vertexIndex + 1];

    return height;
};

HeightMapBufferGeometry.prototype.getNormalAtPoint = function(localPos) {
    "use strict";
    var vertexIndex = 3*this._computeVertexIndex(localPos.x, localPos.z);

    var normal = new THREE.Vector3();
    normal.fromArray(this.attributes.normal.array, vertexIndex);

    return normal;
};

HeightMapBufferGeometry.prototype.scale = function(x, y, z) {
    "use strict";
    THREE.PlaneBufferGeometry.prototype.scale.call(this, x,y,z);

    this.parameters.scale.set(x,y,z);

    this.computeVertexNormals();
    this.computeBoundingBox();
    this.computeBoundingSphere();
};
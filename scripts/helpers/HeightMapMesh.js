import * as THREE from '../../three.js-dev/build/three.module.js';
import { HeightMapBufferGeometry } from './HeightMapGeometry.js';

export var HeightMapMesh = function(heightMapGeometry, material) {
    "use strict";
    // Create the mesh as a widthSegements x heightSegments mesh, each cell is 1x1.
    THREE.Mesh.call(this, heightMapGeometry, material);

    this.type = 'HeightMapMesh';

    if (!(heightMapGeometry instanceof HeightMapBufferGeometry)) {
        console.error('HeightMapMesh: heightMapGeometry is not instance of HeightMapBufferGeometry', heightMapGeometry);
    }
};

HeightMapMesh.prototype = Object.create( THREE.Mesh.prototype );
HeightMapMesh.prototype.constructor = HeightMapMesh;

HeightMapMesh.prototype.getHeightAtPoint = function(localPos) {
    "use strict";
    return this.computePositionAtPoint(localPos).y;
};

HeightMapMesh.prototype.computePositionAtPoint = function(localPos) {
    "use strict";
    var inverse = new THREE.Matrix4().getInverse(this.matrix);
    var pos = new THREE.Vector3().copy(localPos);

    // Convert coordinates from possibly scaled, translated and rotated coordinates to object local coordinates.
    pos.applyMatrix4(inverse);

    var height = this.geometry.getHeightAtPoint(pos);

    pos.setY(height);

    pos.applyMatrix4(this.matrix);

    return pos;
};

HeightMapMesh.prototype.computeNormalAtPoint = function(localPos) {
    "use strict";
    var inverse = new THREE.Matrix4().getInverse(this.matrix);
    var pos = new THREE.Vector4().copy(localPos);

    // Convert coordinates from possibly scaled, translated and rotated coordinates to object local coordinates.
    pos.applyMatrix4(inverse);

    var normal = this.geometry.getNormalAtPoint(pos);

    return normal;
};

HeightMapMesh.prototype.withinBoundaries = function(localPos) {
    "use strict";
    var inverse = new THREE.Matrix4().getInverse(this.matrix);
    var pos = new THREE.Vector4().copy(localPos);

    // Convert coordinates from possibly scaled, translated and rotated coordinates to object local coordinates.
    pos.applyMatrix4(inverse);

    return this.geometry.withinBoundaries(pos);
}
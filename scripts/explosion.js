import * as THREE from '../three.js-dev/build/three.module.js';
import { scene, camera, particleArray} from './main.js';

var i;

export function addParticles() {
    // Particles (explosion)
    var geometry = new THREE.Geometry();

    for (i = 0; i < 500; i++) {
        var radius = Math.random() * 50;
        var vector = getRandomPointOnSphere(radius);
        geometry.vertices.push(new THREE.Vector3(vector));
    }
    
    var textureLoader = new THREE.TextureLoader();
    var particleImage = textureLoader.load( "img/fraction.png" );

    //var particleImage = THREE.ImageUtils.loadTexture('img/fraction1.png');
    var colorArray = [0xffffff, 0xfabe82, 0xe03809, 0xee9c64, 0x910300];
    var sizeArray = [48, 48, 48, 48, 64];

    for (i = 0; i < 15; ++i) {
        var color = colorArray[i % colorArray.length];
        var size = sizeArray[i % sizeArray.length];

        var particleMaterial = new THREE.PointsMaterial({
            color,
            size,
            map: particleImage,
            opacity: 1.0,
            transparent: true,
            depthTest: false,
            blending: THREE.AdditiveBlending
        });
        var particles = new THREE.Points(geometry, particleMaterial);

        particles.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        particles.position.z = -500 + i;
        particles.scale.set(0.1, 0.1, 0.1);
        particles.visible = false;

        scene.add(particles);
        var o = { p: particles, m: particleMaterial };
        particleArray.push(o);
    }
}

function explodeDone() {
    for (i = 0; i < particleArray.length; ++i) {
        var particles = particleArray[i].p;
        var material = particleArray[i].m;

        particles.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        particles.scale.set(0.1, 0.1, 0.1);
        material.opacity = 1;
        particles.visible = false;

        var positiontween = new TWEEN.Tween(particles.position)
          .to({ z: particles.position.z - 500 }, 1000)
          .easing(TWEEN.Easing.Linear.EaseNone);
        positiontween.start();
    }
}

export function explode() {
    //console.log(particleArray);

    for (i = 0; i < particleArray.length; ++i) {
        var particles = particleArray[i].p;
        var material = particleArray[i].m;

        particles.visible = true;
        particles.position.x = camera.position.x;
        particles.position.y = camera.position.y;
        particles.position.z = camera.position.z - 100;
        //console.log(particles.position);
        //console.log(camera.position);

        var outscale = 3 + Math.random() * 5;

        var scaletween = new TWEEN.Tween(particles.scale)
          .to({ x: outscale, y: outscale, z: outscale }, 1500)
          .easing(TWEEN.Easing.Exponential.EaseOut);
        scaletween.start();

        var alphatween = new TWEEN.Tween(material)
          .to({ opacity: 0 }, 1500)
          .easing(TWEEN.Easing.Exponential.EaseOut);
        alphatween.start();

        var rotatetween = new TWEEN.Tween(particles.rotation)
          .to(
            {
              x: particles.rotation.x + 0.75,
              y: particles.rotation.y + 0.75,
              z: particles.rotation.z + 0.75
            },
            1700
          )
          .easing(TWEEN.Easing.Exponential.EaseOut);
        rotatetween.start();

        var positiontween = new TWEEN.Tween(particles.position)
          .to(
            {
              x: camera.position.x,
              y: camera.position.y + 30,
              z: particles.position.z + 500
            },
            2500
          )
          .easing(TWEEN.Easing.Exponential.EaseOut);
        positiontween.start();
    }

    var delaytween = new TWEEN.Tween(camera.up)
      .to({ x: 0 }, 1000)
      .easing(TWEEN.Easing.Exponential.EaseOut)
      .delay(1500)
      .onComplete(explodeDone);
    delaytween.start();

}

function getRandomPointOnSphere(r) {
    var angle = Math.random() * Math.PI * 2;
    var u = Math.random() * 2 - 1;

    var v = new THREE.Vector3(
      Math.cos(angle) * Math.sqrt(1 - u ** 2) * r,
      Math.sin(angle) * Math.sqrt(1 - u ** 2) * r,
      u * r
    );
    return v;
}

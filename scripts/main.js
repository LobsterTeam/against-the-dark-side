var container;
var camera, scene, renderer;
var mouseX = 0, mouseY = 0;     // mouse movement variables
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var object;
var radius = 6371;      // constant scalar for star background
var i, j;       // loop identifiers


function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1e7);
    camera.position.z = 1000;
    
    // scene
    scene = new THREE.Scene();
    //var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
    //scene.add( ambientLight );
    //var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
    //camera.add( pointLight );
    //scene.add( camera );

    // manager
    function loadModel() {
        object.traverse( function ( child ) {
                //if ( child.isMesh ) child.material.map = texture;
        } );
        object.position.y = - 95;
        scene.add( object );
    }

    //var manager = new THREE.LoadingManager( loadModel );
    //manager.onProgress = function ( item, loaded, total ) {
    //        console.log( item, loaded, total );
    //};

    // model
    function onProgress( xhr ) {
        if ( xhr.lengthComputable ) {
                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );
        }
    }

    function onError() {
        console.log("Error while loading model");
    }

    //var mtlLoader = new THREE.MTLLoader();
    //mtlLoader.load("models/r2d2-obj/r2-d2.mtl", function(materials){

    //    materials.preload();
    //    var objLoader = new THREE.OBJLoader();
    //    objLoader.setMaterials(materials);
    //    objLoader.load("models/r2d2-obj/r2-d2.obj", function(obj){
    //        scene.add(obj);
    //    }, onProgress, onError);
    //})

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );

    //document.addEventListener( 'mousemove', onDocumentMouseMove, false );
    //window.addEventListener( 'resize', onWindowResize, false );
    
    createBackgroundWithStars();
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
    mouseX = ( event.clientX - windowHalfX ) / 2;
    mouseY = ( event.clientY - windowHalfY ) / 2;
}

function animate() {
    requestAnimationFrame(animate);
    render();
}

function render() {
    camera.position.x += ( mouseX - camera.position.x ) * .05;
    camera.position.y += ( - mouseY - camera.position.y ) * .05;
    camera.lookAt( scene.position );
    renderer.render( scene, camera );
}

function showStarWarsEntry () {
    // instantiate a loader
    var loader = new THREE.SVGLoader();

    // load a SVG resource
    loader.load(
        // resource URL
        'datas/star-wars-logo.svg',
        // called when the resource is loaded
        function (data) {

            var paths = data.paths;
            var group = new THREE.Group();
            group.scale.multiplyScalar( 0.25 );
            group.position.x = - 70;
            group.position.y = 70;
            group.scale.y *= - 1;

            for (var i = 0; i < paths.length; i ++) {

                var path = paths[i];

                var material = new THREE.MeshBasicMaterial( {
                    color: path.color,
                    side: THREE.DoubleSide,
                    depthWrite: false
                } );

                var shapes = path.toShapes( true );

                for ( var j = 0; j < shapes.length; j ++ ) {
                    var shape = shapes[ j ];
                    var geometry = new THREE.ShapeBufferGeometry( shape );
                    var mesh = new THREE.Mesh( geometry, material );
                    group.add( mesh );
                }
            }
            scene.add(group);
        },
        
        // called when loading is in progresses
        function (xhr) {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        
        // called when loading has errors
        function ( error ) {
            console.log( 'An error happened' );
        }
    );
}

// This function adds stars with random position, color and sizes to scene
function createBackgroundWithStars () {
        
    var starsGeometry = [new THREE.BufferGeometry(), new THREE.BufferGeometry()];
    var starVertices1 = [];
    var starVertices2 = [];
    var vertex = new THREE.Vector3();
    for (i = 0; i < 250; i ++) {
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.multiplyScalar(radius);
        starVertices1.push(vertex.x, vertex.y, vertex.z);
    }
    for (i = 0; i < 1500; i ++) {
        vertex.x = Math.random() * 2 - 1;
        vertex.y = Math.random() * 2 - 1;
        vertex.z = Math.random() * 2 - 1;
        vertex.multiplyScalar(radius);
        starVertices2.push(vertex.x, vertex.y, vertex.z);
    }
    starsGeometry[0].setAttribute('position', new THREE.Float32BufferAttribute(starVertices1, 3));
    starsGeometry[1].setAttribute('position', new THREE.Float32BufferAttribute(starVertices2, 3));
    var stars;
    var starsMaterials = [
        new THREE.PointsMaterial({color: 0xffffff, size: 2, sizeAttenuation: false}),
        new THREE.PointsMaterial({color: 0xffffff, size: 1, sizeAttenuation: false}),
        new THREE.PointsMaterial({color: 0xeeeeee, size: 2, sizeAttenuation: false}),
        new THREE.PointsMaterial({color: 0xeeeeee, size: 1, sizeAttenuation: false}),
        new THREE.PointsMaterial({color: 0x666666, size: 2, sizeAttenuation: false}),
        new THREE.PointsMaterial({color: 0x666666, size: 1, sizeAttenuation: false})
    ];
    for (i = 10; i < 30; i ++) {
        stars = new THREE.Points(starsGeometry[i % 2], starsMaterials[i % 6]);
        stars.rotation.x = Math.random() * 6;
        stars.rotation.y = Math.random() * 6;
        stars.rotation.z = Math.random() * 6;
        stars.scale.setScalar(i * 10);
        stars.matrixAutoUpdate = false;
        stars.updateMatrix();
        scene.add(stars);
    }
}

init();
animate();

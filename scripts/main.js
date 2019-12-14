function main() {


    var container;

    var camera, scene, renderer;

    var mouseX = 0, mouseY = 0;

    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;

    var object;

    init();
    animate();


    function init() {

            container = document.createElement( 'div' );
            document.body.appendChild( container );

            camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
            camera.position.z = 250;

            // scene

            scene = new THREE.Scene();

            var ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
            scene.add( ambientLight );

            var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
            camera.add( pointLight );
            scene.add( camera );

            // manager

            function loadModel() {

                    object.traverse( function ( child ) {

                            //if ( child.isMesh ) child.material.map = texture;

                    } );

                    object.position.y = - 95;
                    scene.add( object );

            }

            var manager = new THREE.LoadingManager( loadModel );

            manager.onProgress = function ( item, loaded, total ) {

                    console.log( item, loaded, total );

            };


           

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

            var mtlLoader = new THREE.MTLLoader();
            mtlLoader.load("models/r2d2-obj/r2-d2.mtl", function(materials){
                
                materials.preload();
                var objLoader = new THREE.OBJLoader();
                objLoader.setMaterials(materials);
                objLoader.load("models/r2d2-obj/r2-d2.obj", function(obj){
                    scene.add(obj);
                }, onProgress, onError);
            })

            //

            renderer = new THREE.WebGLRenderer();
            renderer.setPixelRatio( window.devicePixelRatio );
            renderer.setSize( window.innerWidth, window.innerHeight );
            container.appendChild( renderer.domElement );

            document.addEventListener( 'mousemove', onDocumentMouseMove, false );

            //

            window.addEventListener( 'resize', onWindowResize, false );

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

    //

    function animate() {

            requestAnimationFrame( animate );
            render();

    }

    function render() {

            camera.position.x += ( mouseX - camera.position.x ) * .05;
            camera.position.y += ( - mouseY - camera.position.y ) * .05;

            camera.lookAt( scene.position );

            renderer.render( scene, camera );

    }
    }

main();
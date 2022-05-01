import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const PI = 3.14159265359

////// Audio
document.body.addEventListener("click", function () {
    console.log('arar')
    var audio = new Audio('../daftpunkaudio.mp3');
    audio.play()
})
////// Shapes

/// Pyramid
const geometryPyramid = new THREE.CylinderGeometry(0, 2, 3, 4, 1)
const materialPyramid = new THREE.MeshNormalMaterial();
const pyramid = new THREE.Mesh(geometryPyramid, materialPyramid);
pyramid.position.z = -7
pyramid.rotateY(PI)
scene.add(pyramid);

/// Wheel
const geometryWheel = new THREE.CylinderGeometry( 5, 5, 3, 10 );
const materialWheel = new THREE.MeshBasicMaterial( {color: 0xffff00} );
const wheel = new THREE.Mesh( geometryWheel, materialWheel );
wheel.position.z = -30
wheel.position.x = -10
wheel.position.y= 5
wheel.rotateX(PI/2)
scene.add(wheel);

/// Wheel Support
const geometrySupport = new THREE.CylinderGeometry( 0, 5, 6, 10 );
const materialSupport = new THREE.MeshBasicMaterial( {color: 0xfffff0} );
const support = new THREE.Mesh( geometrySupport, materialSupport );
support.position.z = -27
support.position.x = -9
support.position.y= 3
scene.add(support);


/// Fence

const geometryFence = new THREE.BoxGeometry( 100, 1.5, 1 );
const materialFence = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
const fence = new THREE.Mesh( geometryFence, materialFence );
fence.position.z = -10
scene.add( fence );

/// SpecialEffectsDevices
for(let i = -5; i <=6; i++){
    const geometryDevice = new THREE.BoxGeometry( 0.2, 0.2, 0.3 );
    const materialDevice = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const device = new THREE.Mesh( geometryDevice, materialDevice );
    device.position.z = -2.3
    device.position.y = -0.5
    device.position.x = i * 0.5
    scene.add( device );

}

/// Crowd
let crowdArray = []
let falling = false
for(let i = 0; i <=20; i++){
    const geometryCrowd = new THREE.BoxGeometry( 0.2, 0.2, 0.3 );
    const materialCrowd = new THREE.MeshBasicMaterial( {color: 0xffffff} );
    const crowd = new THREE.Mesh( geometryCrowd, materialCrowd );
    crowd.position.z = Math.random() * (-1.85 - -2.3) + -2.3
    crowd.position.y = -0.9
    crowd.position.x = Math.random() * (3 - -3) + -3;
    crowdArray.push(crowd)
    scene.add( crowd );
}

//objetos importados 3d not working lol
const loader = new GLTFLoader()
console.log(loader)
loader.load( './src/person.glb', function ( gltf ) {
    const model = gltf.scene;
    model.scale.set(1.5,1.5,1.5)
    model.position.set(-6.1,2.4,-10.1);
    //model.rotateY(-Math.PI/2)
    model.isDraggable = true;
    scene.add(model);

}, undefined, function ( error ) {

    console.log( error );
} );

function animate() {
    requestAnimationFrame( animate );
    wheel.rotation.y += 0.01;
    crowdArray.forEach(crowd =>{
        if(crowd.position.y <= -0.89){
            falling = false
        }
        if(crowd.position.y >= -0.7){
            falling = true
        }
        if(falling){
            crowd.position.y -= 0.010
        }else{
            crowd.position.y += 0.010

        }
    })
    renderer.render( scene, camera );
};

animate();
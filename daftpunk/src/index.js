import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three'
import personGlb from './static/assets/person.glb'
import wheelGlb from './static/assets/wheel.glb'
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import woodBaseUrl from './static/textures/woodColor.jpeg'
import woodBaseNorm from './static/textures/woodnormal.jpg'
import metalBaseUrl from './static/textures/metal.jpeg'
import { DoubleSide } from "three";

const scene = new THREE.Scene();
const loader = new GLTFLoader()
const loaderObj = new OBJLoader();
const textureLoader = new THREE.TextureLoader()


//textura madera
const woodBase= textureLoader.load(woodBaseUrl)
const woodNorm= textureLoader.load(woodBaseNorm)

//textura metal
const metalBase= textureLoader.load(metalBaseUrl)

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
const geometryPyramid = new THREE.CylinderGeometry(0, 2, 3.5, 4, 1)
const materialPyramid = new THREE.MeshStandardMaterial({
    map: metalBase,
    normalMap: woodNorm,
    roughness: 0.5,
    side: DoubleSide,
})
const pyramid = new THREE.Mesh(geometryPyramid, materialPyramid);
pyramid.position.z = -7
pyramid.position.x = 0
pyramid.position.y = 1.1
pyramid.rotateY(PI)
scene.add(pyramid);



/// Wheel
let wheel
loader.load( wheelGlb, function ( gltf ) {
    console.log(gltf)
    wheel = gltf.scene
    wheel.position.z = -30
    wheel.position.x = -10
    wheel.position.y= 5
    wheel.scale.set(2, 2, 2)
    wheel.rotateY(0.31)
    scene.add(wheel);
}, undefined, function ( error ) {

    console.error( error );

} );



/// Wheel Support
const geometrySupport = new THREE.CylinderGeometry( 0, 5, 6, 10 );
const materialSupport = new THREE.MeshBasicMaterial( {color: 0xfffff0} );
const support = new THREE.Mesh( geometrySupport, materialSupport );
support.position.z = -27
support.position.x = -9
support.position.y= 3
scene.add(support);


/// Fence

const geometryFence = new THREE.BoxGeometry( 100, 2, 1 );
const  woodMat= new THREE.MeshStandardMaterial({
    map: woodBase,
    normalMap: woodNorm,
    roughness: 0.5,
    side: DoubleSide,
})

const fence = new THREE.Mesh( geometryFence, woodMat );
fence.position.z = -10
scene.add( fence );

/// SpecialEffectsDevices
for(let i = -5; i <=6; i++){
    const geometryDevice = new THREE.BoxGeometry( 0.2, 0.2, 0.3 );
    const materialDevice = new THREE.MeshBasicMaterial( {color: 0x00ff00} );
    const device = new THREE.Mesh( geometryDevice, materialDevice );
    device.position.z = -2.3
    device.position.y = -0.3
    device.position.x = i * 0.5
    scene.add( device );

}

/// Crowd
let crowdArray = []
let falling = false
let personModelArray = []

for(let i = 0; i <=100; i++){
    loader.load( personGlb, function ( gltf ) {
        const personModel = gltf.scene;
        personModel.scale.set(0.002, 0.002, 0.002)
        personModel.rotateY(1.5);
        personModel.isDraggable = true;
        scene.add(personModel);
        console.log('added')
        personModel.position.z = Math.random() * (-1.85 - -2.3) + -2.3
        personModel.position.y = -0.9
        personModel.position.x = Math.random() * (3 - -3) + -3;
        crowdArray.push(personModel)

    }, undefined, function ( error ) {

        console.error( error );

    } );
}




const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.x = 0
pointLight.position.y = 0
pointLight.position.z = 0
scene.add(pointLight)



const spotLight = new THREE.SpotLight( 0xf13123, 1 );
spotLight.position.set( 15, 40, 35 );
spotLight.angle = Math.PI / 3;
spotLight.penumbra = 1;
spotLight.decay = 2;
spotLight.distance = 200;


spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 512;
spotLight.shadow.mapSize.height = 512;
spotLight.shadow.camera.near = 10;
spotLight.shadow.camera.far = 200;
spotLight.shadow.focus = 1;
scene.add( spotLight );


const geometry = new THREE.PlaneGeometry( 100000, 1, 1, 1 );
const material = new THREE.MeshBasicMaterial({color: 0x123123} );
const floor = new THREE.Mesh( geometry, material );
floor.material.side = THREE.DoubleSide;
floor.position.z = -10
floor.position.x = 0
floor.position.y = -4.5
floor.rotation.x = 95;
console.log(floor)
scene.add( floor );




function animate() {
    requestAnimationFrame( animate );
    if(wheel)wheel.rotation.z += 0.01;
    pyramid.rotation.y += 0.001



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

function changeColorSpotlight() {
    let color = new THREE.Color( 0xffffff );
    color.setHex( Math.random() * 0xffffff );
    pointLight.color = color
}
animate();

setInterval(changeColorSpotlight, 2000)

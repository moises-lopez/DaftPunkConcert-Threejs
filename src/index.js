import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three'
import personGlb from './static/assets/person.glb'
import wheelGlb from './static/assets/wheel.glb'
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import woodBaseUrl from './static/textures/woodColor.jpeg'
import woodBaseNorm from './static/textures/woodnormal.jpg'
import metalBaseUrl from './static/textures/metal.jpeg'
import stoneBaseUrl from './static/textures/stoneColor.jpg'
import dirtBaseUrl from './static/textures/dirt.jpg'
import deviceTextureUrl from './static/textures/deviceTexture.jpg'
import wheelSupportTextureUrl from './static/textures/wheelSupportTexture.jpg'
import { DoubleSide } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { TWEEN } from "three/examples/jsm/libs/tween.module.min";
import daftPunkSong from "./static/sounds/daftpunkaudio.mp3";

//inicializar scenas y configuraciones
const scene = new THREE.Scene();
const loader = new GLTFLoader()
const loaderObj = new OBJLoader();
const textureLoader = new THREE.TextureLoader()
const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 2000 );
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//inicializar texturas
const woodBase= textureLoader.load(woodBaseUrl)
const woodNorm= textureLoader.load(woodBaseNorm)
const metalBase= textureLoader.load(metalBaseUrl)
const stoneBase= textureLoader.load(stoneBaseUrl)
const dirtBase= textureLoader.load(dirtBaseUrl)
const deviceTexture= textureLoader.load(deviceTextureUrl)
const wheelSupportTexture= textureLoader.load(wheelSupportTextureUrl)




const PI = 3.14159265359


// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.update();



////// Audio
document.body.addEventListener("click", function () {
    const audio = new Audio(daftPunkSong)
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
const materialSupport = new THREE.MeshStandardMaterial({
    map: wheelSupportTexture,
    normalMap: woodNorm,
    roughness: 0.5,
    side: DoubleSide,
})
const support = new THREE.Mesh( geometrySupport, materialSupport );
support.position.z = -27
support.position.x = -9
support.position.y= 3
scene.add(support);


/// Fence
const geometryFence = new THREE.BoxGeometry( 10, 2, 1 );
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
    const materialDevice = new THREE.MeshStandardMaterial({
        map: deviceTexture,
        normalMap: woodNorm,
        roughness: 0.5,
        side: DoubleSide,
    })
    const device = new THREE.Mesh( geometryDevice, materialDevice );
    device.position.z = -3.7
    device.position.y = -0.3
    device.position.x = i * 0.5
    scene.add( device );
}

//scenario
const geometryStage = new THREE.BoxGeometry( 10, 1.5, 4 );
const materialStage = new THREE.MeshStandardMaterial({
    map: stoneBase,
    normalMap: woodNorm,
    roughness: 0.5,
    side: DoubleSide,
})
const stage = new THREE.Mesh( geometryStage, materialStage );
stage.position.z = -6
stage.position.y = -1.15
stage.position.x = 0
scene.add( stage );



//danceFloor
const geometryDanceFloor = new THREE.BoxGeometry( 10, 1.5, 4 );
const materialDanceFloor = new THREE.MeshStandardMaterial({
    map: dirtBase,
    normalMap: woodNorm,
    roughness: 0.5,
    side: DoubleSide,
})
const danceFloor = new THREE.Mesh( geometryDanceFloor, materialDanceFloor );
danceFloor.position.z = -3
danceFloor.position.y = -1.7
danceFloor.position.x = 0
scene.add( danceFloor );

//danceFloorAux, a este objeto apuntan las luces del dancefloor
const geometryDanceFloorAux = new THREE.BoxGeometry( 2, 0.5, 1 );
const materialDanceFloorAux =  new THREE.MeshBasicMaterial( {color: 0x89ff12} );
const danceFloorAux = new THREE.Mesh( geometryDanceFloorAux, materialDanceFloorAux );
danceFloorAux.position.z = -3.5
danceFloorAux.position.y = -1.7
danceFloorAux.position.x = 0
scene.add( danceFloorAux );

/// Crowd
let crowdArray = []
let falling = false

for(let i = 0; i <=100; i++){
    loader.load( personGlb, function ( gltf ) {
        const personModel = gltf.scene;
        personModel.scale.set(0.002, 0.002, 0.002)
        personModel.rotateY(1.5);
        personModel.isDraggable = true;
        scene.add(personModel);
        personModel.position.z = Math.random() * (-1.85 - -2.3) + -3.4
        personModel.position.y = -0.9
        personModel.position.x = Math.random() * (3 - -3) + -3;
        crowdArray.push(personModel)
    }, undefined, function ( error ) {
        console.error( error );
    } );
}



//Pointlight que sirve como luz de luna que ilumina uniformemente toda la escena
const pointLight = new THREE.PointLight(0xffffff, 0.2)
pointLight.position.x = 0
pointLight.position.y = 0
pointLight.position.z = 0
scene.add(pointLight)


//LUCES


//Spotlights para dancefloor y stage y una para la wheel
const stageSpotLight1 = createSpotlight( 0xFF7F00, pyramid );
const stageSpotLight2 = createSpotlight( 0x00FF7F, pyramid );
const stageSpotLight3 = createSpotlight( 0x7F00FF, pyramid );

const angle = 0.2
const danceFloorSpotLight1 = createSpotlight( 0xFF7F00, danceFloorAux, angle );
const danceFloorSpotLight2 = createSpotlight( 0x00FF7F, danceFloorAux, angle );
const danceFloorSpotLight3 = createSpotlight( 0x7F00FF, danceFloorAux, angle );

const wheelSpotlight = createSpotlight( 0xFFFFFF, support, 0.2 );


scene.add( stageSpotLight1, stageSpotLight2, stageSpotLight3 );
scene.add( danceFloorSpotLight1, danceFloorSpotLight2, danceFloorSpotLight3 );
scene.add( wheelSpotlight );


//Función auxiliar que te devuelve una spotlight creada
function createSpotlight( color, target , angle) {
    const newObj = new THREE.SpotLight( color, 2 );
    newObj.position.set( 2, 2, -2 );
    newObj.scale.set( 0.02, 0.02, 0.02 );
    newObj.rotateX(20)
    newObj.rotateY(2)
    newObj.rotateZ(2)
    newObj.angle = angle ?? 0.02;
    newObj.penumbra = 1;
    newObj.decay = 2;
    newObj.distance = 200;
    newObj.castShadow = true;
    newObj.shadow.mapSize.width = 512;
    newObj.shadow.mapSize.height = 512;
    newObj.shadow.camera.near = 10;
    newObj.shadow.camera.far = 200;
    newObj.shadow.focus = 1;
    newObj.castShadow = true;
    newObj.shadow.focus = 1;
    newObj.target = target;
    return newObj;
}

let movingRight = true

function animateObjects() {
    //Animar rueda de la fortuna girar a la derecha
    if(wheel)wheel.rotation.z += 0.01;

    //Animar piramide girar a la derecha
    pyramid.rotation.y += 0.001

    //Mover objeto de dancefloor auxiliar que apuntan los spotlights
    if(danceFloorAux.position.x >= 1.9) movingRight = false

    if(danceFloorAux.position.x <= -1.9)movingRight = true

    movingRight ? danceFloorAux.position.x += 0.015 : danceFloorAux.position.x -= 0.015


    controls.update();

    //Mover arriba y abajo la audiencia
    crowdArray.forEach(crowd =>{
        if(crowd.position.y <= -0.89) falling = false
        if(crowd.position.y >= -0.7) falling = true
        falling ?  crowd.position.y -= 0.010 : crowd.position.y += 0.010
    })


}

//Función para renderizar la scena y empezar la animación
function render() {
    TWEEN.update();
    animateObjects()
    requestAnimationFrame( render );
    renderer.render( scene, camera );
};




//Función que se encarga de animar las spotlights
function animateSpotlight() {

    tween( stageSpotLight1 );
    tween( stageSpotLight2 );
    tween( stageSpotLight3 );
    tweenDanceFloorLight( danceFloorSpotLight3 );
    tweenDanceFloorLight( danceFloorSpotLight2 );
    tweenDanceFloorLight( danceFloorSpotLight1 );
    setTimeout( animateSpotlight, 2000 );

}

//Función que se encarga de girar las spotlights pero con el mismo target
function tween( light ) {
    new TWEEN.Tween( light ).to( {
        angle: ( Math.random() * 0.4 ) + 0.1,
        penumbra: Math.random() + 1
    }, Math.random() * 3000 + 2000 )
        .easing( TWEEN.Easing.Quadratic.Out ).start();

    new TWEEN.Tween( light.position ).to( {
        x: ( Math.random() * 2 ),
        y: ( Math.random() * 3 ) + 2.5,
        z: ( Math.random() * -3 )
    }, Math.random() * 3000 + 2000 )
        .easing( TWEEN.Easing.Quadratic.Out ).start();

}

//Función que se encarga de girar las spotlights pero con el mismo target (Esta es para las spotlights del dancefloor)

function tweenDanceFloorLight( light ) {
    new TWEEN.Tween( light ).to( {
        angle: ( Math.random() * 0.15 ),
        penumbra: Math.random() + 1
    }, Math.random() * 3000 + 2000 )
        .easing( TWEEN.Easing.Quadratic.Out ).start();

    new TWEEN.Tween( light.position ).to( {
        x: ( Math.random() * 2 ),
        y: ( Math.random() * 3 ) + 2.5,
        z: ( Math.random() * -3 )
    }, Math.random() * 3000 + 2000 )
        .easing( TWEEN.Easing.Quadratic.Out ).start();

}


function animate(){
    animateSpotlight()
}

render();
animate()


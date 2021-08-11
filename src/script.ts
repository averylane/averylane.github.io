import * as THREE from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import gsap from 'gsap'

import React from "react"
import ReactDOM from "react-dom";
import {App} from "./components/App"

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

ReactDOM.render(<App />, document.getElementById("app"))


// ===========================================================
// TEXTURES
// ===========================================================
const textureLoader = new THREE.TextureLoader()
const emberTexture = textureLoader.load('textures/ember.png', undefined, undefined, (err) => {console.log(err)})
const panoTexture = textureLoader.load('textures/city.jpeg', undefined, undefined, (err) => {console.log(err)})


// ===========================================================
// SCENE
// ===========================================================
const scene = new THREE.Scene()


// ===========================================================
// STATIC OBJECTS
// ===========================================================

const embersGeometry = new THREE.BufferGeometry
const emberCount = 2000
const positionArray = new Float32Array(emberCount * 3) //xyz per star
const positionArrayOriginal = new Float32Array(emberCount * 3)
const velocityArray = new Float32Array(emberCount * 3)
for (var i = 0; i < emberCount; i++) {
    positionArray[i * 3] = (Math.random() - 0.5) * 4 + (window.innerWidth / 400)
    positionArray[i * 3 + 1] = (Math.random() - 0.5) * 4 - (window.innerHeight / 200)
    positionArray[i * 3 + 2] = (Math.random() - 0.5) * 3

    positionArrayOriginal[i * 3] = positionArray[i * 3]
    positionArrayOriginal[i * 3 + 1] = positionArray[i * 3 + 1]
    positionArrayOriginal[i * 3 + 2] = positionArray[i * 3 + 2]

    velocityArray[i * 3] = -1 * (Math.random() * 0.004 + 0.006)
    velocityArray[i * 3 + 1] = (Math.random()) * 0.01 + 0.005
    velocityArray[i * 3 + 2] = (Math.random()) * 0.01
}

console.log(positionArray)
embersGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3).setUsage( THREE.DynamicDrawUsage ))
embersGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocityArray, 3))

const panoGeometry = new THREE.SphereBufferGeometry(10, 64, 64)

// const geometry = new THREE.PlaneGeometry( 2*window.innerWidth, 2*window.innerHeight )
const transitionGeometry = new THREE.PlaneGeometry(window.innerWidth /50, window.innerHeight / 50 )


// ===========================================================
// MATERIALS
// ===========================================================

const embersMaterial = new THREE.PointsMaterial({
    size: 0.02,
    map: emberTexture,
    transparent: true
})

const panoMaterial = new THREE.MeshStandardMaterial({
    map: panoTexture,
    side: THREE.BackSide,
    roughness: 1
})

const transitionMaterial = new THREE.MeshBasicMaterial( {
  color: 0x000000,
  // side: THREE.DoubleSide
})


// ===========================================================
// STATIC MESH
// ===========================================================

const embers = new THREE.Points(embersGeometry,embersMaterial)
console.log(embers)
// embers.position.z = 2
scene.add(embers)

const pano = new THREE.Mesh(panoGeometry, panoMaterial)
pano.position.set(0, 0, 2)

const transitionPlane = new THREE.Mesh( transitionGeometry, transitionMaterial )
transitionPlane.position.z = -2
transitionPlane.rotation.z = 0.5


// ===========================================================
// ANIMATED MODEL
// ===========================================================

let mixer: THREE.AnimationMixer
const animationActions: THREE.AnimationAction[] = []
let activeAction: THREE.AnimationAction
let lastAction: THREE.AnimationAction
var mutant: THREE.Object3D
var mutantOffset = -0.9

let modelReady = false

// LOAD FBX FILE WITH EMBEDDED TEXTURES AND ANIMATIONS
const fbxLoader = new FBXLoader()
fbxLoader.load(
    'models/mutant@idle.fbx',
    (object) => {
        mutant = object
        mutant.scale.set(0.012, 0.012, 0.012)
        // console.dir(mutant)
        mutant.position.set(0, mutantOffset, 3)
        mutant.rotation.y = 0.5
        mixer = new THREE.AnimationMixer(mutant)

        const animationAction = mixer.clipAction(
            (mutant as THREE.Object3D).animations[0]
        )
        animationActions.push(animationAction)
        activeAction = animationActions[0]

        scene.add(mutant)

        activeAction.play()

        gsap.to(mutant.position, {z: 0, duration: 2})

        modelReady = true
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)


// ===========================================================
// Lights
// ===========================================================
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xff9900, 1);
hemisphereLight.position.set(2, 1, 0)
hemisphereLight.intensity = 0.8;
scene.add(hemisphereLight)

const directionalLight = new THREE.DirectionalLight(0xd7cc99, 2)
directionalLight.position.set(4.2, 1.5, 1.6)
directionalLight.intensity = 2.9
scene.add(directionalLight)

const pointLight = new THREE.PointLight(0xff9900, 2)
directionalLight.position.set(2, -2, 1.6)
directionalLight.intensity = 2.9
scene.add(directionalLight)


// ===========================================================
// RESIZE
// ===========================================================
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


// ===========================================================
// Camera
// ===========================================================

// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)


// ===========================================================
//Renderer
// ===========================================================
const renderer = new THREE.WebGLRenderer()
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
// renderer.sortObjects = false
document.body.appendChild( renderer.domElement );


// ===========================================================
//Animate
// ===========================================================

var mouse = {
    x: innerWidth/2,
    y: innerHeight/2
}

var expectedPos = {
    x: -0.0002 * (mouse.x - innerWidth/2),
    y: 0.0002 * (mouse.y - innerHeight/2)
}

var realPos = {
    x: embers.position.x,
    y: embers.position.y
}

addEventListener('mousemove', (e) => {
    mouse.x = e.x
    mouse.y = e.y
    expectedPos.x = -0.0002 * (mouse.x - innerWidth/2)
    expectedPos.y = 0.0002 * (mouse.y - innerHeight/2)
})

var bounceX = 0;
var rotateStars = 0

var panoInit = false
var panoRotate = 0

const clock = new THREE.Clock()

console.log(camera.getFilmWidth() / camera.getFilmHeight())
console.log(sizes.width / sizes.height)

const tick = () => {

    // ================================================================
    // PRE RENDER CHANGES
    // ================================================================

    // --------------------------------------
    // 360 SECTION
    // --------------------------------------

    // ENTER 360
    if (window.current === '360d' && panoInit === false) {
        panoInit = true
        scene.add(transitionPlane)

        gsap.to(null, {duration: 0.25, onComplete: ()=>{
            scene.add(pano)
            gsap.to(transitionPlane.position, {y: window.innerHeight/25, duration: 1,})
        }})
    // EXIT 360
    } else if (window.current !== '360d' && panoInit === true) {
        panoInit = false

        gsap.to(transitionPlane.position, {y: 0, duration: 0.5, onComplete: ()=>{
            scene.remove(pano)
            scene.remove(transitionPlane)
        }})
        gsap.to(camera.rotation, {x: 0, y: 0, z: 0, duration: 0.5})
    }


    // ================================================================
    // RENDER
    // ================================================================

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
    if (modelReady) mixer.update(clock.getDelta())


    // ================================================================
    // POST RENDER CHANGES
    // ================================================================

    // --------------------------------------
    // MOUSE MOVE ANIMATION
    // --------------------------------------

    // DISTANCE FOR MODEL TO TRAVEL FROM CURRENT TO EXPECTED
    var distanceX = (realPos.x - expectedPos.x)
    var distanceY = (realPos.y - expectedPos.y)
    var distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

    // SLOWLY MOVE MODEL TO EXPECTED
    if ( distance > 0.001) {
        var angle = Math.atan2(distanceY, distanceX)
        realPos.x -= distance ** 2 * Math.cos(angle)
        realPos.y -= distance ** 2 * Math.sin(angle)
    }

    // SET MODELS TO UPDATED POSITIONS
    // BOUNCE MODEL OVER TIME
    if (mutant) {
        mutant.position.x = realPos.x
        mutant.position.y = realPos.y + 0.05 * Math.sin(bounceX) + mutantOffset
        bounceX += .035
    }

    for (var i = 0; i < emberCount; i++){
      positionArray[i * 3] += velocityArray[i * 3]

      // console.log(positionArray[i*3])
      // if (positionArray[i * 3] < -1 * window.innerWidth / 200) positionArray[i * 3] = positionArrayOriginal[i * 3]
      positionArray[i * 3 + 1] += velocityArray[i * 3 + 1]

      positionArray[i * 3 + 2] += velocityArray[i * 3 + 2]
      if (positionArray[i * 3] < (-1 * camera.fov / camera.getFilmWidth()) ||
          positionArray[i * 3 + 1] > ( camera.fov / camera.getFilmHeight()) ||
          positionArray[i * 3 + 2] > (camera.fov / camera.getFilmWidth() + 2)) {
            positionArray[i * 3] = positionArrayOriginal[i * 3]
            positionArray[i * 3 + 1] = positionArrayOriginal[i * 3 + 1]
            positionArray[i * 3 + 2] = positionArrayOriginal[i * 3 + 2]
          }
    }
    embers.geometry.attributes.position.needsUpdate = true;
    // console.log(stars)
    // stars.position.x =  realPos.x
    // stars.position.y = realPos.y
    // stars.rotation.y = rotateStars
    // rotateStars += 0.0005


    // --------------------------------------
    // 360 SECTION
    // --------------------------------------

    if (window.current === '360d') {
        panoRotate += 0.001
        panoRotate = panoRotate % (2 * Math.PI)
        camera.rotation.y = -1 * panoRotate
    } else {
        panoRotate = 0
    }
}
tick()
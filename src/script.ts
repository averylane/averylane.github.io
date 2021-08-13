import * as THREE from "three";
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
import { TGALoader } from 'three/examples/jsm/loaders/TGALoader'
import gsap from 'gsap'

import React from "react"
import ReactDOM from "react-dom";
import {App} from "./components/App"
import { Vector2 } from "three";

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
}

ReactDOM.render(<App />, document.getElementById("app"))


// ===========================================================
// TEXTURES
// ===========================================================
const textureLoader = new THREE.TextureLoader()
const emberTexture = textureLoader.load('assets/textures/ember.png', undefined, undefined, (err) => {console.log(err)})
const panoTexture = textureLoader.load('assets/textures/NY+FireEscape.preview.jpg', undefined, undefined, (err) => {console.log(err)})
const filterTexture_disguise = textureLoader.load('assets/images/filter_disguise.png', undefined, undefined, (err) => {console.log(err)})
const filterTexture_eyes = textureLoader.load('assets/images/filter_eyes.png', undefined, undefined, (err) => {console.log(err)})
const filterTexture_funglasses = textureLoader.load('assets/images/filter_funglasses.png', undefined, undefined, (err) => {console.log(err)})


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

embersGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3).setUsage( THREE.DynamicDrawUsage ))
embersGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocityArray, 3))

const panoGeometry = new THREE.SphereBufferGeometry(10, 64, 64)

const transitionGeometry = new THREE.PlaneGeometry(50, window.innerHeight / 50 )

const filterGeometry = new THREE.PlaneGeometry(0.25, 0.25)


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
})

const filterMaterial = new THREE.MeshBasicMaterial({
    map: filterTexture_disguise,
    transparent: true
    // color: 0xffff00
})


// ===========================================================
// STATIC MESH
// ===========================================================

const embers = new THREE.Points(embersGeometry,embersMaterial)
embers.position.z = 1
scene.add(embers)

const pano = new THREE.Mesh(panoGeometry, panoMaterial)
pano.position.set(0, 0, 2)
pano.rotation.y = 2

const transitionPlane = new THREE.Mesh(transitionGeometry, transitionMaterial)
transitionPlane.position.z = -2
transitionPlane.rotation.z = 0.5

const filter = new THREE.Mesh(filterGeometry, filterMaterial)
const filterPos = 0.08
filter.position.x = 0.02
filter.position.z = 1.5
filter.position.y = filterPos
filter.rotation.z = -0.15
// scene.add(filter)


// ===========================================================
// ANIMATED MODEL
// ===========================================================

let mixer: THREE.AnimationMixer
let mixer2: THREE.AnimationMixer
const animationActions: THREE.AnimationAction[] = []
let activeAction: THREE.AnimationAction
let lastAction: THREE.AnimationAction
var model: THREE.Object3D
var model1: THREE.Object3D
var model2: THREE.Object3D
var modelOffset = -0.2

let modelReady = false

// LOAD FBX FILE WITH EMBEDDED TEXTURES AND ANIMATIONS
const fbxLoader = new FBXLoader()
const tgaLoader = new TGALoader()

const texture = textureLoader.load('assets/textures/dragon_map.jpg')
const normalTexture = textureLoader.load('assets/textures/dragon_normal.jpg')
const emissiveTexture = textureLoader.load('assets/textures/dragon_emissive.jpg')
const otherTexture = textureLoader.load('assets/textures/dragon_occlusion_roughness_metallic.jpg')
fbxLoader.load(
    'assets/models/dragon.fbx',
    // 'models/mutant@idle.fbx',
    (object) => {
        model1 = object
        model = model1
        model.traverse( function ( child ) {
            if ( child.isMesh ) {
                child.material.map = texture; // assign your diffuse texture here
                child.material.normalMap = normalTexture
                child.material.emissiveMap = emissiveTexture
                child.material.metalnessMap = otherTexture

                if (child.type = "SkinnedMesh") {
                    modelReady = true
                }
            }

        } );
        model.scale.set(0.002, 0.002, 0.002)
        model.position.set(0, -5, 0)
        realPos.x = 0
        realPos.y = modelOffset
        model.rotation.x = 1.5 * Math.PI
        // model.scale.set(0.01, 0.01, 0.01)
        // model.position.set(0, -4, 0)
        // console.log(model)
        mixer = new THREE.AnimationMixer(model)

        const animationAction = mixer.clipAction((model).animations[0])
        animationActions.push(animationAction)
        activeAction = animationActions[0]

        scene.add(model)

        activeAction.play()
        gsap.to(model.position, {y: modelOffset, duration: 2, onComplete: () => {heroInit = true}})
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log(error)
    }
)

// add an animation from another file
// fbxLoader.load('models/dragon_FlyStationarySpreadFire.fbx',
//     (object) => {


//         model2 = object
//         model2.traverse( function ( child ) {
//             if ( child.isMesh ) {
//                 child.material.map = texture; // assign your diffuse texture here
//                 child.material.normalMap = normalTexture
//                 child.material.emissiveMap = emissiveTexture
//                 child.material.metalnessMap = otherTexture

//                 child.material.normalScale = new Vector2(2, 2)

//                 if (child.type = "SkinnedMesh") {
//                     modelReady = true
//                 }
//             }

//         } );
//         model2.scale.set(0.002, 0.002, 0.002)
//         model2.position.set(0, modelOffset, 0)
//         model2.rotation.x = 1.5 * Math.PI
//         mixer2 = new THREE.AnimationMixer(model2)

//         const animationAction = mixer2.clipAction((model2).animations[0])
//         animationActions.push(animationAction)
//         var activeAction2 = animationAction

//         scene.add(model2)

//         activeAction2.play()
//     },
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total * 100) + '% loaded')
//     },
//     (error) => {
//         console.log(error)
//     }
// )

// ===========================================================
// Lights
// ===========================================================
const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xff9900, 1);
hemisphereLight.position.set(2, 1, 0)
hemisphereLight.intensity = 0.5;
scene.add(hemisphereLight)

const directionalLight = new THREE.DirectionalLight(0xd7cc99, 2)
directionalLight.position.set(4.2, 1.5, 1.6)
directionalLight.intensity = 0.5
scene.add(directionalLight)

const pointLight = new THREE.PointLight(0xff9900, 2)
pointLight.position.set(2, -2, 1.6)
pointLight.intensity = 1
scene.add(pointLight)


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
// Renderer
// ===========================================================
const renderer = new THREE.WebGLRenderer({ alpha: true })
renderer.setSize( window.innerWidth, window.innerHeight )
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
document.body.appendChild( renderer.domElement )


// ===========================================================
// Animate
// ===========================================================

// --------------------------------------
// MOUSEMOVE
// --------------------------------------

var mouse = {
    x: innerWidth/2,
    y: innerHeight/2
}

var expectedPos = {
    x: 0,
    y: 0
}

var realPos = {
    x: 0,
    y: 0
}

addEventListener('mousemove', (e) => {
    mouse.x = e.x
    mouse.y = e.y
    expectedPos.x = -0.0003 * (mouse.x - innerWidth/2)
    expectedPos.y = 0.0003 * (mouse.y - innerHeight/2)
})


// --------------------------------------
// LIGHT FLICKER
// --------------------------------------

var flickerSpeeds = []

for (var i = 0; i < 1000; i++) {
    flickerSpeeds.push((Math.random() * 0.5) + 0.2)
}

var flickerIndex = 0
var previousFlickerIndex = -1

// --------------------------------------
// SECTION FLAGS
// --------------------------------------
var heroInit = false
var twoDInit = false
var panoInit = false
var panoRotate = 0
var filtInit = false
var modelFilterPos = -0.6
var filtX = 0
var filtBounce = false
var wait = {}

const clock = new THREE.Clock()


// --------------------------------------
// FUNCTION
// --------------------------------------
const tick = () => {

    // ================================================================
    // PRE RENDER CHANGES
    // ================================================================

    if (modelReady) {

        // --------------------------------------
        // HERO
        // --------------------------------------

        // AT HERO (AFTER ENTER)
        if (window.current === 'hero' && heroInit) {
            if (model.position.x !== realPos.x) {
                model.position.x = realPos.x
            }

            if (model.position.y !== realPos.y + modelOffset) {
                model.position.y = realPos.y + modelOffset
            }

            if (model.position.z !== 0) {
                model.position.z = 0
            }

            if (model.rotation.z !== 0) {
                model.rotation.z = 0
            }

            if (model.scale.x !== 0.002 || model.scale.y !== 0.002 || model.scale.z !== 0.002) {
                model.scale.set(0.002, 0.002, 0.002)
            }
        }

        // EXIT HERO
        if (window.current !== 'hero' && heroInit) {
            heroInit = false
        }

        // --------------------------------------
        // 2D SECTION
        // --------------------------------------

        // ENTER 2D FIGHT
        if (window.current === 'anim' && twoDInit === false) {
            twoDInit = true


            gsap.to(wait, {duration: 0.2, onComplete: () => {
                if (window.current === 'anim') {

                    // BRING 2D FIGHTER INTO VIEW
                    gsap.to("#twoDFighter", {opacity: 1, transform: 'scale(1)', duration: 0.3})

                    // GET 3D MODEL INTO FIGHTING POSITION
                    var duration = 1
                    gsap.to(model.position, { x: 2, y: modelOffset - 0.5, z: 0.5, duration})
                    gsap.to(model.rotation, { z: Math.PI * -0.5, duration})
                    gsap.to(model.scale, {x: 0.004, y: 0.004, z: 0.004, duration})
                }
            }})

        // EXIT 2D FIGHT
        } else if (window.current !== 'anim' && twoDInit === true){

            // REMOVE 2D FIGHTER FROM VIEW
            gsap.to("#twoDFighter", {opacity: 0, duration: 0.5, onComplete: () => {
                gsap.to("#twoDFighter", {transform: 'scale(5)', duration: 0.01})
            }})

            // GET 3D MODEL BACK INTO IDLE POSITION
            if (window.current === 'hero'){
                gsap.to(model.position, { x: realPos.x, y: realPos.y + modelOffset, z: 0, onComplete: () => {
                    twoDInit = false
                    heroInit = true
                }})
            } else {
                gsap.to(model.position, { x: 0, y: modelOffset, z: 0, onComplete: () => {
                    twoDInit = false
                }})
            }
            gsap.to(model.rotation, { z: 0})
            gsap.to(model.scale, {x: 0.002, y: 0.002, z: 0.002 })
        }


        // --------------------------------------
        // 360 SECTION
        // --------------------------------------

        // ENTER 360
        if (window.current === '360d' && panoInit === false) {
            // panoInit = true

            // BLACK TRANSITION PLANE TO BRING 360 IMAGE INTO VIEW

            // TRANSITION AFTER 0.5 SECONDS
            gsap.to(wait, {duration: 0.5, onComplete: ()=>{
                scene.add(transitionPlane)
                if (window.current === '360d') {
                    panoInit = true
                    scene.add(pano)
                    gsap.to(transitionPlane.position, {y: window.innerHeight/25, duration: 1,})
                } else if (window.current === 'anim') {
                    scene.remove(transitionPlane)
                }
            }})

        // EXIT 360
        } else if (window.current !== '360d' && panoInit === true) {
            panoInit = false

            // TRANSITION BACK TO NORMAL
            gsap.to(transitionPlane.position, {y: 0, duration: 0.5, onComplete: ()=>{
                scene.remove(pano)
                scene.remove(transitionPlane)
            }})

            // RESET CAMERA
            gsap.to(camera.rotation, {x: 0, y: 0, z: 0, duration: 0.5})
        }

        // AT HERO (AFTER ENTER)
        if (window.current === '360d' && panoInit) {
            if (model.position.x !== 0) {
                model.position.x = 0
            }

            if (model.position.y !== modelOffset) {
                model.position.y = modelOffset
            }

            if (model.position.z !== 0) {
                model.position.z = 0
            }

            if (model.rotation.z !== 0) {
                model.rotation.z = 0
            }

            if (model.scale.x !== 0.002 || model.scale.y !== 0.002 || model.scale.z !== 0.002) {
                model.scale.set(0.002, 0.002, 0.002)
            }
        }

        // --------------------------------------
        // FILTERING
        // --------------------------------------

        // ENTER FILTERING
        if (window.current === 'filt' && filtInit === false) {
            filtInit = true

            gsap.to(wait, {duration: 0.2, onComplete: () => {
                if (window.current === 'filt') {

                    var duration = 1
                    activeAction.fadeOut(duration)

                    // GET 3D MODEL INTO FIGHTING POSITION
                    gsap.to(model.position, { x: 0, y: modelFilterPos, duration})
                    gsap.to(model.rotation, { x: 1.5 * Math.PI + 0.2, y: 0.15, z: -0.1, duration})
                    gsap.to(model.scale, {x: 0.003, y: 0.003, z: 0.003, duration, onComplete: () => {
                        if (window.current === 'filt') {

                            scene.add(filter)
                            filtBounce = true
                        }
                    }})
                }
            }})

        // EXIT FILTERING
        } else if (window.current !== 'filt' && filtInit === true) {

            scene.remove(filter)
            filtBounce = false
            filtInit = false
            var duration = 1
            activeAction.reset()
            activeAction.fadeIn(0.5)
            activeAction.play()

            gsap.to(model.position, { x: realPos.x, y: realPos.y + modelOffset, duration})
            gsap.to(model.rotation, { x: 1.5 * Math.PI, y: 0, z: 0, duration})
            gsap.to(model.scale, {x: 0.002, y: 0.002, z: 0.002, duration, onComplete: () => {
                // filtInit = false
            }})
        }
    }

    // ================================================================
    // RENDER
    // ================================================================

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
    if (modelReady) {
        mixer.update(clock.getDelta())
        // mixer2.update(clock.getDelta())
    }


    // ================================================================
    // POST RENDER CHANGES
    // ================================================================

    if (modelReady) {

        // --------------------------------------
        // MOUSE MOVE ANIMATION
        // --------------------------------------

        // DISTANCE FOR MODEL TO TRAVEL FROM CURRENT TO EXPECTED
        if (true) {
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
            if (model && !twoDInit && !panoInit && !filtInit) {
                model.position.x = realPos.x
                model.position.y = realPos.y + modelOffset
            }

        }

        // --------------------------------------
        // LIGHT FLICKER
        // --------------------------------------

        if (flickerIndex !== previousFlickerIndex) {
            previousFlickerIndex = flickerIndex
            gsap.to(pointLight, {intensity: (flickerIndex % 2 === 0 ? Math.random() * 0.5 + 0.5 : Math.random() * 0.5), duration: flickerSpeeds[flickerIndex], onComplete: () => {
                flickerIndex++
                if (flickerIndex === 1000) flickerIndex = 0
            }})
        }

        // --------------------------------------
        // EMBER PARTICLES
        // --------------------------------------

        for (var i = 0; i < emberCount; i++){

            // MOVE EMBERS
            positionArray[i * 3] += velocityArray[i * 3]
            positionArray[i * 3 + 1] += velocityArray[i * 3 + 1]
            positionArray[i * 3 + 2] += velocityArray[i * 3 + 2]

            // IF EMBERS GO OUT OF BOUNDS
            if (positionArray[i * 3] < (-1 * camera.fov / camera.getFilmWidth())
                || positionArray[i * 3 + 1] > ( camera.fov / camera.getFilmHeight())
            ) {
                // RESET TO ORIGINAL POINT
                positionArray[i * 3] = positionArrayOriginal[i * 3]
                positionArray[i * 3 + 1] = positionArrayOriginal[i * 3 + 1]
                positionArray[i * 3 + 2] = positionArrayOriginal[i * 3 + 2]
                }
        }
        embers.geometry.attributes.position.needsUpdate = true;

        // --------------------------------------
        // 360 SECTION
        // --------------------------------------

        if (window.current === '360d' && panoInit) {
            panoRotate += 0.003
            panoRotate = panoRotate % (2 * Math.PI)
            camera.rotation.y = -1 * panoRotate
        } else {
            panoRotate = 0
        }

        // --------------------------------------
        // FILTERING
        // --------------------------------------

        if (window.current === 'filt' && filtBounce) {
            model.position.y = 0.05 * Math.sin(filtX) + modelFilterPos
            filter.position.y = 0.05 * Math.sin(filtX) + filterPos
            filtX += 0.05
            if (window.currentFilter === 'eyes') {
                filter.material.map = filterTexture_eyes
            } else if (window.currentFilter === 'funglasses'){
                filter.material.map = filterTexture_funglasses
            } else {
                filter.material.map = filterTexture_disguise
            }
            filter.material.map.needsUpdate = true
        }
    }
}
tick()

const setAction = (toAction) => {
    // console.dir(toAction)
    if (toAction != activeAction) {
        // console.log('dif')
        lastAction = activeAction
        activeAction = toAction
        lastAction.stop()
        lastAction.fadeOut(1)
        activeAction.reset()
        activeAction.fadeIn(1)
        activeAction.play()
        // model.scale.set(0.002, 0.002, 0.002)
    }
}
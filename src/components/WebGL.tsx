import React, {useEffect} from "react"
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const WebGL = (props) => {
  useEffect(() => {

    // ===========================================================
    // TEXTURES
    // ===========================================================
    const textureLoader = new THREE.TextureLoader()
    const earthTexture = textureLoader.load('textures/earthmap4k.jpg', undefined, undefined, (err) => {console.log(err)})
    const earthBump = textureLoader.load('textures/earthbump4k.jpg', undefined, undefined, (err) => {console.log(err)})
    const starTexture = textureLoader.load('textures/fourpointstar.png', undefined, undefined, (err) => {console.log(err)})
    const panoTexture = textureLoader.load('textures/space.jpeg', undefined, undefined, (err) => {console.log(err)})


    // ===========================================================
    // DEBUG
    // ===========================================================
    // const gui = new dat.GUI()


    // ===========================================================
    // SCENE
    // ===========================================================
    const scene = new THREE.Scene()


    // ===========================================================
    // OBJECTS
    // ===========================================================
    const earthGeometry = new THREE.SphereBufferGeometry(0.5, 64, 64)
    // earthGeometry.translate(0, 0, -2)

    const starsGeometry = new THREE.BufferGeometry
    const starCount = 2000
    const positionArray = new Float32Array(starCount * 3) //xyz per star
    for (var i = 0; i < starCount * 3; i++) {
        positionArray[i] = (Math.random() - 0.5) * 4
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))

    const panoGeometry = new THREE.SphereBufferGeometry(5, 64, 64)

    // ===========================================================
    // MATERIALS
    // ===========================================================
    const earthMaterial = new THREE.MeshStandardMaterial({
      // color: 0x00fff0,
      roughness: 0.2,
      map: earthTexture,
      bumpMap: earthBump,
      bumpScale: 1
    })

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.015,
      map: starTexture,
      transparent: true
    })

    const panoMaterial = new THREE.MeshStandardMaterial({
      map: panoTexture,
      side: THREE.BackSide,
      roughness: 1,
      transparent: true,
      opacity: 0
  })

    // ===========================================================
    // MESH
    // ===========================================================
    const earth = new THREE.Mesh(earthGeometry,earthMaterial)
    const stars = new THREE.Points(starsGeometry,starsMaterial)
    const pano = new THREE.Mesh(panoGeometry, panoMaterial)

    // earth.position.set(0, 0, 2)
    pano.position.set(0, 0, 2)
    // stars.position.set(0, 0, 2)

    scene.add(earth)
    scene.add(stars)





    // ===========================================================
    // Lights
    // ===========================================================
    const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
    hemisphereLight.position.set(2, 1, 0)
    hemisphereLight.intensity = 0.8;
    scene.add(hemisphereLight)

    const directionalLight = new THREE.DirectionalLight(0xd7cc99, 2)
    directionalLight.position.set(4.2, 1.5, 1.6)
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



    // addEventListener('scroll', () => {
      // rotate += 0.001
      // var newY = window.scrollY
      // stars.rotation.y = newY * 0.001
      // earth.rotation.y = newY * 0.001
      // pano.rotation.y = newY * 0.001
    // });

    var mouse = {
      x: innerWidth/2,
      y: innerHeight/2
    }

    var expected = {
      x: -0.0002 * (mouse.x - innerWidth/2),
      y: 0.0002 * (mouse.y - innerHeight/2)
    }

    var real = {
      x: earth.position.x,
      y: earth.position.y
    }

    addEventListener('mousemove', (e) => {
      mouse.x = e.x
      mouse.y = e.y
      expected.x = -0.0002 * (mouse.x - innerWidth/2)
      expected.y = 0.0002 * (mouse.y - innerHeight/2)
    })

    var timeX = 0;

    var rotatePano = 0
    var rotateEarth = 0

    var panoInit = false
    var panoOpacity = 0

    const tick = () => {


    // ================================================================
    // PRE RENDER CHANGES
    // ================================================================

      // --------------------------------------
      // 360 SECTOIN
      // --------------------------------------

      // ENTER 360
      if (window.current === '360d' && panoInit === false) {
        scene.add(pano)
        panoInit = true
        // const controls = new OrbitControls(camera, renderer.domElement)
        // controls.enableDamping = true
        // controls.target.set(0, 0, 0)

      } else if (window.current === '360d' && panoInit === true) {
        if (panoOpacity < 1) {
          panoOpacity += 0.02
          pano.material.opacity = panoOpacity
        } else {
          pano.material.transparent = false
        }
      }

      // EXIT 360
      else {
        panoInit = false

        // FADE OUT 360 PHOTO
        if (panoOpacity > 0) {
          panoOpacity -= 0.05
          pano.material.opacity = panoOpacity
          pano.material.transparent = true

          if (panoOpacity <= 0) {
            scene.remove(pano)
          }
        }

        // RESET CAMERA TO ORIGIN SLOWLY
        if (Math.abs(camera.rotation.y) > 0.001) {
          camera.rotation.y += Math.abs(camera.rotation.y) * 0.06
        } else if (Math.abs(camera.rotation.y) > 0) {
          camera.rotation.y = 0
        }
      }


    // ================================================================
    // RENDER
    // ================================================================

      renderer.render(scene, camera)
      window.requestAnimationFrame(tick)


    // ================================================================
    // POST RENDER CHANGES
    // ================================================================


      // --------------------------------------
      // MOUSE MOVE ANIMATION
      // --------------------------------------

      // DISTANCE FOR MODEL TO TRAVEL FROM CURRENT TO EXPECTED
      var distanceX = (real.x - expected.x)
      var distanceY = (real.y - expected.y)
      var distance = Math.sqrt(distanceX ** 2 + distanceY ** 2)

      // SLOWLY MOVE MODEL TO EXPECTED
      if ( distance > 0.001) {
        var angle = Math.atan2(distanceY, distanceX)
        real.x -= distance ** 2 * Math.cos(angle)
        real.y -= distance ** 2 * Math.sin(angle)
      }

      // SET MODELS TO UPDATED POSITIONS
      // BOUNCE MODEL OVER TIME
      earth.position.x = real.x
      earth.position.y = real.y + 0.04 * Math.sin(timeX)

      stars.position.x =  real.x
      stars.position.y = real.y
      timeX += .035 // bounce variable


      // --------------------------------------
      // AUTOMATIC ANIMATION
      // --------------------------------------
      rotateEarth += 0.002
      rotateEarth = rotateEarth % (2 * Math.PI)
      earth.rotation.y = rotateEarth


      // --------------------------------------
      // 360 SECTION
      // --------------------------------------

      if (window.current === '360d') {
        rotatePano += 0.002
        rotatePano = rotatePano % (2 * Math.PI)
        // stars.rotation.y = rotate
        // earth.rotation.y = rotate
        // pano.rotation.y = rotate
        camera.rotation.y = -1 * rotatePano
      } else {
        rotatePano = 0
      }

    }
    tick()
  }, [])

  return (
    <></>
  )
}

export default WebGL
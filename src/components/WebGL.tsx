import React, {useEffect} from "react"
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const WebGL = (props) => {
  useEffect(() => {
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

    const starsGeometry = new THREE.BufferGeometry
    const starCount = 200
    const positionArray = new Float32Array(starCount * 3) //xyz per star
    for (var i = 0; i < starCount * 3; i++) {
        positionArray[i] = (Math.random() - 0.5) * 4
    }
    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3))


    // ===========================================================
    // MATERIALS
    // ===========================================================
    const earthMaterial = new THREE.MeshStandardMaterial({
      color: 0x00ff00
    })

    const starsMaterial = new THREE.PointsMaterial({
      size: 0.015,
      color: 0xffffff
    })


    // ===========================================================
    // MESH
    // ===========================================================
    const earth = new THREE.Mesh(earthGeometry,earthMaterial)
    const stars = new THREE.Points(starsGeometry,starsMaterial)
    scene.add(earth)
    // scene.add(cloud)
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
    document.body.appendChild( renderer.domElement );


    // ===========================================================
    //Animate
    // ===========================================================

    window.addEventListener('scroll', updateSphere);

    function updateSphere(e) {
      earth.rotation.y = window.scrollY * 0.004
      stars.rotation.y = window.scrollY * 0.001
    }

    const tick = () => {
      renderer.render(scene, camera)
      window.requestAnimationFrame(tick)
    }
    tick()
  }, [])

  return (
    <></>
  )
}

export default WebGL
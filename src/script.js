import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { ZeroCurvatureEnding } from 'three'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()

/**
 * Fog
 */
 const fog = new THREE.Fog('#262837', 1, 12)
scene.fog = fog

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

//Floor Textures 
const colorGrassTextures = textureLoader.load('/textures/grass/color.jpg')
const normalGrassTextures = textureLoader.load('/textures/grass/normal.jpg')
const aoGrassTextures = textureLoader.load('/textures/grass/ambientOcclusion.jpg')
const roughnessGrassTextures = textureLoader.load('/textures/grass/roughness.jpg')

//--- ENABLE REPEATING OF TEXTURES START -- //
colorGrassTextures.wrapS = THREE.RepeatWrapping
normalGrassTextures.wrapS = THREE.RepeatWrapping
aoGrassTextures.wrapS = THREE.RepeatWrapping
roughnessGrassTextures.wrapS = THREE.RepeatWrapping

colorGrassTextures.wrapT = THREE.RepeatWrapping
normalGrassTextures.wrapT = THREE.RepeatWrapping
aoGrassTextures.wrapT = THREE.RepeatWrapping
roughnessGrassTextures.wrapT = THREE.RepeatWrapping
//--- ENABLE REPEATING OF TEXTURES FINISH -- //

colorGrassTextures.repeat.set(8, 8)
normalGrassTextures.repeat.set(8, 8)
aoGrassTextures.repeat.set(8, 8)
roughnessGrassTextures.repeat.set(8, 8)


//Bricks Textures
const aoBricksTextures = textureLoader.load('/textures/bricks/ambientOcclusion.jpg')
const colorBricksTextures = textureLoader.load('/textures/bricks/color.jpg')
const normalBricksTextures = textureLoader.load('/textures/bricks/normal.jpg')
const roughnessBricksTextures = textureLoader.load('/textures/bricks/roughness.jpg')

//Door Textures
const alphaDoorTextures = textureLoader.load('/textures/door/alpha.jpg')
const aoDoorTextures = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const colorDoorTextures = textureLoader.load('/textures/door/color.jpg')
const heightDoorTextures = textureLoader.load('/textures/door/height.jpg')
const metalnessDoorTextures = textureLoader.load('/textures/door/metalness.jpg')
const normalDoorTextures = textureLoader.load('/textures/door/normal.jpg')
const roughnessDoorTextures = textureLoader.load('/textures/door/roughness.jpg')

/**
 * House
 */

//Group
const house = new THREE.Group()
scene.add(house)

//Walls
const walls = new THREE.Mesh(
    new THREE.BoxBufferGeometry(4, 2.5, 4),
    new THREE.MeshStandardMaterial({
        color: '#ac8382',
        map: colorBricksTextures,
        metalness: 0.1,
        roughness: 0.9,
        aoMap: aoBricksTextures,
        aoMapIntensity: 1,
        normalMap: normalBricksTextures,
        roughnessMap: roughnessBricksTextures
    })
)

walls.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2))


walls.position.y = 2.5 / 2
walls.castShadow = true
walls.receiveShadow = true

const roof = new THREE.Mesh(
    new THREE.ConeBufferGeometry(3.2, 1.5, 4),
    new THREE.MeshStandardMaterial({ 
        color: '#b35f45',
    })
)

roof.position.y = 2.5 + 0.7
roof.rotation.y = Math.PI * 0.25


//Door

const door = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(2, 2, 100, 100),
    new THREE.MeshStandardMaterial({ 
        map: colorDoorTextures,
        metalness: 0,
        roughness: 1,
        aoMap: aoDoorTextures,
        aoMapIntensity: 1,
        displacementMap: heightDoorTextures,
        displacementScale: 0.1,
        metalnessMap: metalnessDoorTextures,
        roughnessMap: roughnessDoorTextures,
        normalMap: normalDoorTextures,
        transparent: true,
        alphaMap: alphaDoorTextures
    })
)

door.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2))



door.position.y = 1
door.position.z = 2 + 0.01

house.add(walls, roof, door)

//Bushes
const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ 
    color: '#89c854',
    map: colorGrassTextures,
})

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)
bush1.castShadow = true

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)
bush2.castShadow = true

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)
bush3.castShadow = true

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)
bush4.castShadow = true

house.add(bush1, bush2, bush3, bush4)

//Graves
const graves = new THREE.Group()
scene.add(graves)

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({color: '#b2b6b1'})

for(let i = 0; i < 50; i++) {
    const angle = Math.random() * Math.PI * 2 //Making round circle ass place for graves
    const radius = 4 + Math.random() * 5 //How fat circle will be

    const x = Math.sin(angle) * radius //x coordinates
    const z = Math.cos(angle) * radius //z coordinates
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)

    grave.position.set(x, 0.3, z)

    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4

    grave.castShadow = true
    grave.receiveShadow = true


    graves.add(grave)
}


const floorMaterial = new THREE.MeshStandardMaterial({
    map: colorGrassTextures,
    metalness: 0.1,
    roughness: 0.9,
    aoMap: aoGrassTextures,
    aoMapIntensity: 1,
    normalMap: normalGrassTextures,
    roughnessMap: roughnessGrassTextures

})

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    floorMaterial
)
floor.rotation.x = - Math.PI * 0.5
floor.position.y = 0
floor.receiveShadow = true

floor.geometry.setAttribute('uv2', new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2))
scene.add(floor)

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12)
moonLight.position.set(4, 5, - 2)
moonLight.castShadow = true
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight)

//Door Light
const doorLight = new THREE.PointLight('#ff7d46', 1, 5)
doorLight.position.set(0, 2.2, 2.7)
doorLight.castShadow = true

doorLight.shadow.mapSize.width = 256
doorLight.shadow.mapSize.height = 256

house.add(doorLight)


 /**
  * Ghost
  */
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3)
ghost1.position.set(4, 1, 1)
ghost1.castShadow = true

ghost1.shadow.mapSize.width = 256
ghost1.shadow.mapSize.height = 256

ghost1.shadow.camera.far = 2

scene.add(ghost1)

const ghost2 = new THREE.PointLight('#00ffff', 2, 3)
ghost2.position.set(-4, 1, 1)
ghost2.castShadow = true

ghost2.shadow.mapSize.width = 256
ghost2.shadow.mapSize.height = 256

ghost2.shadow.camera.far = 2

scene.add(ghost2)

const ghost3 = new THREE.PointLight('#ffff00', 2, 3)
ghost3.position.set(4, 1, -4)
ghost3.castShadow = true

ghost3.shadow.mapSize.width = 256
ghost3.shadow.mapSize.height = 256

ghost3.shadow.camera.far = 2

scene.add(ghost3)


/**
 * Sizes
 */
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

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor('#262837')
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap //first

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    const ghost1Angle = elapsedTime * 0.5
    ghost1.position.x = Math.cos(ghost1Angle) * 4
    ghost1.position.z = Math.sin(ghost1Angle) * 4
    ghost1.position.y = Math.abs(Math.cos(elapsedTime * 3))

    const ghost2Angle = - elapsedTime * 0.3
    ghost2.position.x = Math.cos(ghost2Angle) * 5
    ghost2.position.z = Math.sin(ghost2Angle) * 5
    ghost2.position.y = Math.cos(elapsedTime * 2) + Math.sin(elapsedTime * 2.5)

    const ghost3Angle = - elapsedTime * 0.1
    ghost3.position.x = Math.cos(ghost2Angle) * (7 + Math.sin(elapsedTime * 0.15))
    ghost3.position.z = Math.sin(ghost2Angle) * (7 + Math.sin(elapsedTime * 0.5))
    ghost3.position.y = Math.cos(elapsedTime * 4) * (Math.sin(elapsedTime * 2.5))

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()
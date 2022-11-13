import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor(_options)
    {
        // Options
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.targetElement = this.experience.targetElement
        this.scene = this.experience.scene

        // Set up
        this.mode = 'debug' // defaultCamera \ debugCamera

        this.cameraGroup = new THREE.Group()

        this.setParralaxEffect()
        this.setInstance()
        this.setModes()
    }

    setInstance()
    {
        // Set up
        this.instance = new THREE.PerspectiveCamera(70, this.config.width / this.config.height, 0.1, 150)
        this.instance.rotation.reorder('YXZ')

        this.cameraGroup.add(this.instance)

        this.scene.add(this.cameraGroup)
    }

    setParralaxEffect()
    {
        this.cursor = {}
        this.cursor.x = 0
        this.cursor.y = 0

        window.addEventListener(`mousemove`, (evt) => 
        {
            this.cursor.x = evt.clientX / this.config.width - .5
            this.cursor.y = evt.clientY / this.config.height - .5
        })
    }

    setModes()
    {
        this.modes = {}

        // Default
        this.modes.default = {}
        this.modes.default.instance = this.instance.clone()
        this.modes.default.instance.rotation.reorder('YXZ')

        // Debug
        this.modes.debug = {}
        this.modes.debug.instance = this.instance.clone()
        this.modes.debug.instance.rotation.reorder('YXZ')
        this.modes.debug.instance.position.set(0,1.3,1.2)
        
        this.modes.debug.orbitControls = new OrbitControls(this.modes.debug.instance, this.targetElement)
        this.modes.debug.orbitControls.enabled = this.modes.debug.active
        this.modes.debug.orbitControls.screenSpacePanning = true
        this.modes.debug.orbitControls.enableKeys = false
        this.modes.debug.orbitControls.zoomSpeed = 0.25
        this.modes.debug.orbitControls.enableDamping = true
        this.modes.debug.orbitControls.target.set(0, 1.5, -1)

        // this.modes.debug.orbitControls.enableRotate = false
        // this.modes.debug.orbitControls.enableZoom = false

        this.modes.debug.orbitControls.update()

        if(this.debug){
            this.debugFolder = this.debug.addFolder('camera')

            this.debugFolder.add(this.instance.position, 'x', -20, 20, 0.0001).listen()
            this.debugFolder.add(this.instance.position, 'y', -20, 20, 0.0001).listen()
            this.debugFolder.add(this.instance.position, 'z', -20, 20, 0.0001).listen()

            this.debugFolder.add(this.modes.debug.orbitControls.target, 'x', -20, 20, 0.0001).listen()
            this.debugFolder.add(this.modes.debug.orbitControls.target, 'y', -20, 20, 0.0001).listen()
            this.debugFolder.add(this.modes.debug.orbitControls.target, 'z', -20, 20, 0.0001).listen()
        }
    }


    resize()
    {
        this.instance.aspect = this.config.width / this.config.height
        this.instance.updateProjectionMatrix()

        this.modes.default.instance.aspect = this.config.width / this.config.height
        this.modes.default.instance.updateProjectionMatrix()

        this.modes.debug.instance.aspect = this.config.width / this.config.height
        this.modes.debug.instance.updateProjectionMatrix()
    }

    update()
    {
        // Update debug orbit controls
        this.modes.debug.orbitControls.update()

        // Apply coordinates
        this.instance.position.copy(this.modes[this.mode].instance.position)
        this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion)
        this.instance.updateMatrixWorld() // To be used in projection

        //parralax
        this.parralaxX = this.cursor.x   * 0.5
        this.parralaxY = - this.cursor.y * 0.5

        this.cameraGroup.position.x += (this.parralaxX - this.cameraGroup.position.x / 0.25) * .05
        this.cameraGroup.position.y += (this.parralaxY - this.cameraGroup.position.y / 0.25) * .05
    }

    destroy()
    {
        this.modes.debug.orbitControls.destroy()
    }
}

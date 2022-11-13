import * as THREE from 'three'
import {CSS3DRenderer} from 'three/examples/jsm/renderers/CSS3DRenderer'
import Experience from './Experience.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'

export default class Renderer
{
    constructor(_options = {})
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.stats = this.experience.stats
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.cssScene = this.experience.cssScene
        this.camera = this.experience.camera

        // Debug
        if(this.debug)
        {
            this.debugFolder = this.debug.addFolder('renderer')
        }
        
        this.usePostprocess = false

        this.setInstance()
        this.setPostProcess()
    }

    setInstance()
    {
        this.clearColor = '#010101'
        // this.clearColor = '#f0f0f0'

        // Renderer
        this.instanceWebGL = new THREE.WebGLRenderer({
            alpha: false,
            antialias: true
        })
        this.instanceWebGL.domElement.style.position = 'absolute'
        this.instanceWebGL.domElement.style.top = 0
        this.instanceWebGL.domElement.style.left = 0
        this.instanceWebGL.domElement.style.width = '100%'
        this.instanceWebGL.domElement.style.height = '100%'

        this.instanceWebGL.setClearColor(this.clearColor, 1)
        this.instanceWebGL.setSize(this.config.width, this.config.height)
        this.instanceWebGL.setPixelRatio(this.config.pixelRatio)

        this.instanceWebGL.physicallyCorrectLights = true
        // this.instance.gammaOutPut = true
        this.instanceWebGL.outputEncoding = THREE.sRGBEncoding
        // this.instance.shadowMap.type = THREE.PCFSoftShadowMap
        // this.instance.shadowMap.enabled = false
        this.instanceWebGL.toneMapping = THREE.NoToneMapping
        this.instanceWebGL.toneMappingExposure = 1

        this.context = this.instanceWebGL.getContext()

        // Add stats panel
        if(this.stats)
        {
            this.stats.setRenderPanel(this.context)
        }
        
        // Debug
        if(this.debug)
        {
            this.debugFolder
                .addColor(
                    this,
                    'clearColor'
                )
                .onChange(() =>
                {
                    this.instanceWebGL.setClearColor(this.clearColor)
                })

            this.debugFolder
                .add(
                    this.instanceWebGL,
                    'toneMapping',
                    {
                        'NoToneMapping': THREE.NoToneMapping,
                        'LinearToneMapping': THREE.LinearToneMapping,
                        'ReinhardToneMapping': THREE.ReinhardToneMapping,
                        'CineonToneMapping': THREE.CineonToneMapping,
                        'ACESFilmicToneMapping': THREE.ACESFilmicToneMapping
                    }
                )
                .onChange(() =>
                {
                    this.scene.traverse((_child) =>
                    {
                        if(_child instanceof THREE.Mesh)
                            _child.material.needsUpdate = true
                    })
                })
                
            this.debugFolder
                .add(
                    this.instanceWebGL,
                    'toneMappingExposure'
                )
                .min(0)
                .max(10)
        }

        this.instanceCSS = new CSS3DRenderer()
    }

    setPostProcess()
    {
        this.postProcess = {}

        /**
         * Render pass
         */
        this.postProcess.renderPass = new RenderPass(this.scene, this.camera.instance)

        /**
         * Effect composer
         */
        this.renderTarget = new THREE.WebGLRenderTarget(
            this.config.width,
            this.config.height,
            {
                generateMipmaps: false,
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
                format: THREE.RGBFormat,
                encoding: THREE.sRGBEncoding,
                samples: 2
            }
        )
        this.postProcess.composer = new EffectComposer(this.instanceWebGL, this.renderTarget)
        this.postProcess.composer.setSize(this.config.width, this.config.height)
        this.postProcess.composer.setPixelRatio(this.config.pixelRatio)

        this.postProcess.composer.addPass(this.postProcess.renderPass)
    }

    resize()
    {
        // Instance
        this.instanceWebGL.setSize(this.config.width, this.config.height)
        this.instanceWebGL.setPixelRatio(this.config.pixelRatio)
        this.instanceCSS.setSize(this.config.width, this.config.height)

        // Post process
        this.postProcess.composer.setSize(this.config.width, this.config.height)
        this.postProcess.composer.setPixelRatio(this.config.pixelRatio)
    }

    update()
    {
        if(this.stats)
        {
            this.stats.beforeRender()
        }

        if(this.usePostprocess)
        {
            this.postProcess.composer.render()
        }
        else
        {
            this.instanceWebGL.render(this.scene, this.camera.instance)
            // this.instanceCSS.render(this.cssScene, this.camera.instance)
        }

        if(this.stats)
        {
            this.stats.afterRender()
        }
    }

    destroy()
    {
        this.instanceWebGL.renderLists.dispose()
        this.instanceWebGL.dispose()
        this.renderTarget.dispose()
        this.postProcess.composer.renderTarget1.dispose()
        this.postProcess.composer.renderTarget2.dispose()
    }
}
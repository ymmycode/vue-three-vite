import * as THREE from 'three'
import Experience from './Experience.js'
import Stage from './Objects/Stage.js'

export default class World
{
    constructor(_options)
    {
        this.experience = new Experience()
        this.config = this.experience.config
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        
        this.resources.on('groupEnd', (_group) =>
        {
            if(_group.name === 'base')
            {
                this.stage = new Stage()
            }
        })
    }

    debugObjects()
    {
        if(this.debug)
        {
            // this.debugFolder = this.debug.addFolder('Cube')

            // this.debugFolder
            // .addColor(this.cube.material, 'color' )
        }
    }

    resize()
    {
    }

    update()
    {
        
    }

    destroy()
    {
    }
}
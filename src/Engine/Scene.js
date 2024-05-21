import Engine from "./Engine"
import Mesh from "./Meshes/Mesh"
import CubeTextureLoader from "./Texture/CubeTextureLoader"
import { CUBE_TEXTURE, TEXTURE_2D } from "./Utils/Constants"

export default class Scene {
    /**
     * @param {Engine} Engine 
     */
    constructor(Engine) {
        this.Engine = Engine
        this.gl = Engine.gl

        /**
         * @type {CubeTextureLoader}
         */
        this.background = null

        this.objects = []
    }

    disposeAllObjects() {
        for(let i = 0; i < this.objects.length; i++) {
            const component = this.objects[i]

            if(component instanceof Mesh) {
                component.dispose(this.gl)
            }

        }
    }

    /**
     * @param  {...Mesh} components 
     */
    add(...components) {
        for(let i = 0; i < components.length; i++) {
            const component = components[i]

            if(component instanceof Mesh) {
                if(!component.material.texture) {
                    component.update(this.gl, this.Engine.Renderer.programTexture2D)
                } else {
                    switch(component.material.texture.type) {
                        case TEXTURE_2D: {
                            component.update(this.gl, this.Engine.Renderer.programTexture2D)
    
                            break
                        }
                        case CUBE_TEXTURE: {
                            component.update(this.gl, this.Engine.Renderer.programCubeTexture)
    
                            break
                        }
                    }
                }

            }

            this.objects.push(component)
        }

        return this.objects
    }

    /**
     * @param  {...Mesh} components 
     */
    remove(...components) {
        for(let i = 0; i < components.length; i++) {
            const component = components[i]
            const index = this.objects.findIndex(c => c.uuid === component.uuid)

            if(index === -1) continue

            this.objects.splice(index, 1)
        }

        return this.objects
    }

    update(delta) {
        if(this.background && !this.background._sceneInit) {
            this.background._textureBuffer = this.gl.createTexture()
            this.background._vertexBuffer = this.gl.createBuffer()
            this.background._vertex = new Float32Array([
                //  front
                -1.0, -1.0, 1.0,
                -1.0, 1.0, 1.0,
                1.0, -1.0, 1.0,
                
                -1.0, 1.0, 1.0,
                1.0, 1.0, 1.0,
                1.0, -1.0, 1.0,

                // back
                1.0, -1.0, -1.0,
                1.0, 1.0, -1.0,
                -1.0, -1.0, -1.0,
                
                1.0, 1.0, -1.0,
                -1.0, 1.0, -1.0,
                -1.0, -1.0, -1.0,

                // top
                -1.0, -1.0, -1.0,
                -1.0, -1.0, 1.0,
                1.0, -1.0, -1.0,
                
                -1.0, -1.0, 1.0,
                1.0, -1.0, 1.0,
                1.0, -1.0, -1.0,

                // bottom
                -1.0, 1.0, 1.0,
                -1.0, 1.0, -1.0,
                1.0, 1.0, 1.0,
                
                -1.0, 1.0, -1.0,
                1.0, 1.0, -1.0,
                1.0, 1.0, 1.0,

                // right
                1.0, -1.0, 1.0,
                1.0, 1.0, 1.0,
                1.0, -1.0, -1.0,
                
                1.0, 1.0, 1.0,
                1.0, 1.0, -1.0,
                1.0, -1.0, -1.0,
                
                // left
                -1.0, -1.0, -1.0,
                -1.0, 1.0, -1.0,
                -1.0, -1.0, 1.0,
                
                -1.0, 1.0, -1.0,
                -1.0, 1.0, 1.0,
                -1.0, -1.0, 1.0,
            ])
            
            this.background._vertexArray = null
            
            this.background._sceneInit = true
            console.log(this.background)
        }

        if(this.Engine.camera) {
            this.Engine.Renderer.update(this, this.objects, this.Engine.camera)
        }
    }
}
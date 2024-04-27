import Engine from "./Engine"
import Mesh from "./Meshes/Mesh"

export default class Scene {
    /**
     * @param {Engine} Engine 
     */
    constructor(Engine) {
        this.Engine = Engine
        this.gl = Engine.gl

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
                component.update(this.gl, this.Engine.Renderer.program)
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
        if(this.Engine.camera) {
            this.Engine.Renderer.update(this.objects, this.Engine.camera)
        }
    }
}
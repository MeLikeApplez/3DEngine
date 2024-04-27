import PerspectiveCamera from "./Camera/Perspective"
import Renderer from "./Renderer"
import Scene from "./Scene"

export default class Engine {
    constructor(canvas, { controller, ERROR_SCREEN }={}) {
        this.canvasElement = canvas
        this.gl = canvas.getContext('webgl2')

        this.Renderer = null
        this.Scene = null
        this.camera = null
        this.controller = controller ?? null

        this.fps = 0
        this.delta = 0

        this._errorScreen = ERROR_SCREEN  ?? null
        this._raf = null
        this._beforeTime = null

        this._events = new Map()

        this.ready = false

        this.createEvent('update')
        this.createEvent('load')
    }

    onresize() {
        if(!this.camera) return

        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
    }

    /**
     * 
     * @param {String} eventName 
     * @param {Function} callback 
     */
    on(eventName, callback) {
        const event = this._events.get(eventName)
    
        if(!event) return -1

        event.callbacks.push(callback)
    }

    /**
     * 
     * @param {String} eventName 
     */
    createEvent(eventName) {
        this._events.set(eventName, { callbacks: [] })
    }

    /**
     * 
     * @param {String} eventName 
     * @param  {...any} data 
     */
    fireEvent(eventName, ...data) {
        const event = this._events.get(eventName)

         if(!event) return -1

        for(let i = 0; i < event.callbacks.length; i++) {
            event.callbacks[i](...data)
        }
    }

    ERROR(message) {
        console.error(message)

        if(typeof this._errorScreen === 'function') this._errorScreen(message)

        this.ready = false
        this.pause()
    }

    setup() {
        if(!(this.gl instanceof WebGL2RenderingContext)) {
            return this.ERROR('Your device does not support WebGL2!')
        }

        try {
            this.Renderer = new Renderer(this.gl, this.canvasElement)
            this.Scene = new Scene(this)
            this.camera = new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 50)

            window.onresize = this.onresize.bind(this)

            this.ready = true

            this.play()

            this.fireEvent('load')
        } catch(err) {
            console.dir(err)
            this.ERROR(err.stack)
        }
    }

    destroy() {
        this.pause()

        this.Scene.disposeAllObjects()
        
        this.canvasElement = null
        this.gl = null
        this.ready = false
    }

    play() {
        this._raf = window.requestAnimationFrame(this.animate.bind(this))
    }

    pause() {
        window.cancelAnimationFrame(this._raf)
        this._raf = null
    }

    animate(timestamp) {
        if(!this.ready) return
        if(this.gl.isContextLost()) {
            this.pause()

            return
        }

        this._raf = window.requestAnimationFrame(this.animate.bind(this))

        this.delta = (timestamp - this._beforeTime) / 1000
        this.fps = 1 / this.delta

        try {
            this.fireEvent('update', this)

            this.Scene.update(this.delta)
        } catch(err) {
            this.pause()
            this.ERROR(err)
        }

        this._beforeTime = timestamp
    }
}
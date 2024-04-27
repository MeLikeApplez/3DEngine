export default class Controller {
    /**
     * @param {HTMLElement} target 
     */
    constructor(target) {
        this.target = target

        this.x = 0
        this.y = 0

        this.mouseUp = true
        this.mouseDown = false

        this.keys = new Map()
    
        window.onkeydown = this.onKeyEvent.bind(this)
        window.onkeyup = this.onKeyEvent.bind(this)
    
        target.onpointerdown = this.onPointerEvent.bind(this)
        target.onpointerup = this.onPointerEvent.bind(this)
        target.onpointermove = this.onPointerEvent.bind(this)
    }

    getTargetWidth() {
        const rect = this.target.getBoundingClientRect()
        
        return rect.width
    }

    getTargetHeight() {
        const rect = this.target.getBoundingClientRect()
        
        return rect.height
    }

    getTargetAspectRatio() {
        const rect = this.target.getBoundingClientRect()
        
        return rect.width / rect.height
    }

    onPointerEvent(event) {
        switch(event.type) {
            case 'pointermove':
                const rect = this.target.getBoundingClientRect()

                this.x = event.clientX - rect.left
                this.y = event.clientY - rect.top

                break
            case 'pointerdown':
                this.mouseUp = false
                this.mouseDown = true
                break
            case 'pointerup':
                this.mouseUp = true
                this.mouseDown = false
                break
        }
    }

    onKeyEvent(event) {
        if(event.type === 'keydown') {
            this.keys.set(event.key.toLowerCase(), false)
            
            return
        }

        this.keys.delete(event.key.toLowerCase())
    }

    update() {}
}
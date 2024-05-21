// https://textures.pixel-furnace.com/
// https://threejs.org/docs/?q=texture#api/en/loaders/TextureLoader

import Vector2 from "../Math/Vector2"
import { TEXTURE_2D } from "../Utils/Constants"

// https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html
export default class Texture2DLoader {
    constructor() {
        this.src = null
        this.img = null

        this.type = TEXTURE_2D
        this.ready = false

        this.uv = new Float32Array([
            0, 0,
            0, 1,
            1, 0,

            0, 1,
            1, 1,
            1, 0,
        ])
    }

    /**
     * @param {Vector2} bottomLeft 
     * @param {Vector2} bottomRight 
     * @param {Vector2} topLeft 
     * @param {Vector2} topRight 
     */
    static createUVSquareFromTriangles(bottomLeft, bottomRight, topLeft, topRight) {
        return new Float32Array([
            bottomLeft.x, bottomLeft.y,
            bottomRight.x, bottomRight.y,
            topLeft.x, topLeft.y,

            topLeft.x, topLeft.y,
            topRight.x, topRight.y,
            bottomRight.x, bottomRight.y,
        ])
    }

    /**
     * @param {string} src 
     */
    async loadDOMImage(src) {
        const img = new Image()

        img.src = src

        return new Promise((resolve, reject) => {
            img.onload = () => resolve(img)
            img.onerror = () => reject('Cannot load image: ' + src)
        })
    }

    /**
     * @param {string} src 
     * @param {Function} callback 
     */
    async fetchProgress(src, callback) {
        try {
            const response = await fetch(src)

            if(!response.ok) return reject(response.statusText)

                const contentType = response.headers.get('content-type')
                const contentLength = parseFloat(response.headers.get('content-length'))

                let progressPercentage = null
                const reader = response.body.getReader()
                const stream = new ReadableStream({
                    start: function(controller) {
                        function pushStream() {
                            reader.read().then(({ done, value }) => {

                                if(done) {
                                    controller.close()
                                    callback(done, null, 100)

                                    return
                                }

                                if(!isNaN(contentLength)) {
                                    progressPercentage = 100 * (value.byteLength / contentLength)
                                }

                                controller.enqueue(value)
                                callback(done, value, progressPercentage)

                                pushStream()
                            })
                        }

                        pushStream()
                    }
                })

                const streamResponse = new Response(stream, { headers: {
                    'Content-Type': contentType
                } })
                const blob = await streamResponse.blob()
                src = URL.createObjectURL(blob)

                return src
        } catch(error) {
            return error
        }
    }

    /**
     * @param {string} src 
     * @param {Function || undefined} onLoad 
     * @param {Function || undefined} onProgress 
     * @param {Function || undefined} onError 
     */
    async load(src, onLoad, onProgress, onError)  {
        if(!src) return null

        this.src = src

        return new Promise(async (resolve, reject) => {
            try {
                if(typeof onProgress === 'function') {
                    src = this.fetchProgress(src, onProgress)

                    const img = await this.loadDOMImage(src)

                    this.ready = true
                    this.img = img

                    if(typeof onLoad === 'function') onLoad(img)

                    return resolve(img)
                }


                const img = await this.loadDOMImage(src)
                
                this.ready = true
                this.img = img
                
                if(typeof onLoad === 'function') onLoad(img)
                
                return resolve(img)
            } catch(error) {
                if(typeof onError === 'function') onError(error)

                this.ready = false
                this.img = null

                reject(error)

                console.error(error)
            }
        })
    }
}
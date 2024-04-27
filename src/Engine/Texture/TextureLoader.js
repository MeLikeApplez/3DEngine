// https://textures.pixel-furnace.com/
// https://threejs.org/docs/?q=texture#api/en/loaders/TextureLoader

import Vector2 from "../Math/Vector2"

// https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html
export default class TextureLoader {
    constructor() {
        this.src = null

        this.img = null

        this.ready = false

        this.uv = new Float32Array([
            0, 0,
            0, 1,
            1, 0,

            1, 0,
            1, 1,
            0, 1,
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
     * @param {Function || undefined} onLoad 
     * @param {Function || undefined} onProgress 
     * @param {Function || undefined} onError 
     */
    async load(src, onLoad, onProgress, onError)  {
        if(!src) return null

        this.src = src

        const processImage = async imgSrc => {
            const img = new Image()

           return new Promise((imgResolve, imgReject) => {
                img.onload = () => {
                    imgResolve(img)

                    this.img = img
                    this.ready = true
                }
                img.onerror = () => imgReject(`Cannot find image: "${imgSrc}"`)

                img.src = imgSrc
           })
        }

        return new Promise(async (resolve, reject) => {
            try {
                if(typeof onProgress === 'function') {
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
                                        onProgress(done, null, 100)

                                        return
                                    }

                                    if(!isNaN(contentLength)) {
                                        progressPercentage = 100 * (value.byteLength / contentLength)
                                    }

                                    controller.enqueue(value)
                                    onProgress(done, value, progressPercentage)

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

                    const img = await processImage(src)

                    if(typeof onLoad === 'function') onLoad(img)

                    return resolve(img)
                }


                const img = await processImage(src)

                if(typeof onLoad === 'function') onLoad(img)
                
                return resolve(img)
            } catch(error) {
                if(typeof onError === 'function') onError(error)

                console.error(error)
            }
        })
    }
}
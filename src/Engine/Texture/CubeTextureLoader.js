import { CUBE_TEXTURE } from "../Utils/Constants"
import TextureLoader from "./Texture2DLoader"

export class CubeIndexTexture {
    /**
     * @param {Number} index 
     * @param {HTMLImageElement} img 
     */
    constructor(index, img) {
        this.index = index
        this.img = img
        /**
         * @type {string}
         */
        this.type = null
        /**
         * @type {string}
         */
        this.texture = null
        
        this.getType()
    }

    getType() {
        switch(this.index) {
            case 0: {
                this.type = 'px'
                this.texture = 'TEXTURE_CUBE_MAP_POSITIVE_X'
                break
            }
            case 1: {
                this.type = 'nx'
                this.texture = 'TEXTURE_CUBE_MAP_NEGATIVE_X'
                break
            }
            case 2: {
                this.type = 'py'
                this.texture = 'TEXTURE_CUBE_MAP_POSITIVE_Y'
                break
            }
            case 3: {
                this.type = 'ny'
                this.texture = 'TEXTURE_CUBE_MAP_NEGATIVE_Y'
                break
            }
            case 4: {
                this.type = 'pz'
                this.texture = 'TEXTURE_CUBE_MAP_POSITIVE_Z'
                break
            }
            case 5: {
                this.type = 'nz'
                this.texture = 'TEXTURE_CUBE_MAP_NEGATIVE_Z'
                break
            }
        }
    }
}

// https://jaxry.github.io/panorama-to-cubemap/
export default class CubeTextureLoader extends TextureLoader {
    constructor() {
        super()
    
        this.img = []
        this.px = null
        this.nx = null
        this.py = null
        this.ny = null
        this.pz = null
        this.nz = null

        this.type = CUBE_TEXTURE
    }

    /**
     * @param {string[]} src 
     * @param {Function || undefined} onLoad 
     * @param {Function || undefined} onProgress 
     * @param {Function || undefined} onError 
     */
    async load(src, onLoad, onProgress, onError) {
        if(!Array.isArray(src) || src.length !== 6) return null

        this.src = src

        return new Promise(async (resolve, reject) => {
            try {
                let images = []

                for(let i = 0; i < src.length; i++) {
                    let imageSrc = this.loadDOMImage(src[i])
                
                    images.push(imageSrc)
                }

                images = await Promise.allSettled(images)

                for(let i = 0; i < images.length; i++) {
                    const promiseImage = images[i]

                    if(promiseImage.status === 'rejected') throw Error(promiseImage.reason)

                    images[i] = new CubeIndexTexture(i, promiseImage.value)
                }

                resolve(images)

                this.ready = true
                this.img = images

                this.px = images[0]
                this.nx = images[1]
                this.py = images[2]
                this.ny = images[3]
                this.pz = images[4]
                this.nz = images[5]

                if(typeof onLoad === 'function') onLoad(images)
            } catch(error) {
                if(typeof onError === 'function') onError(error)
    
                this.ready = false
                this.img = []
    
                reject(error)
                console.error(error)
            }
        })
    }
}

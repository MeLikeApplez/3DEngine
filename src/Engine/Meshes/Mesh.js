import BufferGeometry from '../Geometry/Geometry'

import * as uuid from 'uuid'
import Color from '../Utils/Color'
import Vector3 from '../Math/Vector3'
import Euler from '../Math/Euler'
import TextureLoader from '../Texture/Texture2DLoader'
import Matrix4 from '../Math/Matrix4'
import { CUBE_TEXTURE, FRONT, TEXTURE_2D } from '../Utils/Constants'

export default class Mesh {
    /**
     * @param {BufferGeometry} geometry 
     * @param {BufferMeshMaterial} material 
     */
    constructor(geometry, material) {
        this.geometry = geometry
        this.material = material

        this.position = new Vector3(0, 0, 0)
        this.scale = new Vector3(1, 1, 1)
        this.rotation = new Euler(0, 0, 0)

        this.matrix = new Matrix4()
        this.matrixAutoUpdate = true

        // this.ready = false

        this.isMesh = true
        this.isInstancedMesh = false

        this.side = FRONT

        this.uuid = uuid.v4()
        this._vertexArray = null
        this._matrixBuffer = null
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     */
    dispose(gl) {
        if(!gl) return false

        gl.deleteBuffer(this._matrixBuffer)
        this._matrixBuffer= null

        gl.deleteVertexArray(this._vertexArray)
        this._vertexArray = null

        if(this.geometry) this.geometry.dispose(gl)
        if(this.material) this.material.dispose(gl)

        return true
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     */
    update(gl, program) {
        if(!this.geometry || !this.material) throw Error('Cannot initialize mesh! Geometry or Material is missing!')

        gl.deleteVertexArray(this._vertexArray)
        gl.deleteBuffer(this._matrixBuffer)

        this.updateMatrix(gl, program)

        // VAO's only work on vertex buffers / color vertex buffers, NOT TEXTURES
        this._vertexArray = gl.createVertexArray()
        gl.bindVertexArray(this._vertexArray)

        this._matrixBuffer = gl.createBuffer()

        this.geometry.load(gl, program)
        this.material.load(gl, program, this.geometry)

        const stride = this.matrix.elements.length * 4
        const vertexMatrixLocation = gl.getAttribLocation(program, 'meshMatrix')

        gl.bindBuffer(gl.ARRAY_BUFFER, this._matrixBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.matrix.elements, gl.STATIC_DRAW)
        
        gl.vertexAttribPointer(vertexMatrixLocation, 4, gl.FLOAT, false, stride, 0)
        gl.vertexAttribPointer(vertexMatrixLocation + 1, 4, gl.FLOAT, false, stride, 16)
        gl.vertexAttribPointer(vertexMatrixLocation + 2, 4, gl.FLOAT, false, stride, 32)
        gl.vertexAttribPointer(vertexMatrixLocation + 3, 4, gl.FLOAT, false, stride, 48)
        
        gl.vertexAttribDivisor(vertexMatrixLocation, 1)
        gl.vertexAttribDivisor(vertexMatrixLocation + 1, 1)
        gl.vertexAttribDivisor(vertexMatrixLocation + 2, 1)
        gl.vertexAttribDivisor(vertexMatrixLocation + 3, 1)

        gl.enableVertexAttribArray(vertexMatrixLocation)
        gl.enableVertexAttribArray(vertexMatrixLocation + 1)
        gl.enableVertexAttribArray(vertexMatrixLocation + 2)
        gl.enableVertexAttribArray(vertexMatrixLocation + 3)

        gl.bindVertexArray(null)
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     */
    updateMatrix(gl, program) {
        this.matrix.makeRotationFromEuler(this.rotation)

        // https://stackoverflow.com/a/37281018/13159492
        // Storing positional data IN GLSL is row order NOT column
        this.matrix.elements[12] = this.position.x
        this.matrix.elements[13] = this.position.y
        this.matrix.elements[14] = this.position.z

        this.matrix.elements[0] *= this.scale.x
        this.matrix.elements[1] *= this.scale.x
        this.matrix.elements[2] *= this.scale.x
        
        this.matrix.elements[4] *= this.scale.y
        this.matrix.elements[5] *= this.scale.y
        this.matrix.elements[6] *= this.scale.y
        
        this.matrix.elements[8] *= this.scale.z
        this.matrix.elements[9] *= this.scale.z
        this.matrix.elements[10] *= this.scale.z
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     */
    render(gl, program) {
        if(this.matrixAutoUpdate) {
            // this.updateMatrix(gl, program)
            this.update(gl, program)
        }
        
        gl.bindVertexArray(this._vertexArray)
        
        this.material.renderTexture(gl, program, this.geometry)
        
        gl.drawArrays(gl.TRIANGLES, 0, this.geometry.vertices.length)
        
        gl.bindVertexArray(null)
    }
}

export class BufferMeshMaterial {
    /**
     * @param {{
     *  color: Color | Color[],
     * texture: TextureLoader
     * }} param0 
     */
    constructor({ color, texture }={}) {
        this.color = color
        this.texture = texture

        this.colorVertices = new Float32Array(0)
        this.textureVertices = new Float32Array(0)

        this._colorBuffer = null
        this._colorAttribute = null

        this._textureBuffer = null
        this._textureBufferImg = null
        this._textureAttribute = null
    }

    /**
     * @param {BufferGeometry} geometry 
     * @param {Color | Color[]} color 
     */
    createColorVertices(geometry, color) {
        const colorVertices = new Uint8Array(geometry.vertices.length)

        if(Array.isArray(color)) {
            // colors * per triangle vertex
            const faceLength = color.length * geometry.trianglesPerFace

            let faceCount = 0
            let colorIndex = 0
            for(let i = 0; i < geometry.vertices.length; i+=3) {
                if(faceCount >= faceLength) {
                    colorVertices[i] = 0
                    colorVertices[i + 1] = 0
                    colorVertices[i + 2] = 0

                    continue
                }

                colorVertices[i] = color[colorIndex].value[0]
                colorVertices[i + 1] = color[colorIndex].value[1]
                colorVertices[i + 2] = color[colorIndex].value[2]

                faceCount++

                if(faceCount % geometry.trianglesPerFace === 0) {
                    colorIndex++
                }

            }
        } else if(color) {
            for(let i = 0; i < geometry.vertices.length; i+=3) {
                colorVertices[i] = color.value[0]
                colorVertices[i + 1] = color.value[1]
                colorVertices[i + 2] = color.value[2]
            }
        }

        return colorVertices
    }

    /**
     * @param {BufferGeometry} geometry 
     */
    setColorVertices(geometry) {
        this.colorVertices = this.createColorVertices(geometry, this.color)

        return this.colorVertices
    }
    
    /**
     * @param {BufferGeometry} geometry 
     */
    setTextureVertices(geometry) {
        const geometryBufferLength = (geometry.vertices.length / 3) * 2

        this.textureVertices = new Float32Array(geometryBufferLength)

        if(!this.texture) return

        if(Array.isArray(this.texture)) {
            const message = `
                Array textures are not allowed! Use texture atlases!
                https://webgl2fundamentals.org/webgl/lessons/webgl-3d-textures.html
                https://youtu.be/w3im_9qbM18?si=yj6QZMbBoaO6pRg3
            `
            throw Error(message)
        }

        const iterations = geometryBufferLength / this.texture.uv.length

        for(let i = 0; i < iterations; i++) {
            for(let j = 0; j < this.texture.uv.length; j++) {
                this.textureVertices[(i * this.texture.uv.length) + j] = this.texture.uv[j]
            }
        }
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     */
    setColorBuffer(gl) {
        const buffer = gl.createBuffer()

        if(!buffer) throw Error('Failed to create static buffer!')

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.colorVertices, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        this._colorBuffer = buffer

        return buffer
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     */
    setTextureBuffer(gl) {
        const buffer = gl.createBuffer()

        if(!buffer) throw Error('Failed to create static buffer!')

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.textureVertices, gl.STATIC_DRAW)
        gl.bindBuffer(gl.ARRAY_BUFFER, null)

        this._textureBuffer = buffer

        return buffer
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     */
    dispose(gl) {
        gl.deleteBuffer(this._colorBuffer)
        this._colorBuffer = null

        gl.deleteBuffer(this._textureBuffer)
        this._textureBuffer = null

        return true
    }

    clone() {
        const newBufferMeshMaterial = new BufferMeshMaterial({
            color: this.color,
            texture: this.texture
        })

        newBufferMeshMaterial.colorVertices.set(this.colorVertices)

        return newBufferMeshMaterial
    }

    /**
     * @param {BufferMeshMaterial} bufferMaterial 
     */
    copy(bufferMaterial) {
        bufferMaterial.color = this.color
        bufferMaterial.texture = this.texture
        
        bufferMaterial.colorVertices.set(this.colorVertices)

        return newBufferMeshMaterial
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     * @param {BufferGeometry} geometry 
     */
    load(gl, program, geometry) {
        // this.dispose(gl)

        if(this.colorVertices.length <= 0) {
            this.setColorVertices(geometry)
        }

        if(!this._buffer) {
            this.setColorBuffer(gl)
        }

        this._colorAttribute = gl.getAttribLocation(program, 'vertexColor')
        if(this._colorAttribute === -1) throw Error('Failed to get attribute location!')

        //  color
        gl.bindBuffer(gl.ARRAY_BUFFER, this._colorBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.colorVertices, gl.STATIC_DRAW)

        gl.vertexAttribPointer(this._colorAttribute, 3, gl.UNSIGNED_BYTE, true, 0, 0)
        gl.enableVertexAttribArray(this._colorAttribute)

        if(!this._textureBufferImg) {
            this._textureBufferImg = gl.createTexture()
        }
    }

    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {WebGLProgram} program 
     * @param {BufferGeometry} geometry 
     */
    renderTexture(gl, program, geometry) {
        if(this.textureVertices.length <= 0) {
            this.setTextureVertices(geometry)
        }
        
        if(!this._textureBuffer) {
            this.setTextureBuffer(gl)
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this._textureBuffer)
        gl.bufferData(gl.ARRAY_BUFFER, this.textureVertices, gl.STATIC_DRAW)

        this._textureAttribute = gl.getAttribLocation(program, 'aTexCoord')

        if(this._textureAttribute === -1) throw Error('Failed to get attribute location!')
        
        gl.vertexAttribPointer(this._textureAttribute, 2, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(this._textureAttribute)
        
        // support cube map needed
        if(this.texture) {
            if(this.texture.ready) {
                switch(this.texture.type) {
                    case TEXTURE_2D: {
                        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
        
                        gl.bindTexture(gl.TEXTURE_2D, this._textureBufferImg)
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, this.texture.img)
                
                        gl.generateMipmap(gl.TEXTURE_2D)
                        
                        break
                    }
                    case CUBE_TEXTURE: {
                        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
    
                        for(let i = 0; i < this.texture.img.length; i++) {
                            const img = this.texture.img[i]
                            
                            const target = gl[img.texture]
    
                            gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._textureBufferImg)
                            gl.texImage2D(target, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img.img)
                        }
                
                        gl.generateMipmap(gl.TEXTURE_CUBE_MAP)
                        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
    
                        break
                    }
                    default: throw Error('Invalid texture loader')
                }
            } else {
                switch(this.texture.type) {
                    case TEXTURE_2D: {
                        // create an empty color texture
                        gl.bindTexture(gl.TEXTURE_2D, this._textureBufferImg)
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array(3))
    
                        break
                    }
                    case CUBE_TEXTURE: {
                        // create an empty color cube texture
                        // gl.bindTexture(gl.TEXTURE_CUBE_MAP, this._textureBufferImg)

                        // gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, null)
                        // gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_X, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, null)
                        
                        // gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Y, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, null)
                        // gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, null)

                        // gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_Z, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, null)
                        // gl.texImage2D(gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, null)

                        // gl.generateMipmap(gl.TEXTURE_CUBE_MAP)
                        // gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)

                        break
                    }
                }
            }
        }  else {
            // create an empty color texture
            gl.bindTexture(gl.TEXTURE_2D, this._textureBufferImg)
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, 1, 1, 0, gl.RGB, gl.UNSIGNED_BYTE, new Uint8Array(3))
        }
       
    }
}

// https://vitejs.dev/guide/assets
import vertexSourceCode from './gl/vertex/vertex.glsl?raw'
import backgroundVertexSourceCode from './gl/vertex/background-vertex.glsl?raw'

import fragmentTexture2DSourceCode from './gl/fragment/fragmentTexture2D.glsl?raw'
import fragmentCubeTextureSourceCode from './gl/fragment/fragmentCubeTexture.glsl?raw'
import backgroundFragmentSourceCode from './gl/fragment/background-fragment.glsl?raw'

import Mesh from './Meshes/Mesh'
import Camera from './Camera/Camera'
import CubeTextureLoader from './Texture/CubeTextureLoader'
import Scene from './Scene'
import { BACK, CUBE_TEXTURE, FRONT, FRONT_AND_BACK, TEXTURE_2D } from './Utils/Constants'

export default class Renderer {
    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(gl, canvas) {
        this.gl = gl
        this.canvasElement = canvas

        this.programTexture2D = this.createGLProgram(vertexSourceCode, fragmentTexture2DSourceCode)
        this.programCubeTexture = this.createGLProgram(vertexSourceCode, fragmentCubeTextureSourceCode)
        this.backgroundProgram = this.createGLProgram(backgroundVertexSourceCode, backgroundFragmentSourceCode)

        // Tell WebGL to test the depth when drawing, so if a square is behind
        // another square it won't be drawn
        this.gl.enable(this.gl.DEPTH_TEST)
        this.gl.enable(this.gl.CULL_FACE)
    }
    
    createGLProgram(vertexSource, shaderSource) {
        // setup and compile glsl vertex shader
        const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER)
        this.gl.shaderSource(vertexShader, vertexSource)
        this.gl.compileShader(vertexShader)

        if(!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
            const compileError = this.gl.getShaderInfoLog(vertexShader)

            throw Error(`Vertex Shader ${compileError}`)
        }

        // setup and compile fragment shader
        const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)
        this.gl.shaderSource(fragmentShader, shaderSource)
        this.gl.compileShader(fragmentShader)

        if(!this.gl.getShaderParameter(fragmentShader, this.gl.COMPILE_STATUS)) {
            const compileError = this.gl.getShaderInfoLog(fragmentShader)

            throw Error(`Fragment Shader ${compileError}`)
        }

        // create and attach program
        const program = this.gl.createProgram()
        this.gl.attachShader(program, vertexShader)
        this.gl.attachShader(program, fragmentShader)
        this.gl.linkProgram(program)

        if(!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
            const compileError = this.gl.getProgramInfoLog(program)

            throw Error(`Link Shader ${compileError}`)
        }

        this.updateCanvasSize()

        return program
    }


    updateCanvasSize() {
        // output merger
        this.canvasElement.width = this.canvasElement.clientWidth
        this.canvasElement.height = this.canvasElement.clientHeight
    }

    clear() {
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0)
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT)
    }

    /**
     * @param {WebGLProgram} program 
     * @param {Camera} camera  
    */
    updateProgramUniforms(program, camera) {
        const cameraPositionLocation = this.gl.getUniformLocation(program, 'cameraPosition')
        const cameraProjectionLocation = this.gl.getUniformLocation(program, 'cameraProjection')
        const viewProjectionLocation = this.gl.getUniformLocation(program, 'viewProjection')
        const rotationProjectionMatrixLocation = this.gl.getUniformLocation(program, 'rotationProjectionMatrix')

        // camera
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection#model_transform
        this.gl.uniformMatrix4fv(cameraProjectionLocation, false, camera.projectionMatrix.elements)
        this.gl.uniformMatrix4fv(viewProjectionLocation, false, camera.viewMatrix.elements)
        this.gl.uniformMatrix4fv(rotationProjectionMatrixLocation, false, camera.rotationMatrix.elements)
        this.gl.uniform3f(cameraPositionLocation, camera.position.x, camera.position.y, camera.position.z)
    }

    updateSceneBackground(Scene) {
        Scene.background._vertexArray = this.gl.createVertexArray()
        // this.gl.bindVertexArray(Scene.background._vertexArray)

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, Scene.background._vertexBuffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, Scene.background._vertex, this.gl.STATIC_DRAW)
    
        const vertexLocation = this.gl.getAttribLocation(this.backgroundProgram, 'vertexPosition')

        this.gl.vertexAttribPointer(vertexLocation, 3, this.gl.FLOAT, false, 0, 0)
        this.gl.enableVertexAttribArray(vertexLocation)

        this.gl.pixelStorei(this.gl.UNPACK_FLIP_Y_WEBGL, false)

        for(let i = 0; i < Scene.background.img.length; i++) {
            const img = Scene.background.img[i]
            
            const target = this.gl[img.texture]

            this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, Scene.background._textureBuffer)
            this.gl.texImage2D(target, 0, this.gl.RGB, this.gl.RGB, this.gl.UNSIGNED_BYTE, img.img)
        }

        this.gl.generateMipmap(this.gl.TEXTURE_CUBE_MAP)
        this.gl.texParameteri(this.gl.TEXTURE_CUBE_MAP, this.gl.TEXTURE_MIN_FILTER, this.gl.LINEAR_MIPMAP_LINEAR)

        // const skyboxLocation = this.gl.getUniformLocation(this.backgroundProgram, 'skybox')
        
        // this.gl.uniform1i(skyboxLocation, 0)

        this.gl.drawArrays(this.gl.TRIANGLES, 0, Scene.background._vertex.length)

        this.gl.bindVertexArray(null)
    }

    /**
     * @param {Scene} scene 
     * @param {Mesh[]} meshes 
     * @param {Camera} camera 
     */
    update(Scene, meshes, camera) {
        this.clear()

        if(Scene.background && Scene.background.ready) {
            // disable depth test
            this.gl.depthMask(false)
            this.gl.depthFunc(this.gl.LEQUAL)
            this.gl.cullFace(this.gl.BACK)

            this.gl.useProgram(this.backgroundProgram)
            this.updateProgramUniforms(this.backgroundProgram, camera)

            this.gl.viewport(0, 0, this.canvasElement.width, this.canvasElement.height)

            this.updateSceneBackground(Scene)
        }

        // re-enable depth test
        this.gl.depthMask(true)
        this.gl.depthFunc(this.gl.LESS)
        this.gl.cullFace(this.gl.FRONT)
        
        this.gl.useProgram(this.programCubeTexture)
        this.updateProgramUniforms(this.programCubeTexture, camera)

        this.gl.useProgram(this.programTexture2D)
        this.updateProgramUniforms(this.programTexture2D, camera)
        
        // rasterizer
        this.gl.viewport(0, 0, this.canvasElement.width, this.canvasElement.height)

        for(let i = 0; i < meshes.length; i++) {
            const mesh = meshes[i]

            switch(mesh.side) {
                case FRONT: {
                    this.gl.cullFace(this.gl.FRONT)

                    break
                }
                case BACK: {
                    this.gl.cullFace(this.gl.BACK)

                    break
                }
                case FRONT_AND_BACK: {
                    this.gl.cullFace(this.gl.FRONT_AND_BACK)

                    break
                }
                default: {
                    this.gl.cullFace(this.gl.FRONT)
                }
            }

            if(!mesh.material.texture) {
                this.gl.useProgram(this.programTexture2D)
                mesh.render(this.gl, this.programTexture2D)

                continue
            }

            switch(mesh.material.texture.type) {
                case CUBE_TEXTURE: {
                    this.gl.useProgram(this.programCubeTexture)
                    mesh.render(this.gl, this.programCubeTexture)

                    break
                }
                default: {
                    this.gl.useProgram(this.programTexture2D)
                    mesh.render(this.gl, this.programTexture2D)
                }
            }

        }
    }
}
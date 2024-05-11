// https://vitejs.dev/guide/assets
import vertexSourceCode from './gl/vertex.glsl?raw'
import fragmentSourceCode from './gl/fragment.glsl?raw'

import Mesh from './Meshes/Mesh'
import Camera from './Camera/Camera'

export default class Renderer {
    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(gl, canvas) {
        this.gl = gl
        this.canvasElement = canvas

        this.program = this.createGLProgram(vertexSourceCode, fragmentSourceCode)

        // Tell WebGL to test the depth when drawing, so if a square is behind
        // another square it won't be drawn
        this.gl.enable(this.gl.DEPTH_TEST)
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

    /**
     * @param {Mesh[]} meshes 
     * @param {Camera} camera 
     */
    update(meshes, camera) {
        this.gl.useProgram(this.program)
        this.updateProgramUniforms(this.program, camera)
        
        this.clear()
        
        // rasterizer
        this.gl.viewport(0, 0, this.canvasElement.width, this.canvasElement.height)

        for(let i = 0; i < meshes.length; i++) {
            const mesh = meshes[i]

            mesh.render(this.gl, this.program)
        }
    }
}
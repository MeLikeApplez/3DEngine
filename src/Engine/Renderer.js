// https://vitejs.dev/guide/assets
import vertexSourceCode from './gl/vertex.glsl?raw'
import fragmentSourceCode from './gl/fragment.glsl?raw'

import * as uuid from 'uuid'

import Mesh from './Meshes/Mesh'
import Camera from './Camera/Camera'
import Matrix4 from './Math/Matrix4'

export default class Renderer {
    /**
     * @param {WebGL2RenderingContext} gl 
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(gl, canvas) {
        this.gl = gl
        this.canvasElement = canvas

        this.program = this.CompileVertexFragmentShaderProgram()

        // Tell WebGL to test the depth when drawing, so if a square is behind
        // another square it won't be drawn
        this.gl.enable(this.gl.DEPTH_TEST)
    }
    
    CompileVertexFragmentShaderProgram() {
        // setup and compile glsl vertex shader
        const vertexShader = this.gl.createShader(this.gl.VERTEX_SHADER)
        this.gl.shaderSource(vertexShader, vertexSourceCode)
        this.gl.compileShader(vertexShader)

        if(!this.gl.getShaderParameter(vertexShader, this.gl.COMPILE_STATUS)) {
            const compileError = this.gl.getShaderInfoLog(vertexShader)

            throw Error(`Vertex Shader ${compileError}`)
        }

        // setup and compile fragment shader
        const fragmentShader = this.gl.createShader(this.gl.FRAGMENT_SHADER)
        this.gl.shaderSource(fragmentShader, fragmentSourceCode)
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


    /**
     * 
     * @param {WebGLBuffer} positionBuffer 
     * @param {WebGLBuffer} colorBuffer 
     * @param {Number} positionAttribLocation 
     * @param {Number} colorAttribLocation 
     */
    createStaticPositionColorBuffer(positionBuffer, colorBuffer, positionAttribLocation, colorAttribLocation) {
        const vertexArray = this.gl.createVertexArray()

        if(!vertexArray) throw Error('Failed to create Vertex Array!')

        this.gl.bindVertexArray(vertexArray)

        this.gl.enableVertexAttribArray(positionAttribLocation)
        this.gl.enableVertexAttribArray(colorAttribLocation)

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer)
        this.gl.vertexAttribPointer(positionAttribLocation, 3, this.gl.FLOAT, false, 0, 0)

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer)
        this.gl.vertexAttribPointer(colorAttribLocation, 3, this.gl.UNSIGNED_BYTE, true, 0, 0)

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)
        this.gl.bindVertexArray(null)

        return vertexArray
    }

    /**
     * @param {ArrayBuffer} data 
     */
    createStaticVertexBuffer(data) {
        const buffer = this.gl.createBuffer()

        if(!buffer) throw Error('Failed to create static buffer!')

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer)
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW)
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null)

        return buffer
    }

    /**
     * @param {HTMLImageElement} image 
     */
    createStaticTextureBuffer(image) {
        const texture = this.gl.createTexture()
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture)

        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image)

        this.gl.generateMipmap(this.gl.TEXTURE_2D)
    }

    // https://youtu.be/y2UsQB3WSvo?si=CFx3-PzhD7zI48os&t=758
    // https://youtu.be/lLa6XkVLj0w?si=twzukzL9CUiyjY2q
    /**
     * @param {Mesh} mesh 
     */
    createMeshRenderData(mesh) {
        const { geometry, material } = mesh

        if(mesh._vertexArray && geometry._buffer && material._buffer) {
            return mesh._vertexArray
        }

        if(!geometry._buffer) {
            geometry._buffer = this.createStaticVertexBuffer(geometry.vertices)
        }

        const useColor = !material.texture

        if(useColor&& mesh.material.colorVertices.length < mesh.geometry.vertices.length) {
            const geometryBufferLength = (mesh.geometry.vertices.length / 3) * 3

            mesh.material.colorVertices = new Uint8Array(geometryBufferLength)

            if(Array.isArray(mesh.material.color)) {
                const splitLength = geometryBufferLength / mesh.material.color.length
                let colorIndex = 0
                let splitCounter = 0

                for(let i = 0; i < geometryBufferLength; i+=3) {
                    if(splitCounter >= splitLength) {
                        colorIndex++
                        splitCounter = 0
                    }

                    mesh.material.colorVertices[i] = mesh.material.color[colorIndex].value[0]
                    mesh.material.colorVertices[i + 1] = mesh.material.color[colorIndex].value[1]
                    mesh.material.colorVertices[i + 2] = mesh.material.color[colorIndex].value[2]
                    splitCounter += 3
                }
            } else {
                for(let i = 0; i < geometryBufferLength; i+=3) {
                    mesh.material.colorVertices[i] = mesh.material.color.value[0]
                    mesh.material.colorVertices[i + 1] = mesh.material.color.value[1]
                    mesh.material.colorVertices[i + 2] = mesh.material.color.value[2]
                }
            }
        }

        if(!material._buffer) {
            if(material.texture) {
                // material._buffer = this.createStaticTextureBuffer(material.texture)
                material._buffer = this.createStaticVertexBuffer(null)

            } else if(useColor) {
                material._buffer = this.createStaticVertexBuffer(material.colorVertices)
            } else {
                material._buffer = this.createStaticVertexBuffer(null)
            }

        }

        const geometryAttribute = this.gl.getAttribLocation(this.program, 'vertexPosition')
        const materialAttribute = this.gl.getAttribLocation(this.program, 'vertexColor')

        if(geometryAttribute < 0 || materialAttribute < 0) {
            throw Error('Failed to get attrib location: "geometryAttribute or materialAttribute"')
        }

        const vertexArrayObject = this.createStaticPositionColorBuffer(
            geometry._buffer, material._buffer, 
            geometryAttribute, materialAttribute
        )

        if(!vertexArrayObject) throw Error('Failed to create vertexArrayObject on mesh!')

        mesh.ready = true
        mesh._vertexArray = vertexArrayObject

        return vertexArrayObject
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
     * @param {Mesh[]} meshes 
     * @param {Camera} camera 
     */
    update(meshes, camera) {
        const meshPositionLocation = this.gl.getUniformLocation(this.program, 'meshPosition')
        const meshScaleLocation = this.gl.getUniformLocation(this.program, 'meshScale')
        
        const rotationVertexMatrixLocation = this.gl.getUniformLocation(this.program, 'vertexRotation') 
        const rotationVertexOffsetLocation = this.gl.getUniformLocation(this.program, 'vertexRotationOffset')

        const cameraPositionLocation = this.gl.getUniformLocation(this.program, 'cameraPosition')
        const cameraProjectionLocation = this.gl.getUniformLocation(this.program, 'cameraProjection')
        const viewProjectionLocation = this.gl.getUniformLocation(this.program, 'viewProjection')
        const rotationProjectionMatrixLocation = this.gl.getUniformLocation(this.program, 'rotationProjectionMatrix')

        this.gl.useProgram(this.program)
        this.clear()

        // camera
        // https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_model_view_projection#model_transform
        this.gl.uniformMatrix4fv(cameraProjectionLocation, false, camera.projectionMatrix.elements)
        this.gl.uniformMatrix4fv(viewProjectionLocation, false, camera.viewMatrix.elements)
        this.gl.uniformMatrix4fv(rotationProjectionMatrixLocation, false, camera.rotationMatrix.elements)
        this.gl.uniform3f(cameraPositionLocation, camera.position.x, camera.position.y, camera.position.z)

        // rasterizer
        this.gl.viewport(0, 0, this.canvasElement.width, this.canvasElement.height)

        for(let i = 0; i < meshes.length; i++) {
            const mesh = meshes[i]

            if(mesh.isInstancedMesh) {
                mesh.render(this.gl, this.program)
                
                continue
            }

            const rotationMatrix = new Matrix4()
            
            rotationMatrix.makeRotationFromEuler(mesh.rotation)

            this.gl.uniform3f(rotationVertexOffsetLocation, mesh.centerOffset.x, mesh.centerOffset.y, mesh.centerOffset.z)
            this.gl.uniformMatrix4fv(rotationVertexMatrixLocation, false, rotationMatrix.elements)

            this.gl.uniform3f(meshScaleLocation, mesh.scale.x, mesh.scale.y, mesh.scale.z)
            this.gl.uniform3f(meshPositionLocation, mesh.position.x, mesh.position.y, mesh.position.z)

            mesh.render(this.gl, this.program)
        }
    }
}
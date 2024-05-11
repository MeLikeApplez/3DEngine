import BufferGeometry from "./Geometry"

export default class PlaneGeometry extends BufferGeometry {
    /**
     * @param {Number} width 
     * @param {Number} depth 
     */
    constructor(width, depth) {
        const vertices = [
            // top
            0.0, 0.0, 0.0,
            0.0, 1.0, 0.0,
            1.0, 0.0, 0.0,
            
            1.0, 0.0, 0.0,
            1.0, 1.0, 0.0,
            0.0, 1.0, 0.0,            
        ]

        for(let i = 0; i < vertices.length; i+=3) {
            vertices[i] *= width
            vertices[i + 1] *= depth
        }

        super(6, true, vertices)
    }
}
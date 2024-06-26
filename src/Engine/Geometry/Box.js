import BufferGeometry from './Geometry'

export default class BoxGeometry extends BufferGeometry {
    /**
     * @param {Number} width 
     * @param {Number} height 
     * @param {Number} depth 
     */
    constructor(width, height, depth) {
        const vertices = [
            //  front
            -1.0, -1.0, 1.0,
            -1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,
            
            -1.0, 1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, 1.0,

            // back
            1.0, -1.0, -1.0,
            1.0, 1.0, -1.0,
            -1.0, -1.0, -1.0,
            
            1.0, 1.0, -1.0,
            -1.0, 1.0, -1.0,
            -1.0, -1.0, -1.0,

            // top
            -1.0, -1.0, -1.0,
            -1.0, -1.0, 1.0,
            1.0, -1.0, -1.0,
            
            -1.0, -1.0, 1.0,
            1.0, -1.0, 1.0,
            1.0, -1.0, -1.0,

            // bottom
            -1.0, 1.0, 1.0,
            -1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,
            
            -1.0, 1.0, -1.0,
            1.0, 1.0, -1.0,
            1.0, 1.0, 1.0,

            // right
            1.0, -1.0, 1.0,
            1.0, 1.0, 1.0,
            1.0, -1.0, -1.0,
            
            1.0, 1.0, 1.0,
            1.0, 1.0, -1.0,
            1.0, -1.0, -1.0,
            
            // left
            -1.0, -1.0, -1.0,
            -1.0, 1.0, -1.0,
            -1.0, -1.0, 1.0,
            
            -1.0, 1.0, -1.0,
            -1.0, 1.0, 1.0,
            -1.0, -1.0, 1.0,
        ]
        
        for(let i = 0; i < vertices.length; i+=3) {
            vertices[i] *= width
            vertices[i + 1] *= height
            vertices[i + 2] *= depth
        }

        super(6, false, vertices)
    }
}
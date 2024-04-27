#version 300 es

// GLSL Types - https://webgl2fundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html
precision mediump float;

out vec3 fragmentColor;

// vertex data
in vec3 vertexPosition;
in vec3 vertexOffset;
in vec3 vertexColor;

uniform mat4 vertexRotation;
uniform vec3 vertexRotationOffset;
uniform vec3 meshPosition;
uniform vec3 meshScale;

// texture data
in vec2 aTexCoord;
out vec2 vTexCoord;

// camera data
uniform vec3 cameraPosition;
uniform mat4 cameraProjection;
uniform mat4 viewProjection;
uniform mat4 rotationProjectionMatrix;

void main() {
    fragmentColor = vertexColor;
    vTexCoord = aTexCoord;

    // push vertex to center -> rotated -> push back to prefered location
    vec3 finalVertexPosition = (vertexPosition * meshScale) - vertexRotationOffset;
    // vec3 finalVertexPosition = vertexPosition + vertexOffset;
    mat4 finalProjectedMatrix = cameraProjection * viewProjection * rotationProjectionMatrix;

    vec4 finalPosition = (vertexRotation * vec4(finalVertexPosition, 1.0)) + vec4(- cameraPosition + meshPosition, 0.0);
    // vec4 finalPosition = vec4(finalVertexPosition - cameraPosition, 1.0);

    gl_Position = finalProjectedMatrix * finalPosition;
}
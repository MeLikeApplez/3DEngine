#version 300 es

// GLSL Types - https://webgl2fundamentals.org/webgl/lessons/webgl-shaders-and-glsl.html
precision mediump float;

// vertex data
in vec3 vertexPosition;
in mat4 meshMatrix;
in vec3 vertexColor;
in vec3 vertexColorOffset;

// texture data
out vec3 fragmentColor;
in vec2 aTexCoord;
out vec2 vTexCoord;
out vec3 v3TexCoord;

// camera data
uniform vec3 cameraPosition;
uniform mat4 cameraProjection;
uniform mat4 viewProjection;
uniform mat4 rotationProjectionMatrix;

void main() {
    fragmentColor = vertexColor + vertexColorOffset;
    vTexCoord = aTexCoord;
    v3TexCoord = vertexPosition;

    vec4 finalPositionPosition = vec4(vertexPosition, 1.0);
    mat4 finalProjectedMatrix = cameraProjection * viewProjection * rotationProjectionMatrix;
    vec4 finalPosition = (meshMatrix * finalPositionPosition) + vec4( -cameraPosition, 0.0);

    gl_Position = finalProjectedMatrix * finalPosition;
}
#version 300 es
precision mediump float;

in vec3 vertexPosition;

uniform mat4 cameraProjection;
uniform mat4 viewProjection;
uniform mat4 rotationProjectionMatrix;

out mat4 skyboxMatrix;
out vec3 skyboxPosition;

void main() {
    mat4 finalProjectedMatrix = cameraProjection * viewProjection * rotationProjectionMatrix;

    vec4 finalPosition = finalProjectedMatrix * vec4( vertexPosition, 1.0);
    // vec4 finalPosition = finalProjectedMatrix *  vec4( vertexPosition.xy, 1.0, 1.0);

    skyboxMatrix = finalProjectedMatrix;
    skyboxPosition = vertexPosition;

    gl_Position = finalPosition;
}
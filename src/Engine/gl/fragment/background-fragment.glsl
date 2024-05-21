#version 300 es
precision mediump float;

uniform samplerCube skybox;

in mat4 skyboxMatrix;
in vec3 skyboxPosition;

out vec4 outputColor;

void main() {
    vec4 newSkyboxPosition = skyboxMatrix * vec4(skyboxPosition, 1.0);
    // outputColor = texture(skybox, normalize(newSkyboxPosition.xyz / newSkyboxPosition.w));
    // outputColor = texture(skybox, newSkyboxPosition.xyz);
    outputColor = texture(skybox, skyboxPosition);
    // outputColor = vec4(1.0, 0.0, 0.0, 1.0);
}
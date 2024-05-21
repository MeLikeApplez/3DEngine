#version 300 es
precision mediump float;

// uniform sampler2D uSampler2D;
uniform samplerCube uSamplerCube;

in vec3 fragmentColor;
out vec4 outputColor;

in vec3 v3TexCoord;

void main() {
    outputColor = texture(uSamplerCube, v3TexCoord) + vec4(fragmentColor, 1.0);
}


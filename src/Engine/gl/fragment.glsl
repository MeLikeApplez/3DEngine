#version 300 es

precision mediump float;

in vec3 fragmentColor;
out vec4 outputColor;

in vec2 vTexCoord;
uniform sampler2D uSampler;

void main() {
    outputColor = texture(uSampler, vTexCoord) + vec4(fragmentColor, 1.0);
}


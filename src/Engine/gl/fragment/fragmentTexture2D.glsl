#version 300 es

precision mediump float;

in vec3 fragmentColor;
out vec4 outputColor;

in vec2 vTexCoord;
uniform sampler2D uSampler2D;

void main() {
    outputColor = texture(uSampler2D, vTexCoord) + vec4(fragmentColor, 1.0);
}


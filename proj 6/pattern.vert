#version 330 compatibility

uniform float uPigD;
uniform float uPigH;

out vec3 vL;
out vec3 vN;
out vec3 vE;
out vec2 vST;
out vec3 vMC;

const float PigW = 6.0;
const vec3 LightPosition = vec3(15.0, 15.0, 15.0);

void main() {
    vec4 MCvertex = gl_Vertex;

    float up = smoothstep(uPigD - PigW, uPigD, MCvertex.x);
    float down = 1.0 - smoothstep(uPigD, uPigD + PigW, MCvertex.x);
    float pulse = up * down;
    MCvertex.yz *= 1.0 + uPigH * pulse;

    vMC = MCvertex.xyz;

    vec4 ECposition = gl_ModelViewMatrix * MCvertex;
    vN = normalize(gl_NormalMatrix * gl_Normal);
    vL = LightPosition - ECposition.xyz;
    vE = -ECposition.xyz;

    vST = gl_MultiTexCoord0.st;

    gl_Position = gl_ModelViewProjectionMatrix * MCvertex;
}
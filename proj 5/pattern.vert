#version 120

varying vec3 vNormal;
varying vec3 vEyeDir;
varying vec3 vMC;
varying vec2 vST;

void main()
{
    vMC = gl_Vertex.xyz;
    vec3 ECposition = (gl_ModelViewMatrix * gl_Vertex).xyz;
    vEyeDir = ECposition; 
    vNormal = normalize(gl_NormalMatrix * gl_Normal);
    vST = gl_MultiTexCoord0.st;
    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
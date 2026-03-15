#version 330 compatibility

out vec3 vNormal;
out vec3 vPosition;
out vec3 vRayOrigin;
out vec3 vRayDir;

void main() {
    vNormal   = gl_Normal;
    vPosition = gl_Vertex.xyz;

    vec4 camObj = gl_ModelViewMatrixInverse * vec4(0.0, 0.0, 0.0, 1.0);
    vRayOrigin  = camObj.xyz;

    vRayDir = gl_Vertex.xyz - camObj.xyz;

    gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}

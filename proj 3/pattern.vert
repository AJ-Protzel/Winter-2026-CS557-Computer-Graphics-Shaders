#version 330 compatibility

// will be interpolated into the fragment shader:
// out  vec2  vST;                 // texture coords
out  vec3  vN;                  // normal vector
out  vec3  vL;                  // vector from point to light
out  vec3  vE;                  // vector from point to eye
// out  vec3  vMC;			        // model coordinates

uniform float uA,uP;
uniform float uLightX, uLightY, uLightZ;

void main( ) {

    vec4 vert = gl_Vertex;

    const float PI = 3.14159265;
    const float Y0 = 1.0;                        // top of the curtain
    float x = vert.x;
    float y = vert.y;

    float z = uA * (Y0 - y) * sin( (2.0*PI*x) / uP );
    vert.z = z;

    float arg  = (2.0*PI*x) / uP;
    float dzdx = uA * (Y0 - y) * (2.0*PI/uP) * cos(arg);
    float dzdy = -uA * sin(arg);

    vec3 Tx = vec3(1.0, 0.0, dzdx);
    vec3 Ty = vec3(0.0, 1.0, dzdy);
    vec3 Nobj = normalize( cross(Tx, Ty) );      // object-space normal

    vec4 posES = gl_ModelViewMatrix * vert;
    vN = normalize( gl_NormalMatrix * Nobj );

    vec3 lightPosES = vec3( gl_ModelViewMatrix * vec4(uLightX, uLightY, uLightZ, 1.0) );
    vL = lightPosES - posES.xyz;
    vE = -posES.xyz;

    gl_Position = gl_ProjectionMatrix * posES;

}

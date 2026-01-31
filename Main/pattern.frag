#version 330 compatibility

// Lighting
uniform float uKa, uKd, uKs;
uniform float uShininess;

// Noise
uniform float uNoiseAmp;   // amplitude
uniform float uNoiseFreq;  // frequency (scales the lookup coords)
uniform sampler3D Noise3;

// interpolated from the vertex shader:
in  vec2  vST;                  // texture coords
in  vec3  vN;                   // normal vector
in  vec3  vL;                   // vector from point to light
in  vec3  vE;                   // vector from point to eye
in  vec3  vMC;			        // model coordinates

const vec3 OBJECTCOLOR          = vec3( 0.88, 0.66, 0.12 );      // color to make the object
const vec3 SPECULARCOLOR        = vec3( 1. , 1. , 1. );

vec3 
PerturbNormal2( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
}

void main( ) {
    vec4 nvx = texture( Noise3, uNoiseFreq * vMC );
    float angx = (nvx.r + nvx.g + nvx.b + nvx.a) - 2.0;   // [-2,+2]
    angx *= uNoiseAmp;

    vec4 nvy = texture( Noise3, uNoiseFreq * vec3(vMC.xy, vMC.z + 0.5) );
    float angy = (nvy.r + nvy.g + nvy.b + nvy.a) - 2.0;   // [-2,+2]
    angy *= uNoiseAmp;

    vec3 n = PerturbNormal2( angx, angy, vN );
    n = normalize(  gl_NormalMatrix * n  );

    // Lighting (eye space)
    vec3 base   = OBJECTCOLOR;
    vec3 Light  = normalize( vL );
    vec3 Eye    = normalize( vE );

    vec3 ambient  = uKa * base;
    float dd      = max( dot(n, Light), 0. );
    vec3 diffuse  = uKd * dd * base;

    float s = 0.;
    if( dd > 0. )
    {
        vec3 ref = normalize( reflect( -Light, n ) );
        float cosphi = dot( Eye, ref );
        if( cosphi > 0. )
            s = pow( max( cosphi, 0. ), uShininess );
    }
    vec3 specular = uKs * s * SPECULARCOLOR;
    gl_FragColor  = vec4( ambient + diffuse + specular, 1. );

}
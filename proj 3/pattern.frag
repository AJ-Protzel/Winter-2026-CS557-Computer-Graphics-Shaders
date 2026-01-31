#version 330 compatibility

// Lighting
uniform float uKa, uKd, uKs;
uniform float uShininess;

// // Ellipse parameters
// uniform float uAd;         // diameter in s
// uniform float uBd;         // diameter in t
// uniform float uTol;        // blend width

// // Noise
// uniform float uNoiseAmp;   // amplitude
// uniform float uNoiseFreq;  // frequency (scales the lookup coords)
// uniform sampler3D Noise3;


// interpolated from the vertex shader:
// in  vec2  vST;                  // texture coords
in  vec3  vN;                   // normal vector
in  vec3  vL;                   // vector from point to light
in  vec3  vE;                   // vector from point to eye
// in  vec3  vMC;			        // model coordinates

const vec3 OBJECTCOLOR          = vec3( 0.88, 0.66, 0.12 );      // color to make the object
// const vec3 ELLIPSECOLOR      = vec3( 1., 0.4, 0. );           // color to make the ellipse
const vec3 SPECULARCOLOR        = vec3( 1 );


void main( ) {
    // vec2 st = vST;

    // float tile_s = floor(st.s / uAd);
    // float tile_t = floor(st.t / uBd);
    // float s_c = (tile_s + 0.5) * uAd;
    // float t_c = (tile_t + 0.5) * uBd;
    // float A_r = 0.5 * uAd;
    // float B_r = 0.5 * uBd;
    // float ds = st.s - s_c;
    // float dt = st.t - t_c;

    // vec3 P  = uNoiseFreq * vMC;
    // vec4 nv = texture(Noise3, P);

    // const vec4 w = vec4(1.0, 0.5, 0.25, 0.125);
    // float sumw   = dot(w, vec4(1.0));  
    
    // float ns = dot(nv,        w) / sumw; 
    // float nt = dot(nv.abgr,   w) / sumw; // decorrelated
    // ns = (2.0 * ns - 1.0) * uNoiseAmp;
    // nt = (2.0 * nt - 1.0) * uNoiseAmp;
    // ds += ns;
    // dt += nt;

    // Ellipse equation with perturbed (ds, dt):
    // float d = (ds*ds) / (A_r*A_r) + (dt*dt) / (B_r*B_r);

    // Smooth edge and color mix:
    // float blend = smoothstep( 1. - uTol, 1. + uTol, d );
    // vec3  base  = mix( ELLIPSECOLOR, OBJECTCOLOR, blend );

    vec3  base = OBJECTCOLOR;

    // ----- Per-fragment lighting -----
    vec3 Normal    = normalize(vN);
    vec3 Light     = normalize(vL);
    vec3 Eye       = normalize(vE);

    //float Ka = max(uKa, 0.05);
    vec3 ambient = uKa * base;

    float dd = max( dot(Normal,Light), 0. );       // only do diffuse if the light can see the point
    vec3 diffuse = uKd * dd * base;

    float s = 0.;
    if( dd > 0. )              // only do specular if the light can see the point
    {
            vec3 ref = normalize(  reflect( -Light, Normal )  );
            float cosphi = dot( Eye, ref );
            if( cosphi > 0. )
                    s = pow( max( cosphi, 0. ), uShininess );
    }
    vec3 specular = uKs * s * SPECULARCOLOR.rgb;
    gl_FragColor = vec4( ambient + diffuse + specular,  1. );
}






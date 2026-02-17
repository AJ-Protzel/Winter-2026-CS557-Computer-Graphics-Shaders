#version 330 compatibility

uniform sampler2D uImageUnit;   // 2D image texture
uniform float     uSc;          // s center of the Magic Lens
uniform float     uTc;          // t center of the Magic Lens
uniform float     uRad;         // radius of the Magic Lens (in texture coords)
uniform float     uMag;         // magnification factor
uniform float     uWhirl;       // whirl coefficient (use radians or degrees consistently)
uniform float     uMosaic;      // mosaic block size (in texture coords)

in vec2 vST;                    // (s,t) from vertex shader

void main()
{
    vec2 st = vST - vec2(uSc, uTc);
    float r = length(st);

    if (r >= uRad)
    {
        vec3 rgb = texture(uImageUnit, vST).rgb;
        gl_FragColor = vec4(rgb, 1.0);
        return;
    }
    else
    {
        float rp = r / max(uMag, 1e-6);

        float theta  = atan(st.y, st.x);
        float thetaP = theta - uWhirl * rp;

        st = rp * vec2(cos(thetaP), sin(thetaP));
        st += vec2(uSc, uTc);

        if (uMosaic > 0.0)
        {
            int   numins = int(floor(st.s / uMosaic));
            int   numint = int(floor(st.t / uMosaic));
            float sc     = (float(numins) + 0.5) * uMosaic;   // block center s
            float tc     = (float(numint) + 0.5) * uMosaic;   // block center t
            st = vec2(sc, tc);
        }

        vec3 rgb = texture(uImageUnit, st).rgb;
        gl_FragColor = vec4(rgb, 1.0);
        return;
    }
}
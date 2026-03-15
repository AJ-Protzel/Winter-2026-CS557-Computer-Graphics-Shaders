#version 330 compatibility

in vec3 vNormal;
in vec3 vPosition;
in vec3 vRayOrigin;
in vec3 vRayDir;

uniform float uTime;
uniform float uFlowSpeed;
uniform float uLightX, uLightY, uLightZ;

float hash(vec3 p) {
    p  = fract(p * vec3(127.1, 311.7, 74.7));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
}

float noise(vec3 p) {
    vec3 i = floor(p), f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    float x00 = mix(hash(i+vec3(0.0,0.0,0.0)), hash(i+vec3(1.0,0.0,0.0)), u.x);
    float x10 = mix(hash(i+vec3(0.0,1.0,0.0)), hash(i+vec3(1.0,1.0,0.0)), u.x);
    float x01 = mix(hash(i+vec3(0.0,0.0,1.0)), hash(i+vec3(1.0,0.0,1.0)), u.x);
    float x11 = mix(hash(i+vec3(0.0,1.0,1.0)), hash(i+vec3(1.0,1.0,1.0)), u.x);
    float y0  = mix(x00, x10, u.y);
    float y1  = mix(x01, x11, u.y);
    return mix(y0, y1, u.z);
}

float fbm(vec3 p) {
    float v = 0.0, amp = 0.5, freq = 1.0;
    for (int i = 0; i < 5; i++) {
        v   += amp * noise(p * freq);
        freq *= 2.0;
        amp  *= 0.5;
    }
    return v;
}

float density(vec3 p, float time) {
    // global spin
    float spinAngle = time * 0.3;
    float cosS = cos(spinAngle), sinS = sin(spinAngle);
    p = vec3(cosS * p.x - sinS * p.z, p.y, sinS * p.x + cosS * p.z);

    // internal flow
    float angle = time * uFlowSpeed;
    float cosA = cos(angle), sinA = sin(angle);
    vec3 rp = vec3(
        cosA * p.x - sinA * p.z,
        p.y - time * uFlowSpeed * 0.15,
        sinA * p.x + cosA * p.z
    );

    // interior spinning
        float t1 = time * 1.0;
        float t2 = time * 0.7;
        float t3 = time * 0.5;

    vec3 warp = vec3(
        fbm(rp * 1.8 + vec3(1.7 + t1, 9.2 + t3, 3.4      )),
        fbm(rp * 1.8 + vec3(8.3,       2.8 + t2, 5.1 + t1 )),
        fbm(rp * 1.8 + vec3(4.1 + t2,  6.7,      1.9 + t3 ))
    );

    // outer spin
    vec3 warp2 = vec3(
        fbm(rp * 0.9 + warp * 0.6 + vec3(t3 * 1.4, t1 * 0.5, 0.0)),
        fbm(rp * 0.9 + warp * 0.6 + vec3(0.0, t2 * 0.9, t3 * 0.7)),
        fbm(rp * 0.9 + warp * 0.6 + vec3(t1 * 0.3, 0.0, t2 * 1.1))
    );

    float d = fbm(rp * 2.2 + warp * 0.8 + warp2 * 0.4);

    // pulsating
    float breathe = 0.35 + 0.06 * sin(time * 0.4);
    d = smoothstep(breathe, breathe + 0.40, d);

    float r = length(p);
    float boundaryFade = 1.0 - smoothstep(0.65, 1.0, r);
    return d * boundaryFade;
}

void main() {
    vec3 ro = vRayOrigin;
    vec3 rd = normalize(vRayDir);

    float b = dot(ro, rd);
    float c = dot(ro, ro) - 1.0;
    float disc = b*b - c;
    if (disc < 0.0) discard;
    float sqrtDisc = sqrt(disc);
    float t0 = -b - sqrtDisc;
    float t1 = -b + sqrtDisc;
    if (t1 <= 0.0) discard;
    t0 = max(t0, 0.0);

    const int STEPS = 32;
    float stepSize = (t1 - t0) / float(STEPS);
    float time = uTime;

    vec3  L           = normalize(vec3(uLightX, uLightY, uLightZ));
    float accumulated = 0.0;
    float lighting    = 0.0;

    for (int i = 0; i < STEPS; i++) {
        float t   = t0 + (float(i) + 0.5) * stepSize;
        vec3  pos = ro + rd * t;

        float d = density(pos, time);
        if (d > 0.001) {
            float shadow = 0.0;
            vec3 lpos = pos;
            for (int j = 0; j < 4; j++) {
                lpos += L * 0.15;
                shadow += density(lpos, time);
            }
            float lightAtten = exp(-shadow * 1.2);
            float sampleLight = mix(0.3, 1.0, lightAtten);

            float alpha     = 1.0 - exp(-d * stepSize * 18.0);
            float remaining = 1.0 - accumulated;
            lighting    += sampleLight * alpha * remaining;
            accumulated += alpha * remaining;

            if (accumulated > 0.98) break;
        }
    }

    if (accumulated < 0.01) discard;

    vec3 colDark  = vec3(0.08, 0.08, 0.09);
    vec3 colLight = vec3(0.38, 0.38, 0.40);
    float litFrac = lighting / max(accumulated, 0.001);
    vec3 color    = mix(colDark, colLight, litFrac);

    gl_FragColor = vec4(color, accumulated);
}
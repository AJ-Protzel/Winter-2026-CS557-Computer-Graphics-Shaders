#version 330 compatibility

in vec3 vN;
in vec3 vL;
in vec3 vE;
in vec2 vST;
in vec3 vMC;

uniform sampler2D uImageUnit;

uniform float uTime;
uniform float uCylBlend;
uniform float uXMin;
uniform float uXMax;
uniform float uVRepeat;
uniform float uVOffset;
uniform vec2  uTile;
uniform vec2  uOffset;
uniform float uFlowSpeed;   // keep if you want scrolling

const vec3  SpecularColor = vec3(1.0);
const float Ka = 0.1;
const float Kd = 0.6;
const float Ks = 0.3;
const float Shininess = 30.0;

void main() {
    float theta = atan(vMC.z, vMC.y);
    float Ucyl  = theta * (1.0 / (2.0 * 3.14159265)) + 0.5;
    float vNorm = (vMC.x - uXMin) / (uXMax - uXMin);
    float Vcyl  = vNorm * uVRepeat + uVOffset;

    vec2 stBase = mix(vST, vec2(Ucyl, Vcyl), clamp(uCylBlend, 0.0, 1.0));

    // Keep or remove this line depending on whether you want scrolling:
    stBase.y += uTime * uFlowSpeed;

    vec2 st = stBase * uTile + uOffset;

    vec3 texColor = texture(uImageUnit, st).rgb;

    vec3 N = normalize(vN);
    vec3 L = normalize(vL);
    vec3 E = normalize(vE);

    vec3 ambient  = Ka * texColor;
    float ndotl   = max(dot(N, L), 0.0);
    vec3 diffuse  = Kd * ndotl * texColor;
    vec3 H        = normalize(L + E);
    float spec    = pow(max(dot(N, H), 0.0), Shininess);
    vec3 specular = Ks * spec * SpecularColor;

    gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}
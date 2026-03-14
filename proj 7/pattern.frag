#version 330 compatibility

in vec3 gN;
in vec3 gL;
in vec3 gE;

uniform float uKa, uKd, uKs, uShininess;

const vec3 ObjectColor = vec3(0.6, 0.8, 1.0);

void main()
{
    vec3 N = normalize(gN);
    vec3 L = normalize(gL);
    vec3 E = normalize(gE);
    vec3 H = normalize(L + E);

    vec3 ambient  = uKa * ObjectColor;
    vec3 diffuse  = uKd * max(dot(N, L), 0.0) * ObjectColor;
    vec3 specular = uKs * pow(max(dot(N, H), 0.0), uShininess) * vec3(1.0);

    gl_FragColor = vec4(ambient + diffuse + specular, 1.0);
}
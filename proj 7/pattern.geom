#version 330 compatibility
#extension GL_EXT_gpu_shader4: enable
#extension GL_EXT_geometry_shader4: enable

layout( triangles ) in;
layout( line_strip, max_vertices=78 ) out;

uniform int   uLevel;
uniform float uQuantize;
uniform float uSize;
uniform float uLightX, uLightY, uLightZ;

in vec3 vN[3];

out vec3 gN;
out vec3 gL;
out vec3 gE;

vec3 V0, V1, V2;
vec3 N0, N1, N2;
vec3 LIGHTPOSITION;

float
Quantize( float f )
{
    f *= uQuantize;
    int fi = int( f );
    f = float( fi ) / uQuantize;
    return f;
}

vec3
Quantize( vec3 v )
{
    return vec3( Quantize(v.x), Quantize(v.y), Quantize(v.z) );
}

void
ProduceCrosses( float s, float t )
{
    float r = 1. - s - t;

    vec3 v = r*V0 + s*V1 + t*V2;
    v = Quantize( v );

    vec3 n = r*N0 + s*N1 + t*N2;
    gN = normalize( gl_NormalMatrix * n );

    vec4 ECposition = gl_ModelViewMatrix * vec4( v, 1. );
    gL = LIGHTPOSITION - ECposition.xyz;
    gE = -ECposition.xyz;

    // x axis line
    vec3 vt = v;
    vt.x -= uSize;
    gl_Position = gl_ModelViewProjectionMatrix * vec4( vt, 1. );
    EmitVertex();
    vt.x += 2. * uSize;
    gl_Position = gl_ModelViewProjectionMatrix * vec4( vt, 1. );
    EmitVertex();
    EndPrimitive();

    // y axis line
    vt = v;
    vt.y -= uSize;
    gl_Position = gl_ModelViewProjectionMatrix * vec4( vt, 1. );
    EmitVertex();
    vt.y += 2. * uSize;
    gl_Position = gl_ModelViewProjectionMatrix * vec4( vt, 1. );
    EmitVertex();
    EndPrimitive();

    // z axis line
    vt = v;
    vt.z -= uSize;
    gl_Position = gl_ModelViewProjectionMatrix * vec4( vt, 1. );
    EmitVertex();
    vt.z += 2. * uSize;
    gl_Position = gl_ModelViewProjectionMatrix * vec4( vt, 1. );
    EmitVertex();
    EndPrimitive();
}

void
main()
{
    LIGHTPOSITION = vec3( uLightX, uLightY, uLightZ );

    V0 = gl_PositionIn[0].xyz;
    V1 = gl_PositionIn[1].xyz;
    V2 = gl_PositionIn[2].xyz;

    N0 = vN[0];
    N1 = vN[1];
    N2 = vN[2];

    int numLayers = 1 << uLevel;
    float dt = 1. / float( numLayers );
    float t = 1.;

    for( int it = 0; it <= numLayers; it++ )
    {
        float smax = 1. - t;
        int nums = it + 1;
        float ds = nums > 1 ? smax / float( nums - 1 ) : 1.;
        float s = 0.;

        for( int is = 0; is < nums; is++ )
        {
            ProduceCrosses( s, t );
            s += ds;
        }
        t -= dt;
    }
}
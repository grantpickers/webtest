precision mediump float;

varying lowp vec3 normal;
varying highp vec2 uv;
varying float light;

uniform sampler2D u_sampler;

void main () {
  if (uv.x < 0.0) {
    float c = 0.1*light+0.7*(0.2*normal.x + 0.0*normal.y + -0.2*normal.z);
    gl_FragColor = vec4(c,c,c, 1.0);
  }
  else {
    vec4 tex = texture2D(u_sampler, vec2(uv.x, 1.0-uv.y));
    float c = 0.5*light+0.7*(-0.5*normal.x + 0.0*normal.y + 0.2*normal.z);
    gl_FragColor = vec4(vec3(tex.x, tex.y, tex.z)*normal.x, 1.0);
  }
}

precision mediump float;

varying lowp vec3 normal;
varying highp vec2 uv;

uniform sampler2D u_sampler;

void main () {
  vec4 tex = texture2D(u_sampler, vec2(uv.x, 1.0-uv.y));
  float light = 0.5+0.5*(normal.x + normal.y*0.5 + normal.z*0.3);
  gl_FragColor = vec4(light * vec3(tex.x, tex.y, tex.z), 1.0);
}

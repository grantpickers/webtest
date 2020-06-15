precision mediump float;

varying highp vec2 uv;
varying float light;

uniform sampler2D u_sampler;

void main () {
  vec4 tex = texture2D(u_sampler, vec2(uv.x, 1.0-uv.y));
  gl_FragColor = vec4(1.0 * vec3(tex.x, tex.y, tex.z), 1.0);
}

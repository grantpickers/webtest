precision mediump float;

varying vec3 normal;
varying float light;

void main () {
  float c = light+0.7*(-normal.x + normal.y*0.0 + normal.z*0.0);
  gl_FragColor = vec4(c, c, c, 1.0);
}

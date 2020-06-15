precision mediump float;

varying vec3 normal;
varying float light;

void main () {
  float c = 0.2+0.5*light+0.7*(0.2*normal.x + 0.0*normal.y + -0.2*normal.z);
  gl_FragColor = vec4(c, c, c, 1.0);
}

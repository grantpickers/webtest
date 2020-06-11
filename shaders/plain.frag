precision mediump float;

varying lowp vec3 normal;

void main () {
  float light = 0.0+0.9*(-normal.x + normal.y*0.0 + normal.z*0.0);
  gl_FragColor = vec4(light, light, light, 1.0);
}

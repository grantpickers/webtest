precision mediump float;

varying lowp vec3 normal;

void main () {
  float light = 0.5+0.5*(-normal.x + normal.y*0.5 + normal.z*0.3);
  gl_FragColor = vec4(light, light, light, 1.0);
}

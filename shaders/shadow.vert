attribute vec3 a_pos;
uniform mat4 u_perspective_matrix;
uniform mat4 u_model_light_matrix;

void main () {
  gl_Position = u_perspective_matrix * u_model_light_matrix * vec4(a_pos, 1.0);
}

attribute vec3 a_pos;
attribute vec3 a_normal;
uniform mat4 u_perspective_matrix;
uniform mat4 u_model_view_matrix;
uniform mat4 u_view_model_transpose_matrix;


varying lowp vec3 normal;


void main () {
  gl_Position = u_perspective_matrix * u_model_view_matrix * vec4(a_pos, 1.0);
  normal = vec3(u_view_model_transpose_matrix * vec4(a_normal, 1.0));
}

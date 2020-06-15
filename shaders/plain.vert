precision mediump float;

attribute vec3 a_pos;
attribute vec3 a_normal;
uniform mat4 u_perspective_matrix;
uniform mat4 u_model_view_matrix;
uniform mat4 u_world_model_transpose_matrix;
uniform mediump float u_light;


varying vec3 normal;
varying float light;


void main () {
  gl_Position = u_perspective_matrix * u_model_view_matrix * vec4(a_pos, 1.0);
  normal = vec3(u_world_model_transpose_matrix * vec4(a_normal, 1.0));
  light = u_light;
}

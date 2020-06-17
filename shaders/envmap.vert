attribute vec3 a_pos;
attribute vec3 a_normal;

uniform mat4 u_perspective_matrix;
uniform mat4 u_model_view_matrix;
uniform mat4 u_model_world_matrix;
uniform mat4 u_world_model_transpose_matrix;

varying lowp vec3 position;
varying lowp vec3 normal;

void main () {
  gl_Position = u_perspective_matrix * u_model_view_matrix * vec4(a_pos, 1.0);
  position = mat3(u_model_world_matrix) * a_pos;
  normal = mat3(u_world_model_transpose_matrix) * a_normal;
}

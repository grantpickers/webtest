attribute vec3 a_pos;
attribute vec3 a_normal;
attribute vec2 a_uv;
uniform mat4 u_perspective_matrix;
uniform mat4 u_model_world_matrix;
uniform mat4 u_world_view_matrix;
uniform mat4 u_world_model_transpose_matrix;
uniform mat4 u_world_light_matrix;


varying vec4 light_space_pos;
varying lowp vec3 normal;
varying highp vec2 uv;


void main () {
  vec4 world_pos = u_model_world_matrix * vec4(a_pos, 1.0);

  gl_Position = u_perspective_matrix * u_world_view_matrix * world_pos;
  light_space_pos = u_perspective_matrix * u_world_light_matrix * world_pos;
  normal = vec3(u_world_model_transpose_matrix * vec4(a_normal, 1.0));
  uv = a_uv;
}

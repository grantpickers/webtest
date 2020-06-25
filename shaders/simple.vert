precision mediump float;

attribute vec3 a_pos;
attribute vec3 a_normal;
uniform mat4 u_perspective_matrix;
uniform mat4 u_model_world_matrix;
uniform mat4 u_world_view_matrix;
uniform mat4 u_world_model_transpose_matrix;

uniform mat4 u_point_lights_0_world_light_matrix;
uniform mat4 u_point_lights_1_world_light_matrix;
uniform mat4 u_point_lights_2_world_light_matrix;


varying vec4 light_space_pos_0;
varying vec4 light_space_pos_1;
varying vec4 light_space_pos_2;
varying vec3 normal;


void main () {
  vec4 world_pos = u_model_world_matrix * vec4(a_pos, 1.0);

  gl_Position = u_perspective_matrix * u_world_view_matrix * world_pos;
  light_space_pos_0 = u_perspective_matrix * u_point_lights_0_world_light_matrix * world_pos;
  light_space_pos_1 = u_perspective_matrix * u_point_lights_1_world_light_matrix * world_pos;
  light_space_pos_2 = u_perspective_matrix * u_point_lights_2_world_light_matrix * world_pos;
  normal = vec3(u_world_model_transpose_matrix * vec4(a_normal, 1.0));
}

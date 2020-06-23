precision mediump float;

#define NUM_POINT_LIGHTS 2

struct PointLight {
  sampler2D shadow_map;
  mat4 world_light_matrix;
  mat4 rotation;
};

attribute vec3 a_pos;
attribute vec3 a_normal;
uniform mat4 u_perspective_matrix;
uniform mat4 u_model_world_matrix;
uniform mat4 u_world_view_matrix;
uniform mat4 u_world_model_transpose_matrix;
uniform PointLight u_point_lights[NUM_POINT_LIGHTS];


varying vec4 light_space_pos[NUM_POINT_LIGHTS];
varying vec3 normal;


void main () {
  vec4 world_pos = u_model_world_matrix * vec4(a_pos, 1.0);

  gl_Position = u_perspective_matrix * u_world_view_matrix * world_pos;
  for (int i=0; i<NUM_POINT_LIGHTS; i++) {
    light_space_pos[i] = u_perspective_matrix * u_point_lights[i].world_light_matrix * world_pos;
  }
  normal = vec3(u_world_model_transpose_matrix * vec4(a_normal, 1.0));
}

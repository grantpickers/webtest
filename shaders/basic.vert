attribute vec3 a_pos;
attribute vec3 a_normal;
attribute vec2 a_uv;
uniform mat4 u_perspective_matrix;
uniform mat4 u_model_view_matrix;
uniform mat4 u_world_model_transpose_matrix;
uniform mediump float u_light;


varying lowp vec3 normal;
varying highp vec2 uv;
varying float light;


void main () {
  gl_Position = u_perspective_matrix * u_model_view_matrix * vec4(a_pos, 1.0);
  normal = vec3(u_world_model_transpose_matrix * vec4(a_normal, 1.0));
  light = u_light;
  uv = a_uv;
}

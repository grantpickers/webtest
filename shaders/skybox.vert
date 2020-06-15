attribute vec3 a_pos;
attribute vec2 a_uv;
uniform mat4 u_perspective_matrix;
uniform mat4 u_model_view_matrix;
uniform mat4 u_world_model_transpose_matrix;


varying highp vec2 uv;


void main () {
  gl_Position = u_perspective_matrix * u_model_view_matrix * vec4(a_pos, 1.0);
  uv = a_uv;
}

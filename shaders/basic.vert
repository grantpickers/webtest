attribute vec3 a_pos;
attribute vec3 a_normal;
attribute vec2 a_uv;
uniform mat4 u_perspective_matrix;
uniform mat4 u_model_view_matrix;


varying lowp vec3 normal;
varying highp vec2 uv;


void main () {
  gl_Position = u_perspective_matrix * u_model_view_matrix * vec4(a_pos, 1.0);
  normal = a_normal;
  uv = a_uv;
}

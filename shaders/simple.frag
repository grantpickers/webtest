precision mediump float;

uniform sampler2D u_sampler;

varying vec4 light_space_pos;
varying vec3 normal;

void main () {
  vec3 scaled_light_space_pos = light_space_pos.xyz / light_space_pos.w;
  scaled_light_space_pos.x += 1.0;
  scaled_light_space_pos.x /= 2.0;
  scaled_light_space_pos.y += 1.0;
  scaled_light_space_pos.y /= 2.0;
  scaled_light_space_pos.z += 1.0;
  scaled_light_space_pos.z /= 2.0;
  vec4 light_depth = texture2D(u_sampler, scaled_light_space_pos.xy);
  float shadow_depth = scaled_light_space_pos.z - 0.0010;

  bool in_range = scaled_light_space_pos.x >= 0.0 && scaled_light_space_pos.x <= 1.0 && scaled_light_space_pos.y >= 0.0 && scaled_light_space_pos.y <= 1.0;
 
  if (in_range && shadow_depth > light_depth.r) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  }
  else {
    float c = (0.2+0.7*(0.2*normal.x + 0.0*normal.y + -0.2*normal.z));
    gl_FragColor = vec4(c, c, c, 1.0);
  }
}

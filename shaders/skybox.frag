precision mediump float;

uniform sampler2D u_sampler;
uniform sampler2D u_shadow_map;
uniform sampler2D u_shadow_map1;
uniform mat4 u_light_rotation;
uniform mat4 u_light_rotation1;

varying vec4 light_space_pos;
varying vec4 light_space_pos1;
varying highp vec2 uv;
varying vec3 normal;

float get_shadow (sampler2D u_shadow_map, mat4 u_light_rotation, vec4 light_space_pos) {
  vec3 light_direction = (u_light_rotation * vec4(0.0, 0.0, 1.0, 1.0)).xyz;
  float ambience = 0.01;
  float brightness = 3.0;
  float falloff_linear = 0.7;
  float falloff_quadratic = 1.8;
  float shadow_bias = max(0.002 * (1.0 - dot(normal, light_direction)), 0.0005);

  vec3 scaled_light_space_pos = light_space_pos.xyz / light_space_pos.w;
  scaled_light_space_pos.x += 1.0;
  scaled_light_space_pos.x /= 2.0;
  scaled_light_space_pos.y += 1.0;
  scaled_light_space_pos.y /= 2.0;
  scaled_light_space_pos.z += 1.0;
  scaled_light_space_pos.z /= 2.0;

  float shadow_depth = scaled_light_space_pos.z;

  float shadow = 0.0;
  vec2 texel_size = vec2(1.0 / 1024.0, 1.0 / 1024.0);
  for(int x = -1; x <= 1; x++) {
    for(int y = -1; y <= 1; y++) {
      float pcf_depth = texture2D(u_shadow_map, scaled_light_space_pos.xy + vec2(x, y) * texel_size).r; 
      shadow += shadow_depth - shadow_bias > pcf_depth ? 1.0 : 0.0;        
    }
  }
  shadow /= 9.0;


  bool in_range = scaled_light_space_pos.x >= 0.0 && scaled_light_space_pos.x <= 1.0 && scaled_light_space_pos.y >= 0.0 && scaled_light_space_pos.y <= 1.0;

  if (!in_range || light_space_pos.z < 0.0) {
    shadow = 0.0;
  }

  return shadow;
}

void main () {
  vec4 tex = texture2D(u_sampler, vec2(uv.x, 1.0-uv.y));

  float shadow = get_shadow(u_shadow_map, u_light_rotation, light_space_pos);
  shadow += get_shadow(u_shadow_map1, u_light_rotation1, light_space_pos1);

  gl_FragColor = vec4((1.0-0.5*shadow) * vec3(tex.x, tex.y, tex.z), 1.0);
}

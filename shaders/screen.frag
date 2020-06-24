precision mediump float;

#define NUM_POINT_LIGHTS 3

struct PointLight {
  sampler2D shadow_map;
  mat4 world_light_matrix;
  mat4 rotation;
};

uniform sampler2D u_sampler;
uniform PointLight u_point_lights[NUM_POINT_LIGHTS];

varying lowp vec3 normal;
varying highp vec2 uv;
varying vec4 light_space_pos[NUM_POINT_LIGHTS];


float get_light (sampler2D shadow_map, mat4 light_rotation, vec4 light_space_pos) {
  vec3 light_direction = (light_rotation * vec4(0.0, 0.0, 1.0, 1.0)).xyz;
  float ambience = 0.05;
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
      float pcf_depth = texture2D(shadow_map, scaled_light_space_pos.xy + vec2(x, y) * texel_size).r; 
      shadow += shadow_depth - shadow_bias > pcf_depth ? 1.0 : 0.0;        
    }
  }
  shadow /= 9.0;

  bool in_range = scaled_light_space_pos.x >= 0.0 && scaled_light_space_pos.x <= 1.0 && scaled_light_space_pos.y >= 0.0 && scaled_light_space_pos.y <= 1.0;

  if (!in_range || light_space_pos.z < 0.0) {
    shadow = 0.0;
  }

  float dist = sqrt(dot(scaled_light_space_pos, scaled_light_space_pos));
  float falloff = 1.0/(1.0 + falloff_linear * dist + falloff_quadratic * dist * dist);
  float c = ambience + (1.0-shadow) * (brightness*clamp((falloff*dot(light_direction, normal)), 0.0, 1.0));
  return c;
}

void main () {
  vec4 tex = texture2D(u_sampler, vec2(uv.x, 1.0-uv.y));
  float c = 0.0;
  for (int i=0; i<NUM_POINT_LIGHTS; i++) {
    c += 0.3*get_light(u_point_lights[i].shadow_map, u_point_lights[i].rotation, light_space_pos[i]);
  }

  if (uv.x < 0.0) {
    gl_FragColor = vec4(c * vec3(1.0, 1.0, 1.0), 1.0);
  }
  else {
    gl_FragColor = vec4(tex.x, tex.y, tex.z, 1.0);
  }
}

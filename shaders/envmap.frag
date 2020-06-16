precision mediump float;

varying lowp vec3 position;
varying lowp vec3 normal;

uniform samplerCube u_sampler;
uniform vec3 u_camera_position;

void main () {
  vec3 worldNormal = normalize(normal);
  vec3 eyeToSurfaceDir = normalize(position - u_camera_position);
  vec3 direction = reflect(eyeToSurfaceDir,worldNormal);
 
  gl_FragColor = textureCube(u_sampler, direction);
}

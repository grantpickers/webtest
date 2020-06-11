// Camera

const camera_model_view_matrix = new Float32Array(16)
const camera_view_model_matrix = new Float32Array(16)
const camera_translation = new Float32Array([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
])
const camera_rotation = new Float32Array([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
])
const camera_inverse_translation = new Float32Array([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
])
const camera_inverse_rotation = new Float32Array([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
])
const camera_perspective_matrix = new Float32Array(16)
const camera_inverse_perspective_matrix = new Float32Array(16)
// TODO: make camera_lookat(x,y,z)
let camera_ry_target = 0
let camera_tx_target = 0
let camera_ty_target = 0
let camera_tz_target = -3
let camera_ry = camera_ry_target
let camera_tx = camera_tx_target
let camera_ty = camera_ty_target
let camera_tz = camera_tz_target
let camera_animation_tween = 1

function camera_update_perspective () {
  const aspect = canvas.width / canvas.height
  const fov = Math.PI/3
  const near = 0.5
  const far = 50
  const pa = 1/Math.tan(fov/2)/aspect
  const pb = 1/Math.tan(fov/2)
  const pc = (near + far)/(near - far)
  const pd = -1
  const pe = 2*near*far/(near - far)

  camera_perspective_matrix[0] = pa
  camera_perspective_matrix[5] = pb
  camera_perspective_matrix[10] = pc
  camera_perspective_matrix[11] = pd
  camera_perspective_matrix[14] = pe

  camera_inverse_perspective_matrix[0] = 1/pa
  camera_inverse_perspective_matrix[5] = 1/pb
  camera_inverse_perspective_matrix[11] = 1/pe
  camera_inverse_perspective_matrix[14] = 1/pd
  camera_inverse_perspective_matrix[15] = -pc/(pd*pe)
}

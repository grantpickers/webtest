/****************************
 * Pick
 ***************************/

const camera_0 = new Float32Array(3)
const PICK_DEPTH = 10
const PICK_STEP = 0.1
const pick_ray = new Float32Array(4)
const pick_p = new Float32Array([0, 0, 0, 1])


/****************************
 * Camera
 ***************************/

const camera_world_view_matrix = new Float32Array(16)
const camera_view_world_matrix = new Float32Array(16)
const camera_view_world_transpose_matrix = new Float32Array(16)
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


/****************************
 * Canvas
 ***************************/

let canvas = document.createElement('canvas')
let gl = canvas.getContext('webgl')
let mouse_x = 0
let mouse_y = 0
let has_clicked = false
let has_resized = true

function init_canvas () {
  document.body.appendChild(canvas)
  canvas.width = window.devicePixelRatio * canvas.offsetWidth
  canvas.height = 9/16*canvas.width
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(0,0,0,1)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)
  gl.cullFace(gl.BACK)

  window.addEventListener('resize', function (e) { has_resized = true })
  canvas.addEventListener('mousemove', function (e) { mouse_x = e.offsetX; mouse_y = e.offsetY })
  canvas.addEventListener('click', function (e) { has_clicked = true })
}


/****************************
 * Main Loop
 ***************************/

let prev_timestamp = null
let total_time = 0
const TARGET_FRAME_TIME = 1000/60

function main_loop (timestamp) {
  if (prev_timestamp == null) {
    prev_timestamp = timestamp
  }
  const frame_time = timestamp - prev_timestamp
  prev_timestamp = timestamp
  total_time += frame_time
  if (total_time > TARGET_FRAME_TIME*3) {
    total_time = TARGET_FRAME_TIME
  }
  while (total_time >= TARGET_FRAME_TIME) {
    update()
    render()
    total_time -= TARGET_FRAME_TIME
  }
  window.requestAnimationFrame(main_loop)
}


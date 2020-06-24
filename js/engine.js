/****************************
 * Pick
 ***************************/

const pick_ray = new Float32Array(4)


/****************************
 * Camera
 ***************************/

const camera_position = new Float32Array([0,0,0,1])
const camera_world_view_matrix = new Float32Array(16)
const camera_view_world_matrix = new Float32Array(16)
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
  const aspect = canvas.width/canvas.height
  const fov = Math.PI/3
  const near = 0.5
  const far = 100
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
 * Texture IDs
 ***************************/

let texture_id_counter = 0
function gen_next_texture_id () {
  const id = texture_id_counter
  texture_id_counter++
  return id
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

  gl.clearColor(0,0,0,1)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)
  gl.cullFace(gl.BACK)

  window.addEventListener('resize', function (e) { has_resized = true })
  canvas.addEventListener('mousemove', function (e) { mouse_x = e.offsetX; mouse_y = e.offsetY })
  canvas.addEventListener('click', function (e) { has_clicked = true; mouse_x = e.offsetX; mouse_y = e.offsetY })
}

/****************************
 * Main Loop
 ***************************/

let prev_timestamp = null
const TARGET_FRAME_TIME = 1000/60
let dt = 0
let total_time = 0
const limit_fps = true

function main_loop (timestamp) {
  if (!limit_fps) {
    if (prev_timestamp == null) {
      prev_timestamp = timestamp
    }
    dt = Math.min(32, timestamp - prev_timestamp)
    prev_timestamp = timestamp
    update()
    render()
    window.requestAnimationFrame(main_loop)
  } else {
    dt = timestamp - prev_timestamp
    prev_timestamp = timestamp
    total_time += dt
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
}


/****************************
 * Cube
 * This is an example object that should be replaced.
 * It demonstrates how to set up data for a 3d object that can move, rotate, and be clicked
 ***************************/

const cube_width = 0.25
const cube_translation = create_translation_matrix(2,0,-1)
const cube_inverse_translation = create_translation_matrix(-2,0,1)

const cube_rotation = matrix_mult_4(new Float32Array(16), matrix_mult_4(new Float32Array(16), create_z_rotation_matrix(1), create_y_rotation_matrix(3)), create_x_rotation_matrix(1))
const cube_rotation_rate = create_y_rotation_matrix(0.01)
const cube_inverse_rotation = new Float32Array(16)

const cube_model_world_matrix = new Float32Array(16)
const cube_world_model_matrix = new Float32Array(16)

const cube_model_view_matrix = new Float32Array(16)
const cube_view_model_matrix = new Float32Array(16)
const cube_view_model_transpose_matrix = new Float32Array(16)


/****************************
 * Screen
 * If you replace the screen model, be sure to update the pixel and model width and height
 * data here so that clicking it works. Also set screen_bot_left, screen_top_left and
 * screen_bot_right to the 3D coordinates in model space.
 ***************************/

const screen_pixel_width = 1920
const screen_pixel_height = 1080
const screen_bot_left = new Float32Array([0.060993, -0.500000, 0.8888888])
const screen_top_left = new Float32Array([0.060993, 0.500000, 0.8888888])
const screen_bot_right = new Float32Array([0.060993, -0.500000, -0.8888888])
const screen_model_width = 1.7777777
const screen_model_height = 1

const screen_canvas = document.createElement('canvas')
screen_canvas.width = screen_pixel_width
screen_canvas.height = screen_pixel_height
const screen_ctx = screen_canvas.getContext('2d')
const screen_n = cross3(new Float32Array(3), sub3([], screen_bot_right, screen_bot_left), sub3([], screen_top_left, screen_bot_left))
const screen_inverse_rotation = matrix_mult_4(new Float32Array(16), ROTATION_X_PI, ROTATION_Y_HALF_PI)
const screen_inverse_translation = new Float32Array([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  -screen_top_left[0], -screen_top_left[1], -screen_top_left[2], 1
])
const screen_inverse_scale = new Float32Array([
  screen_pixel_width/screen_model_width, 0, 0, 0,
  0, screen_pixel_height/screen_model_height, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
])
const pages = {
  works: [
    "Aenean commodo ligula eget dolor.",
    "Cum sociis natoque penatibus et magnis dis.",
  ],
  about: [
    'grant.gl',
    '',
    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
    "Aenean commodo ligula eget dolor.",
    "Aenean massa.",
    "Cum sociis natoque penatibus et magnis dis.",
  ],
  contact: [
    "Aenean commodo ligula eget dolor.",
    "Aenean massa.",
  ],
}
const buttons = [
  { x: 150, y: 100, w: 500, h: 100, txt: "3D WORKS", page: pages.works, },
  { x: 150, y: 240, w: 500, h: 100, txt: "ABOUT",    page: pages.about, },
  { x: 150, y: 380, w: 500, h: 100, txt: "CONTACT",  page: pages.contact, },
]
const button_bg = '#eee'
const button_fg = '#00f'
const button_hover_bg = '#aaa'
const button_hover_fg = '#00f'
const button_active_bg = '#000'
const button_active_fg = '#fff'
let current_page = pages.about



/****************************
 * Shaders
 ***************************/

// Basic Shader

let basic_shader_program = null
let basic_a_pos = null
let basic_a_normal = null
let basic_a_uv = null
let basic_u_model_view_matrix = null
let basic_u_perspective_matrix = null
let basic_u_sampler = null
function compile_basic_shader () {
  basic_shader_program = create_shader_program(gl, assets.basic_vertex, assets.basic_fragment)
  gl.useProgram(basic_shader_program)
  basic_a_pos    = gl.getAttribLocation(basic_shader_program, 'a_pos')
  basic_a_normal = gl.getAttribLocation(basic_shader_program, 'a_normal')
  basic_a_uv     = gl.getAttribLocation(basic_shader_program, 'a_uv')
  basic_u_model_view_matrix  = gl.getUniformLocation(basic_shader_program, 'u_model_view_matrix')
  basic_u_sampler            = gl.getUniformLocation(basic_shader_program, 'u_sampler')
  basic_u_perspective_matrix = gl.getUniformLocation(basic_shader_program, 'u_perspective_matrix')
  gl.uniformMatrix4fv(basic_u_perspective_matrix, false, camera_perspective_matrix)
}


// Plain Shader

let plain_shader_program = null
let plain_a_pos = null
let plain_a_normal = null
let plain_u_model_view_matrix = null
let plain_u_perspective_matrix = null
let plain_u_view_model_transpose_matrix = null
function compile_plain_shader () {
  plain_shader_program = create_shader_program(gl, assets.plain_vertex, assets.plain_fragment)
  gl.useProgram(plain_shader_program)
  plain_a_pos = gl.getAttribLocation(plain_shader_program, 'a_pos')
  plain_a_normal = gl.getAttribLocation(plain_shader_program, 'a_normal')
  plain_a_uv     = gl.getAttribLocation(plain_shader_program, 'a_uv')
  plain_u_model_view_matrix  = gl.getUniformLocation(plain_shader_program, 'u_model_view_matrix')
  plain_u_perspective_matrix = gl.getUniformLocation(plain_shader_program, 'u_perspective_matrix')
  plain_u_view_model_transpose_matrix  = gl.getUniformLocation(plain_shader_program, 'u_view_model_transpose_matrix')
  gl.uniformMatrix4fv(plain_u_perspective_matrix, false, camera_perspective_matrix)
}



/****************************
 * Update
 ***************************/

function update () {
  if (has_resized) { handle_resize() }
  update_pick()
  update_cube()
  update_screen()
  update_camera()

  has_clicked = false
  has_resized = false
}

function handle_resize () {
  canvas.width = window.devicePixelRatio * canvas.offsetWidth
  canvas.height = 9/16*canvas.width
  gl.viewport(0, 0, canvas.width, canvas.height)
  camera_update_perspective()
  gl.useProgram(basic_shader_program)
  gl.uniformMatrix4fv(basic_u_perspective_matrix, false, camera_perspective_matrix)
  gl.useProgram(plain_shader_program)
  gl.uniformMatrix4fv(plain_u_perspective_matrix, false, camera_perspective_matrix)
}


const cube_pick = new Float32Array(3)
function update_pick () {
  pick_ray[0] = 2 * mouse_x / canvas.width - 1
  pick_ray[1] = -2 * mouse_y / canvas.height + 1
  pick_ray[2] = -1
  pick_ray[3] = 1

  matrix_operate_4(pick_ray, camera_inverse_perspective_matrix, pick_ray)
  pick_ray[3] = 0
  matrix_operate_4(pick_ray, camera_view_world_matrix, pick_ray)

  matrix_operate_4(cube_pick, cube_world_model_matrix, pick_ray)
  if (
    cube_pick[0] > -cube_width*0.5 &&
    cube_pick[0] <  cube_width*0.5 &&
    cube_pick[1] > -cube_width*0.5 &&
    cube_pick[1] <  cube_width*0.5 &&
    cube_pick[2] > -cube_width*0.5 &&
    cube_pick[2] <  cube_width*0.5
  ) {
    console.log('yea')
  }

  const denom = dot3(pick_ray, screen_n)
  if (denom != 0) {
    camera_0[0] = -camera_translation[12]
    camera_0[1] = -camera_translation[13]
    camera_0[2] = -camera_translation[14]
    const t = dot3(screen_n, sub3(temp0, screen_bot_left, camera_0)) / denom
    sum3(pick_p, camera_0, scl3(temp0, t, pick_ray))
    matrix_operate_4(pick_p, screen_inverse_translation, pick_p)
    matrix_operate_4(pick_p, screen_inverse_rotation, pick_p)
    matrix_operate_4(pick_p, screen_inverse_scale, pick_p)
  }
}

function update_cube () {
  matrix_mult_4(cube_rotation, cube_rotation_rate, cube_rotation)

  matrix_mult_4(cube_model_world_matrix, cube_translation, cube_rotation)
  matrix_mult_4(cube_model_view_matrix, camera_world_view_matrix, cube_model_world_matrix)
  matrix_transpose_4(cube_inverse_rotation, cube_rotation)
  matrix_mult_4(cube_world_model_matrix, cube_inverse_rotation, cube_inverse_translation)
  matrix_mult_4(cube_view_model_matrix, cube_world_model_matrix, camera_view_world_matrix)
  matrix_transpose_4(cube_view_model_transpose_matrix, cube_view_model_matrix)
}

function update_screen () {
  const previous_page = current_page

  const screen_mouse_x = pick_p[0]
  const screen_mouse_y = pick_p[1]
  for (let i=0; i<buttons.length; i++) {
    const b = buttons[i]
    const is_hovered = screen_mouse_x > b.x && screen_mouse_y > b.y && screen_mouse_x < b.x+b.w && screen_mouse_y < b.y+b.h
    b.is_hovered = is_hovered
    if (is_hovered && has_clicked) {
      current_page = b.page
      if (current_page !== previous_page) {
        if (current_page == pages.works) {
          camera_ry_target = Math.PI/2 - 1*Math.PI/7
          camera_tx_target = -4.4*Math.sin(camera_ry_target)
          camera_ty_target = 0
          camera_tz_target = 1-4.4*Math.cos(camera_ry_target)
          camera_animation_tween = 0
        }
        if (current_page == pages.about || current_page == pages.contact) {
          camera_ry_target = Math.PI/2
          camera_tx_target = -0.92
          camera_ty_target = 0
          camera_tz_target = 0
          camera_animation_tween = 0
        }
      }
    }
  }
}

function update_camera () {
  if (camera_animation_tween < 1) {
    camera_animation_tween += 0.01
  }

  camera_ry = camera_animation_tween * (camera_ry_target) + (1-camera_animation_tween) * camera_ry
  camera_tx = camera_animation_tween * (camera_tx_target) + (1-camera_animation_tween) * camera_tx
  camera_ty = camera_animation_tween * (camera_ty_target) + (1-camera_animation_tween) * camera_ty
  camera_tz = camera_animation_tween * (camera_tz_target) + (1-camera_animation_tween) * camera_tz

  camera_translation[12] = camera_tx
  camera_translation[13] = camera_ty
  camera_translation[14] = camera_tz

  camera_rotation[0] = Math.cos(camera_ry)
  camera_rotation[2] = Math.sin(camera_ry)
  camera_rotation[8] = -Math.sin(camera_ry)
  camera_rotation[10] = Math.cos(camera_ry)

  matrix_mult_4(camera_world_view_matrix, camera_rotation, camera_translation)

  matrix_transpose_4(camera_inverse_rotation, camera_rotation)

  camera_inverse_translation[12] = -camera_tx
  camera_inverse_translation[13] = -camera_ty
  camera_inverse_translation[14] = -camera_tz

  matrix_mult_4(camera_view_world_matrix, camera_inverse_rotation, camera_inverse_translation)
  matrix_transpose_4(camera_view_world_transpose_matrix, camera_view_world_matrix)
}


/****************************
 * Main
 ***************************/

const asset_urls = {
  screen_obj: '/obj/screen.obj',
  cube_obj: '/obj/cube.obj',
  monkey_obj: '/obj/monkey.obj',
  basic_vertex: '/shaders/basic.vert',
  basic_fragment: '/shaders/basic.frag',
  plain_vertex: '/shaders/plain.vert',
  plain_fragment: '/shaders/plain.frag',
}
const image_urls = {
  theloop_png: '/img/theloop.png',
}

const model_buffers = {}
const assets = {}
const images = {}

function main () {
  init_canvas()
  camera_update_perspective()


  camera_ry_target = Math.PI/2
  camera_tx_target = -0.92
  camera_ty_target = 0
  camera_tz_target = 0


  model_buffers.cube = load_obj(gl, assets.cube_obj)

  model_buffers.monkey = load_obj(gl, assets.monkey_obj)

  model_buffers.screen = load_obj(gl, assets.screen_obj)
  model_buffers.screen.texture_id = 0
  model_buffers.screen.texture = load_texture(gl, screen_ctx.canvas, model_buffers.screen.texture_id)


  compile_basic_shader()
  compile_plain_shader()


  window.requestAnimationFrame(main_loop)
}

load_assets(asset_urls, assets, () => { load_images(image_urls, images, main) })

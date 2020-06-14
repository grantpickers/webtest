/****************************
 * Monkey
 ***************************/

const monkey_translation = create_translation_matrix(-2,0,2)
const monkey_inverse_translation = create_translation_matrix(2,0,-2)

const monkey_rotation = create_x_rotation_matrix(0)
const monkey_rotation_rate = create_y_rotation_matrix(0.01)
const monkey_inverse_rotation = new Float32Array(16)

const monkey_model_world_matrix = new Float32Array(16)
const monkey_world_model_matrix = new Float32Array(16)

const monkey_model_view_matrix = new Float32Array(16)
const monkey_view_model_matrix = new Float32Array(16)
const monkey_view_model_transpose_matrix = new Float32Array(16)


const monkey_pick_ray = new Float32Array(3)
const monkey_camera_0 = new Float32Array(4)
const monkey_half_width = 0.684
const monkey_half_height = 0.426
const monkey_half_depth = 0.492
const monkey_inv_ray = new Float32Array(3)
let monkey_light = 0.0
let monkey_light_target = monkey_light
let monkey_is_hovered = false
let monkey_is_selected = false


/****************************
 * Cube
 * This is an example object that should be replaced.
 * It demonstrates how to set up data for a 3d object that can move, rotate, and be clicked
 ***************************/

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

const cube_pick_ray = new Float32Array(3)
const cube_camera_0 = new Float32Array(4)
const cube_half_width = 0.25
const cube_inv_ray = new Float32Array(3)
let cube_light = 0.0
let cube_light_target = cube_light
let cube_is_hovered = false
let cube_is_selected = false


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
const screen_pick_p = new Float32Array([0, 0, 0, 1])
const screen_light = 1.7
const screen_translation = create_translation_matrix(0,0,0)
const screen_inverse_translation = create_translation_matrix(0,0,0)

const screen_rotation = new Float32Array([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
])
const screen_inverse_rotation = new Float32Array(16)

const screen_model_world_matrix = new Float32Array(16)
const screen_world_model_matrix = new Float32Array(16)

const screen_model_view_matrix = new Float32Array(16)
const screen_view_model_matrix = new Float32Array(16)
const screen_view_model_transpose_matrix = new Float32Array(16)


const screen_canvas = document.createElement('canvas')
screen_canvas.width = screen_pixel_width
screen_canvas.height = screen_pixel_height
const screen_ctx = screen_canvas.getContext('2d')
const screen_n = cross3(new Float32Array(3), sub3([], screen_bot_right, screen_bot_left), sub3([], screen_top_left, screen_bot_left))
const screen_display_inverse_rotation = matrix_mult_4(new Float32Array(16), ROTATION_X_PI, ROTATION_Y_HALF_PI)
const screen_display_inverse_translation = new Float32Array([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  -screen_top_left[0], -screen_top_left[1], -screen_top_left[2], 1
])
const screen_display_inverse_scale = new Float32Array([
  screen_pixel_width/screen_model_width, 0, 0, 0,
  0, screen_pixel_height/screen_model_height, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
])
const screen_pages = {
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
  { x: 150, y: 100, w: 500, h: 100, txt: "3D WORKS", page: screen_pages.works, },
  { x: 150, y: 240, w: 500, h: 100, txt: "ABOUT",    page: screen_pages.about, },
  { x: 150, y: 380, w: 500, h: 100, txt: "CONTACT",  page: screen_pages.contact, },
]
const button_bg = '#eee'
const button_fg = '#00f'
const button_hover_bg = '#aaa'
const button_hover_fg = '#00f'
const button_active_bg = '#000'
const button_active_fg = '#fff'
let current_page = screen_pages.about



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
let basic_u_view_model_transpose_matrix = null
let basic_u_light = null
function compile_basic_shader () {
  basic_shader_program = create_shader_program(gl, assets.basic_vertex, assets.basic_fragment)
  gl.useProgram(basic_shader_program)
  basic_a_pos    = gl.getAttribLocation(basic_shader_program, 'a_pos')
  basic_a_normal = gl.getAttribLocation(basic_shader_program, 'a_normal')
  basic_a_uv     = gl.getAttribLocation(basic_shader_program, 'a_uv')
  basic_u_model_view_matrix  = gl.getUniformLocation(basic_shader_program, 'u_model_view_matrix')
  basic_u_sampler            = gl.getUniformLocation(basic_shader_program, 'u_sampler')
  basic_u_perspective_matrix = gl.getUniformLocation(basic_shader_program, 'u_perspective_matrix')
  basic_u_view_model_transpose_matrix = gl.getUniformLocation(basic_shader_program, 'u_view_model_transpose_matrix')
  basic_u_light = gl.getUniformLocation(basic_shader_program, 'u_light')
  gl.uniformMatrix4fv(basic_u_perspective_matrix, false, camera_perspective_matrix)
}


// Plain Shader

let plain_shader_program = null
let plain_a_pos = null
let plain_a_normal = null
let plain_u_model_view_matrix = null
let plain_u_perspective_matrix = null
let plain_u_view_model_transpose_matrix = null
let plain_u_light = null
function compile_plain_shader () {
  plain_shader_program = create_shader_program(gl, assets.plain_vertex, assets.plain_fragment)
  gl.useProgram(plain_shader_program)
  plain_a_pos = gl.getAttribLocation(plain_shader_program, 'a_pos')
  plain_a_normal = gl.getAttribLocation(plain_shader_program, 'a_normal')
  plain_a_uv     = gl.getAttribLocation(plain_shader_program, 'a_uv')
  plain_u_model_view_matrix  = gl.getUniformLocation(plain_shader_program, 'u_model_view_matrix')
  plain_u_perspective_matrix = gl.getUniformLocation(plain_shader_program, 'u_perspective_matrix')
  plain_u_view_model_transpose_matrix = gl.getUniformLocation(plain_shader_program, 'u_view_model_transpose_matrix')
  plain_u_light = gl.getUniformLocation(plain_shader_program, 'u_light')
  gl.uniformMatrix4fv(plain_u_perspective_matrix, false, camera_perspective_matrix)
}



/****************************
 * Update
 ***************************/

function update () {
  if (has_resized) { handle_resize() }
  update_pick()
  update_monkey()
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



function ray_box_collide (half_width, half_height, half_depth, ray_0, inv_ray) {
  const pa_0 = -half_width
  const pa_1 = -half_height
  const pa_2 = -half_depth
  const pb_0 = half_width
  const pb_1 = half_height
  const pb_2 = half_depth

  const t_i  = (pb_0 - ray_0[0]) * inv_ray[0]
  const t_mi = (pa_0 - ray_0[0]) * inv_ray[0]
  const t_j  = (pb_1 - ray_0[1]) * inv_ray[1]
  const t_mj = (pa_1 - ray_0[1]) * inv_ray[1]
  const t_k  = (pb_2 - ray_0[2]) * inv_ray[2]
  const t_mk = (pa_2 - ray_0[2]) * inv_ray[2]

  let t_min = Math.min(t_i, t_mi)
  let t_max = Math.max(t_i, t_mi)

  t_min = Math.max(t_min, Math.min(t_j, t_mj))
  t_max = Math.min(t_max, Math.max(t_j, t_mj))

  t_min = Math.max(t_min, Math.min(t_k, t_mk))
  t_max = Math.min(t_max, Math.max(t_k, t_mk))

  return t_max >= t_min
}

function update_pick () {
  pick_ray[0] = 2 * mouse_x / canvas.width - 1
  pick_ray[1] = -2 * mouse_y / canvas.height + 1
  pick_ray[2] = -1
  pick_ray[3] = 1

  matrix_operate_4(pick_ray, camera_inverse_perspective_matrix, pick_ray)
  pick_ray[3] = 0
  matrix_operate_4(pick_ray, camera_view_world_matrix, pick_ray)


  // Monkey pick

  matrix_operate_4(monkey_pick_ray, monkey_world_model_matrix, pick_ray)
  matrix_operate_4(monkey_camera_0, monkey_world_model_matrix, camera_0)

  monkey_inv_ray[0] = 1/monkey_pick_ray[0]
  monkey_inv_ray[1] = 1/monkey_pick_ray[1]
  monkey_inv_ray[2] = 1/monkey_pick_ray[2]
  if (ray_box_collide(monkey_half_width, monkey_half_height, monkey_half_depth, monkey_camera_0, monkey_inv_ray)) {
    monkey_is_hovered = true
    if (has_clicked) {
      monkey_is_selected = true
      cube_is_selected = false
    }
  }
  else {
    monkey_light_target = 0.0
    monkey_is_hovered = false
  }


  // Cube pick

  matrix_operate_4(cube_pick_ray, cube_world_model_matrix, pick_ray)
  matrix_operate_4(cube_camera_0, cube_world_model_matrix, camera_0)

  cube_inv_ray[0] = 1/cube_pick_ray[0]
  cube_inv_ray[1] = 1/cube_pick_ray[1]
  cube_inv_ray[2] = 1/cube_pick_ray[2]
  if (ray_box_collide(cube_half_width, cube_half_width, cube_half_width, cube_camera_0, cube_inv_ray)) {
    cube_is_hovered = true
    if (has_clicked) {
      cube_is_selected = true
      monkey_is_selected = false
    }
  }
  else {
    cube_is_hovered = false
  }


  // Screen pick

  const denom = dot3(pick_ray, screen_n)
  if (denom != 0) {
    camera_0[0] = -camera_translation[12]
    camera_0[1] = -camera_translation[13]
    camera_0[2] = -camera_translation[14]
    const t = dot3(screen_n, sub3(temp0, screen_bot_left, camera_0)) / denom
    sum3(screen_pick_p, camera_0, scl3(temp0, t, pick_ray))
    matrix_operate_4(screen_pick_p, screen_display_inverse_translation, screen_pick_p)
    matrix_operate_4(screen_pick_p, screen_display_inverse_rotation, screen_pick_p)
    matrix_operate_4(screen_pick_p, screen_display_inverse_scale, screen_pick_p)
  }
}

function update_monkey () {
  if (monkey_is_selected) {
    monkey_light_target = 1.0
  }
  else if (monkey_is_hovered) {
    monkey_light_target = 0.5
  }
  else {
    monkey_light_target = 0.0
  }
  monkey_light += (monkey_light_target - monkey_light)*0.1

  matrix_mult_4(monkey_rotation, monkey_rotation_rate, monkey_rotation)

  matrix_mult_4(monkey_model_world_matrix, monkey_translation, monkey_rotation)
  matrix_mult_4(monkey_model_view_matrix, camera_world_view_matrix, monkey_model_world_matrix)
  matrix_transpose_4(monkey_inverse_rotation, monkey_rotation)
  matrix_mult_4(monkey_world_model_matrix, monkey_inverse_rotation, monkey_inverse_translation)
  matrix_mult_4(monkey_view_model_matrix, monkey_world_model_matrix, camera_view_world_matrix)
  matrix_transpose_4(monkey_view_model_transpose_matrix, monkey_view_model_matrix)
}

function update_cube () {
  if (cube_is_selected) {
    cube_light_target = 1.0
  }
  else if (cube_is_hovered) {
    cube_light_target = 0.5
  }
  else {
    cube_light_target = 0.0
  }
  cube_light += (cube_light_target - cube_light)*0.1

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

  const screen_mouse_x = screen_pick_p[0]
  const screen_mouse_y = screen_pick_p[1]
  for (let i=0; i<buttons.length; i++) {
    const b = buttons[i]
    const is_hovered = screen_mouse_x > b.x && screen_mouse_y > b.y && screen_mouse_x < b.x+b.w && screen_mouse_y < b.y+b.h
    b.is_hovered = is_hovered
    if (is_hovered && has_clicked) {
      current_page = b.page
      if (current_page !== previous_page) {
        if (current_page == screen_pages.works) {
          camera_ry_target = Math.PI/2 - 1*Math.PI/7
          camera_tx_target = -4.4*Math.sin(camera_ry_target)
          camera_ty_target = 0
          camera_tz_target = 0.5-4.4*Math.cos(camera_ry_target)
          camera_animation_tween = 0
        }
        if (current_page == screen_pages.about || current_page == screen_pages.contact) {
          camera_ry_target = Math.PI/2
          camera_tx_target = -0.92
          camera_ty_target = 0
          camera_tz_target = 0
          camera_animation_tween = 0
        }
      }
    }
  }

  matrix_mult_4(screen_model_world_matrix, screen_translation, screen_rotation)
  matrix_mult_4(screen_model_view_matrix, camera_world_view_matrix, screen_model_world_matrix)
  matrix_transpose_4(screen_inverse_rotation, screen_rotation)
  matrix_mult_4(screen_world_model_matrix, screen_inverse_rotation, screen_inverse_translation)
  matrix_mult_4(screen_view_model_matrix, screen_world_model_matrix, camera_view_world_matrix)
  matrix_transpose_4(screen_view_model_transpose_matrix, screen_world_model_matrix)
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
  cube_tex_png: '/img/cube_tex.png',
}

const model_buffers = {}
const assets = {}
const images = {}

function main () {
  init_canvas()
  camera_update_perspective()


  /*
  camera_ry_target = Math.PI/2
  camera_tx_target = -0.92
  camera_ty_target = 0
  camera_tz_target = 0
  */
  camera_ry_target = Math.PI/2 - 1*Math.PI/7
  camera_tx_target = -4.4*Math.sin(camera_ry_target)
  camera_ty_target = 0
  camera_tz_target = 0.5-4.4*Math.cos(camera_ry_target)


  model_buffers.screen = load_obj(gl, assets.screen_obj)
  model_buffers.screen.texture_id = 0
  model_buffers.screen.texture = load_texture(gl, screen_ctx.canvas, model_buffers.screen.texture_id)


  model_buffers.cube = load_obj(gl, assets.cube_obj)
  model_buffers.cube.texture_id = 1
  model_buffers.cube.texture = load_texture(gl, images.cube_tex_png, model_buffers.cube.texture_id)

  gl.useProgram(basic_shader_program)
  gl.activeTexture(gl.TEXTURE0 + model_buffers.cube.texture_id)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images.cube_tex_png)


  model_buffers.monkey = load_obj(gl, assets.monkey_obj)



  compile_basic_shader()
  compile_plain_shader()


  window.requestAnimationFrame(main_loop)
}

load_assets(asset_urls, assets, () => { load_images(image_urls, images, main) })

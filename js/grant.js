/****************************
 * welcometext
 ***************************/

const welcometext_translation = create_translation_matrix(new Float32Array(16), -2,3,-5)
const welcometext_inverse_translation = create_translation_matrix(new Float32Array(16), 2,-3,5)

const welcometext_rotation = create_y_rotation_matrix(new Float32Array(16), Math.PI/2 - 1*Math.PI/7)
const welcometext_rotation_rate = create_y_rotation_matrix(new Float32Array(16), 0)
const welcometext_inverse_rotation = new Float32Array(16)

const welcometext_model_world_matrix = new Float32Array(16)
const welcometext_world_model_matrix = new Float32Array(16)
const welcometext_world_model_transpose_matrix = new Float32Array(16)

const welcometext_model_view_matrix = new Float32Array(16)


/****************************
 * Tower
 ***************************/

const tower_translation = create_translation_matrix(new Float32Array(16), -40,6,2)
const tower_inverse_translation = create_translation_matrix(new Float32Array(16), 40,-6,-2)

const tower_rotation = create_x_rotation_matrix(new Float32Array(16), 0)
const tower_inverse_rotation = new Float32Array(16)

const tower_model_world_matrix = new Float32Array(16)
const tower_world_model_matrix = new Float32Array(16)
const tower_world_model_transpose_matrix = new Float32Array(16)

const tower_model_view_matrix = new Float32Array(16)


const tower_pick_ray = new Float32Array(3)
const tower_camera_position = new Float32Array(4)
const tower_half_width = 1.12
const tower_half_height = 1.804
const tower_half_depth = 1.12
const tower_inv_ray = new Float32Array(3)
let tower_light = 0.0
let tower_light_target = tower_light
let tower_is_hovered = false
let tower_is_selected = false

/****************************
 * sky
 ***************************/

const sky_translation = create_translation_matrix(new Float32Array(16), -1,0,1)
const sky_inverse_translation = create_translation_matrix(new Float32Array(16), 1,0,-1)

const sky_rotation = create_x_rotation_matrix(new Float32Array(16), 0)
const sky_inverse_rotation = new Float32Array(16)

const sky_model_world_matrix = new Float32Array(16)

const sky_model_view_matrix = new Float32Array(16)


const sky_pick_ray = new Float32Array(3)
const sky_camera_position = new Float32Array(4)
const sky_half_width = 0.56
const sky_half_height = 0.908
const sky_half_depth = 0.56
const sky_inv_ray = new Float32Array(3)


/****************************
 * Screen
 ***************************/

const screen_pixel_width = 1920
const screen_pixel_height = 1115
const screen_bot_left = new Float32Array([0.033758, -0.413442, 0.745426])
const screen_top_left = new Float32Array([0.033758, 0.453819, 0.745426 ])
const screen_bot_right = new Float32Array([0.033758, -0.413442, -0.748019 ])
const screen_model_width = 1.493445
const screen_model_height = 0.867261
const screen_pick_p = new Float32Array([0, 0, 0, 1])
const screen_translation = create_translation_matrix(new Float32Array(16), 0,0,0)
const screen_inverse_translation = create_translation_matrix(new Float32Array(16), 0,0,0)

const screen_rotation = new Float32Array([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
])
const screen_inverse_rotation = new Float32Array(16)

const screen_model_world_matrix = new Float32Array(16)
const screen_world_model_matrix = new Float32Array(16)
const screen_world_model_transpose_matrix = new Float32Array(16)

const screen_model_view_matrix = new Float32Array(16)


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

// Skybox Shader

let skybox_shader_program = null
let skybox_a_pos = null
let skybox_a_normal = null
let skybox_a_uv = null
let skybox_u_model_view_matrix = null
let skybox_u_perspective_matrix = null
let skybox_u_sampler = null
let skybox_u_world_model_transpose_matrix = null
function compile_skybox_shader () {
  skybox_shader_program = create_shader_program(gl, assets.skybox_vertex, assets.skybox_fragment)
  gl.useProgram(skybox_shader_program)
  skybox_a_pos    = gl.getAttribLocation(skybox_shader_program, 'a_pos')
  skybox_a_normal = gl.getAttribLocation(skybox_shader_program, 'a_normal')
  skybox_a_uv     = gl.getAttribLocation(skybox_shader_program, 'a_uv')
  skybox_u_model_view_matrix  = gl.getUniformLocation(skybox_shader_program, 'u_model_view_matrix')
  skybox_u_sampler            = gl.getUniformLocation(skybox_shader_program, 'u_sampler')
  skybox_u_perspective_matrix = gl.getUniformLocation(skybox_shader_program, 'u_perspective_matrix')
  skybox_u_world_model_transpose_matrix = gl.getUniformLocation(skybox_shader_program, 'u_world_model_transpose_matrix')
  gl.uniformMatrix4fv(skybox_u_perspective_matrix, false, camera_perspective_matrix)
}

// Envmap Shader

let envmap_shader_program = null
let envmap_a_pos = null
let envmap_a_normal = null
let envmap_a_uv = null
let envmap_u_model_view_matrix = null
let envmap_u_perspective_matrix = null
let envmap_u_sampler = null
let envmap_u_camera_position = null
let envmap_u_model_world_matrix = null
let envmap_u_world_model_transpose_matrix = null
function compile_envmap_shader () {
  envmap_shader_program = create_shader_program(gl, assets.envmap_vertex, assets.envmap_fragment)
  gl.useProgram(envmap_shader_program)
  envmap_a_pos    = gl.getAttribLocation(envmap_shader_program, 'a_pos')
  envmap_a_normal = gl.getAttribLocation(envmap_shader_program, 'a_normal')
  envmap_a_uv     = gl.getAttribLocation(envmap_shader_program, 'a_uv')
  envmap_u_model_view_matrix  = gl.getUniformLocation(envmap_shader_program, 'u_model_view_matrix')
  envmap_u_sampler            = gl.getUniformLocation(envmap_shader_program, 'u_sampler')
  envmap_u_camera_position    = gl.getUniformLocation(envmap_shader_program, 'u_camera_position')
  envmap_u_perspective_matrix = gl.getUniformLocation(envmap_shader_program, 'u_perspective_matrix')
  envmap_u_model_world_matrix = gl.getUniformLocation(envmap_shader_program, 'u_model_world_matrix')
  envmap_u_world_model_transpose_matrix = gl.getUniformLocation(envmap_shader_program, 'u_world_model_transpose_matrix')
  gl.uniformMatrix4fv(envmap_u_perspective_matrix, false, camera_perspective_matrix)
}

// Screen Shader

let screen_shader_program = null
let screen_a_pos = null
let screen_a_normal = null
let screen_a_uv = null
let screen_u_model_view_matrix = null
let screen_u_perspective_matrix = null
let screen_u_sampler = null
let screen_u_world_model_transpose_matrix = null
function compile_screen_shader () {
  screen_shader_program = create_shader_program(gl, assets.screen_vertex, assets.screen_fragment)
  gl.useProgram(screen_shader_program)
  screen_a_pos    = gl.getAttribLocation(screen_shader_program, 'a_pos')
  screen_a_normal = gl.getAttribLocation(screen_shader_program, 'a_normal')
  screen_a_uv     = gl.getAttribLocation(screen_shader_program, 'a_uv')
  screen_u_model_view_matrix  = gl.getUniformLocation(screen_shader_program, 'u_model_view_matrix')
  screen_u_sampler            = gl.getUniformLocation(screen_shader_program, 'u_sampler')
  screen_u_perspective_matrix = gl.getUniformLocation(screen_shader_program, 'u_perspective_matrix')
  screen_u_world_model_transpose_matrix = gl.getUniformLocation(screen_shader_program, 'u_world_model_transpose_matrix')
  gl.uniformMatrix4fv(screen_u_perspective_matrix, false, camera_perspective_matrix)
}

// Basic Shader

let basic_shader_program = null
let basic_a_pos = null
let basic_a_normal = null
let basic_a_uv = null
let basic_u_model_view_matrix = null
let basic_u_perspective_matrix = null
let basic_u_sampler = null
let basic_u_world_model_transpose_matrix = null
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
  basic_u_world_model_transpose_matrix = gl.getUniformLocation(basic_shader_program, 'u_world_model_transpose_matrix')
  basic_u_light = gl.getUniformLocation(basic_shader_program, 'u_light')
  gl.uniformMatrix4fv(basic_u_perspective_matrix, false, camera_perspective_matrix)
}


// Plain Shader

let plain_shader_program = null
let plain_a_pos = null
let plain_a_normal = null
let plain_u_model_view_matrix = null
let plain_u_perspective_matrix = null
let plain_u_world_model_transpose_matrix = null
let plain_u_light = null
function compile_plain_shader () {
  plain_shader_program = create_shader_program(gl, assets.plain_vertex, assets.plain_fragment)
  gl.useProgram(plain_shader_program)
  plain_a_pos = gl.getAttribLocation(plain_shader_program, 'a_pos')
  plain_a_normal = gl.getAttribLocation(plain_shader_program, 'a_normal')
  plain_a_uv     = gl.getAttribLocation(plain_shader_program, 'a_uv')
  plain_u_model_view_matrix  = gl.getUniformLocation(plain_shader_program, 'u_model_view_matrix')
  plain_u_perspective_matrix = gl.getUniformLocation(plain_shader_program, 'u_perspective_matrix')
  plain_u_world_model_transpose_matrix = gl.getUniformLocation(plain_shader_program, 'u_world_model_transpose_matrix')
  plain_u_light = gl.getUniformLocation(plain_shader_program, 'u_light')
  gl.uniformMatrix4fv(plain_u_perspective_matrix, false, camera_perspective_matrix)
}



/****************************
 * Update
 ***************************/

function update () {
  if (has_resized) { handle_resize() }
  update_camera()
  update_pick()
  update_welcometext()
  update_tower()
  update_sky()
  update_screen()
  

  has_clicked = false
  has_resized = false
}

function handle_resize () {
  canvas.width = window.devicePixelRatio * canvas.offsetWidth
  canvas.height = 1115/1920*canvas.width
  gl.viewport(0, 0, canvas.width, canvas.height)
  camera_update_perspective()
  gl.useProgram(basic_shader_program)
  gl.uniformMatrix4fv(basic_u_perspective_matrix, false, camera_perspective_matrix)
  gl.useProgram(plain_shader_program)
  gl.uniformMatrix4fv(plain_u_perspective_matrix, false, camera_perspective_matrix)
}



function update_camera () {
  if (camera_animation_tween < 1) {
    camera_animation_tween += dt*0.00016
  }

  camera_ry = camera_animation_tween * (camera_ry_target) + (1-camera_animation_tween) * camera_ry

  camera_position[0] = camera_animation_tween * (camera_tx_target) + (1-camera_animation_tween) * camera_position[0]
  camera_position[1] = camera_animation_tween * (camera_ty_target) + (1-camera_animation_tween) * camera_position[1]
  camera_position[2] = camera_animation_tween * (camera_tz_target) + (1-camera_animation_tween) * camera_position[2]

  camera_rotation[0] = Math.cos(camera_ry)
  camera_rotation[2] = -Math.sin(camera_ry)
  camera_rotation[8] = Math.sin(camera_ry)
  camera_rotation[10] = Math.cos(camera_ry)

  // This doesn't really get used since pick ray has w=0 and is the only user....
  camera_translation[12] = camera_position[0]
  camera_translation[13] = camera_position[1]
  camera_translation[14] = camera_position[2]

  camera_inverse_translation[12] = -camera_position[0]
  camera_inverse_translation[13] = -camera_position[1]
  camera_inverse_translation[14] = -camera_position[2]

  matrix_transpose_4(camera_inverse_rotation, camera_rotation)


  matrix_mult_4(camera_world_view_matrix, camera_inverse_rotation, camera_inverse_translation)
  matrix_mult_4(camera_view_world_matrix, camera_rotation, camera_translation)
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


  // tower pick

  matrix_operate_4(tower_pick_ray, tower_world_model_matrix, pick_ray)
  matrix_operate_4(tower_camera_position, tower_world_model_matrix, camera_position)

  tower_inv_ray[0] = 1/tower_pick_ray[0]
  tower_inv_ray[1] = 1/tower_pick_ray[1]
  tower_inv_ray[2] = 1/tower_pick_ray[2]
  if (ray_box_collide(tower_half_width, tower_half_height, tower_half_depth, tower_camera_position, tower_inv_ray)) {
    tower_is_hovered = true
    if (has_clicked) {
      tower_is_selected = true
    }
  }
  else {
    tower_is_hovered = false
  }


  // Screen pick

  const denom = dot3(pick_ray, screen_n)
  if (denom != 0) {
    const t = dot3(screen_n, sub3(temp0, screen_bot_left, camera_position)) / denom
    sum3(screen_pick_p, camera_position, scl3(temp0, t, pick_ray))
    matrix_operate_4(screen_pick_p, screen_display_inverse_translation, screen_pick_p)
    matrix_operate_4(screen_pick_p, screen_display_inverse_rotation, screen_pick_p)
    matrix_operate_4(screen_pick_p, screen_display_inverse_scale, screen_pick_p)
  }
}

function update_welcometext () {
  matrix_mult_4(welcometext_model_world_matrix, welcometext_translation, welcometext_rotation)

  matrix_mult_4(welcometext_model_view_matrix, camera_world_view_matrix, welcometext_model_world_matrix)

  matrix_transpose_4(welcometext_inverse_rotation, welcometext_rotation)
  matrix_mult_4(welcometext_world_model_matrix, welcometext_inverse_rotation, welcometext_inverse_translation)
  matrix_transpose_4(welcometext_world_model_transpose_matrix, welcometext_world_model_matrix)
}


function update_tower () {
  if (tower_is_selected) {
    tower_light_target = 1.0
  }
  else if (tower_is_hovered) {
    tower_light_target = 0.5
  }
  else {
    tower_light_target = 0.0
  }
  tower_light += (tower_light_target - tower_light)*0.1


  matrix_mult_4(tower_model_world_matrix, tower_translation, tower_rotation)
  matrix_mult_4(tower_model_view_matrix, camera_world_view_matrix, tower_model_world_matrix)
  matrix_transpose_4(tower_inverse_rotation, tower_rotation)
  matrix_mult_4(tower_world_model_matrix, tower_inverse_rotation, tower_inverse_translation)
  matrix_transpose_4(tower_world_model_transpose_matrix, tower_world_model_matrix)
}


function update_sky () {
  matrix_mult_4(sky_model_world_matrix, sky_translation, sky_rotation)
  matrix_mult_4(sky_model_view_matrix, camera_world_view_matrix, sky_model_world_matrix)
  matrix_transpose_4(sky_inverse_rotation, sky_rotation)
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
          camera_tx_target = 4.4*Math.sin(camera_ry_target)
          camera_ty_target = 0
          camera_tz_target = -0.5+4.4*Math.cos(camera_ry_target)
          camera_animation_tween = 0
        }
        if (current_page == screen_pages.about || current_page == screen_pages.contact) {
          camera_ry_target = Math.PI/2
          camera_tx_target = 0.78
          camera_ty_target = 0.020
          camera_tz_target = -0.004
          camera_animation_tween = 0
        }
      }
    }
  }

  matrix_mult_4(screen_model_world_matrix, screen_translation, screen_rotation)
  matrix_mult_4(screen_model_view_matrix, camera_world_view_matrix, screen_model_world_matrix)
  matrix_transpose_4(screen_inverse_rotation, screen_rotation)
  matrix_mult_4(screen_world_model_matrix, screen_inverse_rotation, screen_inverse_translation)
  matrix_transpose_4(screen_world_model_transpose_matrix, screen_world_model_matrix)
}


/****************************
 * Main
 ***************************/

const asset_urls = {
  screen_obj: '/obj/screen.obj',
  welcometext_obj: '/obj/words.obj',
  tower_obj: '/obj/tower.obj',
  sky_obj: '/obj/sky.obj',
  skybox_vertex: '/shaders/skybox.vert',
  skybox_fragment: '/shaders/skybox.frag',
  envmap_vertex: '/shaders/envmap.vert',
  envmap_fragment: '/shaders/envmap.frag',
  screen_vertex: '/shaders/screen.vert',
  screen_fragment: '/shaders/screen.frag',
  basic_vertex: '/shaders/basic.vert',
  basic_fragment: '/shaders/basic.frag',
  plain_vertex: '/shaders/plain.vert',
  plain_fragment: '/shaders/plain.frag',
}
const image_urls = {
  theloop_png: '/img/theloop.png',
  sky_png: '/img/sky.png',
  sky_px_png: '/img/px.png',
  sky_nx_png: '/img/nx.png',
  sky_py_png: '/img/py.png',
  sky_ny_png: '/img/ny.png',
  sky_pz_png: '/img/pz.png',
  sky_nz_png: '/img/nx.png',
}

const model_buffers = {}
const assets = {}
const images = {}

function main () {
  init_canvas(screen_pixel_width, screen_pixel_height)
  camera_update_perspective()

  camera_ry_target = Math.PI/2
  camera_tx_target = 0.78
  camera_ty_target = 0.020
  camera_tz_target = -0.004


  model_buffers.screen = load_obj(gl, assets.screen_obj)
  model_buffers.screen.texture_id = 0
  model_buffers.screen.texture = load_texture(gl, screen_ctx.canvas, model_buffers.screen.texture_id)


  model_buffers.welcometext = load_obj(gl, assets.welcometext_obj)
  model_buffers.welcometext.texture_id = 3
  model_buffers.welcometext.texture = load_texture_cube(
    gl,
    images.sky_px_png,
    images.sky_nx_png,
    images.sky_py_png,
    images.sky_ny_png,
    images.sky_pz_png,
    images.sky_nz_png,
    model_buffers.welcometext.texture_id
  )


  model_buffers.tower = load_obj(gl, assets.tower_obj)

  model_buffers.sky = load_obj(gl, assets.sky_obj)
  model_buffers.sky.texture_id = 2
  model_buffers.sky.texture = load_texture(gl, images.sky_png, model_buffers.sky.texture_id)

  gl.useProgram(basic_shader_program)
  gl.activeTexture(gl.TEXTURE0 + model_buffers.sky.texture_id)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, images.sky_png)


  compile_skybox_shader()
  compile_screen_shader()
  compile_envmap_shader()
  compile_basic_shader()
  compile_plain_shader()


  window.requestAnimationFrame(main_loop)
}

load_assets(asset_urls, assets, () => { load_images(image_urls, images, main) })

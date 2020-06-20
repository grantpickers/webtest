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
 * table
 ***************************/

const table_translation = create_translation_matrix(new Float32Array(16), -0,0,0)
const table_inverse_translation = create_translation_matrix(new Float32Array(16), 0,-0,-0)

const table_rotation = create_x_rotation_matrix(new Float32Array(16), 0)
const table_inverse_rotation = new Float32Array(16)

const table_model_world_matrix = new Float32Array(16)
const table_world_model_matrix = new Float32Array(16)
const table_world_model_transpose_matrix = new Float32Array(16)

const table_model_view_matrix = new Float32Array(16)


const table_pick_ray = new Float32Array(3)
const table_camera_position = new Float32Array(4)
const table_half_width = 1.12
const table_half_height = 1.804
const table_half_depth = 1.12
const table_inv_ray = new Float32Array(3)
let table_light = 0.0

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

const screen_desktop_items = [
  { x: 150, y: 100, w: 70, h: 70, txt: 'Painting', thumb: "folder_png"},
  { x: 150+180*1, y: 100, w: 70, h: 70, txt: '3d', thumb: "folder_png"},
  { x: 150+180*2, y: 100, w: 70, h: 70, txt: 'Animation', thumb: "folder_png"},
  { x: 150+180*3, y: 100, w: 70, h: 70, txt: 'Illustration', thumb: "folder_png"},
  { x: 150+180*4, y: 100, w: 70, h: 70, txt: 'contact', thumb: "snake_png"},
]
let screen_selected_item = null

const screen_explorer_item_sets = {
  painting: [
    { x: 60, y: 80, w: 70, h: 70, txt: 'wizard.png', thumb: "wizard_png"},
    { x: 60+130*1, y: 80, w: 70, h: 70, txt: 'snake.png', thumb: "snake_png"},
  ],
  animation: [
    { x: 60, y: 80, w: 70, h: 70, txt: 'wizard 2', thumb: "wizard_png"},
    { x: 60+130*1, y: 80, w: 70, h: 70, txt: 'snake 2', thumb: "snake_png"},
  ],
}
let screen_explorer_item_set = null

const screen_win_x = 200
const screen_win_y = 250
const screen_win_w = 1200
const screen_win_h = 700

let screen_explorer_title = ""

let screen_hovered_desktop_item = null


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

  screen_is_3d_hovered = false
  if (has_resized) { handle_resize(screen_pixel_width, screen_pixel_height) }
  update_camera()
  update_pick()
  update_welcometext()
  update_tower()
  update_table()
  update_sky()
  update_screen()

  

  has_clicked = false
  has_resized = false
}

function handle_resize (width, height) {
  let w,h
  if (window.innerWidth/window.innerHeight > width/height) {
    w = Math.floor(window.innerHeight * width/height)
    h = Math.floor(window.innerHeight)
  }
  else {
    w = Math.floor(window.innerWidth)
    h = Math.floor(window.innerWidth * height/width)
  }
  canvas.style.width = w+"px"
  canvas.style.height = h+"px"
  canvas.width = w
  canvas.height = h
  gl.viewport(0, 0, w, h)

  camera_update_perspective()
  gl.useProgram(basic_shader_program)
  gl.uniformMatrix4fv(basic_u_perspective_matrix, false, camera_perspective_matrix)
  gl.useProgram(plain_shader_program)
  gl.uniformMatrix4fv(plain_u_perspective_matrix, false, camera_perspective_matrix)
  gl.useProgram(screen_shader_program)
  gl.uniformMatrix4fv(screen_u_perspective_matrix, false, camera_perspective_matrix)
  gl.useProgram(envmap_shader_program)
  gl.uniformMatrix4fv(envmap_u_perspective_matrix, false, camera_perspective_matrix)
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
  create_y_rotation_matrix(welcometext_rotation, prev_timestamp*0.0004)
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

function update_table () {
  matrix_mult_4(table_model_world_matrix, table_translation, table_rotation)
  matrix_mult_4(table_model_view_matrix, camera_world_view_matrix, table_model_world_matrix)
  matrix_transpose_4(table_inverse_rotation, table_rotation)
  matrix_mult_4(table_world_model_matrix, table_inverse_rotation, table_inverse_translation)
  matrix_transpose_4(table_world_model_transpose_matrix, table_world_model_matrix)
}

function update_sky () {
  matrix_mult_4(sky_model_world_matrix, sky_translation, sky_rotation)
  matrix_mult_4(sky_model_view_matrix, camera_world_view_matrix, sky_model_world_matrix)
  matrix_transpose_4(sky_inverse_rotation, sky_rotation)
}


function update_screen () {
  const screen_mouse_x = screen_pick_p[0]
  const screen_mouse_y = screen_pick_p[1]
  if (screen_mouse_x > 0 && screen_mouse_y > 0 && screen_mouse_x < screen_pixel_width && screen_mouse_y < screen_pixel_height) {
    let has_clicked_desktop = has_clicked

    if (screen_explorer_item_set) {
      let has_clicked_close = false
      if (has_clicked) {
        has_clicked_close = screen_mouse_x > screen_win_x + screen_win_w - 26 && screen_mouse_y > screen_win_y && screen_mouse_x < screen_win_x + screen_win_w && screen_mouse_y < screen_win_y + 30
      }
      if (has_clicked_close) {
        screen_explorer_item_set = null
      }
      else {
        for (let i=0; i<screen_explorer_item_set.length; i++) {
          const explorer_item = screen_explorer_item_set[i]
          const is_hovered = screen_mouse_x > explorer_item.x + screen_win_x && screen_mouse_y > explorer_item.y + screen_win_y && screen_mouse_x < explorer_item.x+explorer_item.w + screen_win_x && screen_mouse_y < explorer_item.y+explorer_item.h + screen_win_y
          if (is_hovered) {
            if (has_clicked) {
              has_clicked_desktop = false
              if (!explorer_item.last_click_time || prev_timestamp - explorer_item.last_click_time > 500) {
                explorer_item.last_click_time = prev_timestamp
                screen_selected_item = explorer_item
              }
              else {
                // Double clicked
              }
            }
          }
        }
      }
    }

    screen_hovered_desktop_item = null
    for (let i=0; i<screen_desktop_items.length; i++) {
      const desktop_item = screen_desktop_items[i]
      const is_hovered = screen_mouse_x > desktop_item.x && screen_mouse_y > desktop_item.y && screen_mouse_x < desktop_item.x+desktop_item.w && screen_mouse_y < desktop_item.y+desktop_item.h
      if (is_hovered) {
        screen_hovered_desktop_item = desktop_item
        
        if (has_clicked) {
          has_clicked_desktop = false
          if (!desktop_item.last_click_time || prev_timestamp - desktop_item.last_click_time > 500) {
            desktop_item.last_click_time = prev_timestamp
            screen_selected_item = desktop_item
          }
          else {
            // Double clicked
            if (desktop_item.txt == '3d') {
              camera_ry_target = Math.PI/2 - 1*Math.PI/7
              camera_tx_target = 4.4*Math.sin(camera_ry_target)
              camera_ty_target = 0
              camera_tz_target = -0.5+4.4*Math.cos(camera_ry_target)
              camera_animation_tween = 0
            }
            else if (desktop_item.txt == 'Painting') {
              screen_explorer_item_set = screen_explorer_item_sets.painting
              screen_explorer_title = "/Desktop/Painting"
            }
            else if (desktop_item.txt == 'Animation') {
              screen_explorer_item_set = screen_explorer_item_sets.animation
              screen_explorer_title = "/Desktop/Animation"
            }
            else if (desktop_item.txt == 'contact') {
              window.location.href = "mailto:mail@example.org";
            }
          }
        }
      }
    }

    if (has_clicked_desktop) {
      screen_selected_item = null
      camera_ry_target = Math.PI/2
      camera_tx_target = 0.78
      camera_ty_target = 0.020
      camera_tz_target = -0.004
      camera_animation_tween = 0
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
  table_obj: '/obj/table.obj',
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
  sky_png: '/img/sky.png',
  sky_px_png: '/img/px.png',
  sky_nx_png: '/img/nx.png',
  sky_py_png: '/img/py.png',
  sky_ny_png: '/img/ny.png',
  sky_pz_png: '/img/pz.png',
  sky_nz_png: '/img/nx.png',
  folder_png: '/img/folder.png',
  wizard_png: '/img/wizard.png',
  snake_png: '/img/snake.png',
  window_frame_t_l_png: '/img/window_frame_t_l.png',
  window_frame_t_r_png: '/img/window_frame_t_r.png',
  window_frame_b_l_png: '/img/window_frame_b_l.png',
  window_frame_b_r_png: '/img/window_frame_b_r.png',
  window_frame_t_png: '/img/window_frame_t.png',
  window_frame_r_png: '/img/window_frame_r.png',
  window_frame_b_png: '/img/window_frame_b.png',
  window_frame_l_png: '/img/window_frame_l.png',
}

const model_buffers = {}
const assets = {}
const images = {}

function main () {
  init_canvas(screen_pixel_width, screen_pixel_height)
  camera_update_perspective(screen_pixel_width, screen_pixel_height)

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
  model_buffers.table = load_obj(gl, assets.table_obj)

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

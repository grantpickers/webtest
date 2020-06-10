/********************

Hey grant,

Here's some webgl stuff for you to play with.
The code is split up like this:
1. asset_urls and image_urls are URLs of OBJ files, image files, and shader files that will be downloaded into the page.
2. Application specific variables and updating logic: Currently all this app does is rotate a camera!
3. Rendering. Currently just renders a screen. See the render_screen() comments.
4. The "main" function:
   - Loads the GPU with your model data and textures
   - Compiles the shaders and gives you control of the shader parameters
   - And finally starts the 60fps main_loop that updates and renders and updates and renders etc.

Run a server from the terminal with:
python3 -m http.server
and go to http://localhost:8000

To get your feet wet:
- Replace /img/screen.png
- Replace /obj/screen.obj
- Change camera_translation and camera_rotation
- Add an object
  - add to asset_urls
  - create render_another_object() using render_screen() as a template
  - add render_another_object() to the render() function
  - load the object to the GPU in main() by copying the line for loading the screen to the GPU
- Edit the basic shader (/shaders/basic.frag and /shaders/basic.vert)
- Add a shader

GOODLUCKHAVEFUN!

Harry

*********************/


/*
 *
 * Declare OBJ, shaders and textures
 *
 */

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
  screen_png: '/img/screen.png',
}




const assets = {}
const images = {}
const models = {}
const model_buffers = {}
let canvas = document.createElement('canvas')
let gl = canvas.getContext('webgl')
let prev_timestamp = null
let total_time = 0
const TARGET_FRAME_TIME = 1000/60

// basic shader
let basic_shader_program = null
let basic_a_pos = null
let basic_a_normal = null
let basic_a_uv = null
let basic_u_model_view_matrix = null
let basic_u_perspective_matrix = null
let basic_u_sampler = null

// plain shader
let plain_shader_program = null
let plain_a_pos = null
let plain_a_normal = null
let plain_u_model_view_matrix = null
let plain_u_perspective_matrix = null


let model_view_matrix = new Float32Array(16)
let inverse_model_view_matrix = new Float32Array(16)


/*
 *
 * Application variables
 *
 */
let frame = 0

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
const inverse_camera_translation = new Float32Array([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
])
const inverse_camera_rotation = new Float32Array([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
])
let perspective_matrix = new Float32Array(16)
let inverse_perspective_matrix = new Float32Array(16)


let pick_ray = new Float32Array(4)
const PICK_DEPTH = 10
const PICK_STEP = 0.1
const pick_p = new Float32Array([0, 0, 0, 1])

let mouse_x = 0
let mouse_y = 0
let has_clicked = false
let has_resized = true
const screen_canvas = document.createElement('canvas')
let screen_ctx = screen_canvas.getContext('2d')

const ROTATION_Y_HALF_PI = new Float32Array([
  0, 0, 1, 0,
  0, 1, 0, 0,
  -1, 0, 0, 0,
  0, 0, 0, 1
])

const ROTATION_X_PI = new Float32Array([
  1, 0, 0, 0,
  0, -1, 0, 0,
  0, 0, -1, 0,
  0, 0, 0, 1
])

function create_inverse_translation_matrix (t) {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    -t[0], -t[1], -t[2], 1
  ])
}

const camera_0 = new Float32Array(3)
const screen_0 = new Float32Array([0.060993, -1.000000, 1.948891])
const screen_h = new Float32Array([0.060993, 1.000000, 1.948891])
const screen_v = new Float32Array([0.060993, -1.000000, -1.948891])
let screen_n = new Float32Array(16)
function init_screen_normal() {
  const t0 = new Float32Array(3)
  const t1 = new Float32Array(3)
  cross3(screen_n, sub3(t0, screen_v, screen_0), sub3(t1, screen_h, screen_0))
}
init_screen_normal()
const inverse_screen_translation = create_inverse_translation_matrix(screen_h)
const inverse_screen_rotation = new Float32Array(16)
matrix_mult_4(inverse_screen_rotation, ROTATION_X_PI, ROTATION_Y_HALF_PI)
const inverse_screen_scale = new Float32Array([
  1920/(2*1.948891), 0, 0, 0,
  0, 1080/2, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
])

// temp0 is useful for not creating temp memory for use with vector.js. Maybe make temp0-16?
const temp0 = new Float32Array(3)

// Screen UI
const buttons = [
  {
    x: 150,
    y: 100,
    w: 500,
    h: 100,
    txt: "3D WORKS",
    page: 'works',
  },
  {
    x: 150,
    y: 240,
    w: 500,
    h: 100,
    txt: "ABOUT",
    page: 'about',
  },
  {
    x: 150,
    y: 380,
    w: 500,
    h: 100,
    txt: "CONTACT",
    page: 'contact',
  },
]
const button_bg = '#eee'
const button_fg = '#00f'
const button_hover_bg = '#aaa'
const button_hover_fg = '#00f'
const button_active_bg = '#000'
const button_active_fg = '#fff'
const pages = {
  'works': [
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
let current_page = pages.about

// Camera

let ry_target = Math.PI/2
let tx_target = -2.4
let ty_target = 0
let tz_target = 0
let ry = ry_target
let tx = tx_target
let ty = ty_target
let tz = tz_target
let animation_tween = 1


for (let i=0; i<buttons.length; i++) {
  const b = buttons[i]
  const keys = Object.keys(pages)
  for (let j=0; j<keys.length; j++) {
    const k = keys[j]
    if (b.page == k) {
      b.page = pages[k]
    }
  }
}



function update_pick () {
  pick_ray[0] = 2 * mouse_x / canvas.width - 1
  pick_ray[1] = -2 * mouse_y / canvas.height + 1
  pick_ray[2] = -1
  pick_ray[3] = 1

  matrix_mult_4(inverse_model_view_matrix, inverse_camera_rotation, inverse_camera_translation)
  matrix_operate_4(inverse_perspective_matrix, pick_ray)
  pick_ray[3] = 0
  matrix_operate_4(inverse_model_view_matrix, pick_ray)

  const denom = dot3(pick_ray, screen_n)
  if (denom != 0) {
    camera_0[0] = -camera_translation[12]
    camera_0[1] = -camera_translation[13]
    camera_0[2] = -camera_translation[14]
    const t = dot3(screen_n, sub3(temp0, screen_0, camera_0)) / denom
    sum3(pick_p, camera_0, scl3(temp0, t, pick_ray))
    matrix_operate_4(inverse_screen_translation, pick_p)
    matrix_operate_4(inverse_screen_rotation, pick_p)
    matrix_operate_4(inverse_screen_scale, pick_p)
  }
}

function update () {
  /*
   * Update stuff at 60fps
   */
  if (has_resized) {
    canvas.width = window.devicePixelRatio * canvas.offsetWidth
    canvas.height = 9/16*canvas.width
    gl.viewport(0, 0, canvas.width, canvas.height)
    reset_perspective_matrices()
    gl.useProgram(basic_shader_program)
    gl.uniformMatrix4fv(basic_u_perspective_matrix, false, perspective_matrix)
    gl.useProgram(plain_shader_program)
    gl.uniformMatrix4fv(plain_u_perspective_matrix, false, perspective_matrix)
  }


  update_pick()



  if (animation_tween < 1) {
    animation_tween += 0.005
  }

  //const ry = 0.7*Math.sin(frame*0.01)+1.5


  const previous_page = current_page

  const screen_mouse_x = pick_p[0]
  const screen_mouse_y = pick_p[1]
  for (let i=0; i<buttons.length; i++) {
    const b = buttons[i]
    const is_hovered = screen_mouse_x > b.x && screen_mouse_y > b.y && screen_mouse_x < b.x+b.w && screen_mouse_y < b.y+b.h
    b.is_hovered = is_hovered
    if (is_hovered && has_clicked) {
      current_page = b.page
      if ((current_page !== previous_page) && current_page == pages.works) {
        ry_target = Math.PI/2 - 1*Math.PI/7
        tx_target = -6.4*Math.sin(ry_target)
        ty_target = 0
        tz_target = -6.4*Math.cos(ry_target)
        animation_tween = 0
      }
    }
  }

  ry = animation_tween * (ry_target) + (1-animation_tween) * ry
  tx = animation_tween * (tx_target) + (1-animation_tween) * tx
  ty = animation_tween * (ty_target) + (1-animation_tween) * ty
  tz = animation_tween * (tz_target) + (1-animation_tween) * tz



  camera_translation[12] = tx
  camera_translation[13] = ty
  camera_translation[14] = tz

  camera_rotation[0] = Math.cos(ry)
  camera_rotation[2] = Math.sin(ry)
  camera_rotation[8] = -Math.sin(ry)
  camera_rotation[10] = Math.cos(ry)

  matrix_mult_4(model_view_matrix, camera_rotation, camera_translation)

  matrix_transpose_4(inverse_camera_rotation, camera_rotation)

  inverse_camera_translation[12] = -tx
  inverse_camera_translation[13] = -ty
  inverse_camera_translation[14] = -tz



  has_clicked = false
  has_resized = false
  frame = frame + 1
}


/*
 * Use this as a template for rendering things.
 * 1. Choose the shader
 * 2. Send the shader the camera matrix and screen texture
 * 3. Send the shader the vertex indices, and draw
 */
function render_screen () {
  screen_ctx.clearRect(0, 0, screen_canvas.width, screen_canvas.height)
  screen_ctx.fillStyle = "#fff"
  screen_ctx.fillRect(0, 0, screen_canvas.width, screen_canvas.height)

  screen_ctx.font = "bold 20px Arial"
  for (let i=0; i<buttons.length; i++) {
    const b = buttons[i]
    //let is_hover = (screen_mouse_x > b.x && screen_mouse_y > b.y && screen_mouse_x < b.x+b.w && screen_mouse_y < b.y+b.h)
    let bg, fg
    if (b.page == current_page) {
      bg = button_active_bg
      fg = button_active_fg
    }
    else if (b.is_hovered) {
      bg = button_hover_bg
      fg = button_hover_fg
    }
    else {
      bg = button_bg
      fg = button_fg
    }

    screen_ctx.fillStyle = bg
    screen_ctx.fillRect(b.x,b.y,b.w,b.h)

    screen_ctx.fillStyle = fg
    screen_ctx.fillText(b.txt, b.x+20, b.y+80)
  }

  screen_ctx.fillStyle = '#222'
  screen_ctx.font = "bold 600px Arial"
  screen_ctx.fillText('G', 1400, 580)

  screen_ctx.font = "100 20px Arial"
  for (let i=0; i<current_page.length; i++) {
    screen_ctx.fillText(current_page[i], 700, 280+30*i)
  }

  //screen_ctx.drawImage(images.screen_png, 500, 400, 960, 540)
  gl.useProgram(basic_shader_program)


  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.screen.vertices)
  gl.enableVertexAttribArray(basic_a_pos)
  gl.vertexAttribPointer(basic_a_pos, 3, gl.FLOAT, false, 0, 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.screen.normals)
  gl.enableVertexAttribArray(basic_a_normal)
  gl.vertexAttribPointer(basic_a_normal, 3, gl.FLOAT, false, 0, 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.screen.uvs)
  gl.vertexAttribPointer(basic_a_uv, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(basic_a_uv)


  gl.activeTexture(gl.TEXTURE0 + model_buffers.screen.texture_id)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, screen_canvas)
  gl.uniform1i(basic_u_sampler, model_buffers.screen.texture_id)

  gl.uniformMatrix4fv(basic_u_model_view_matrix, false, model_view_matrix)


  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model_buffers.screen.indices)
  gl.drawElements(gl.TRIANGLES, model_buffers.screen.num_indices, gl.UNSIGNED_SHORT, 0)
}

function render_cube () {
  gl.useProgram(plain_shader_program)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.cube.vertices)
  gl.enableVertexAttribArray(plain_a_pos)
  gl.vertexAttribPointer(plain_a_pos, 3, gl.FLOAT, false, 0, 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.cube.normals)
  gl.enableVertexAttribArray(plain_a_normal)
  gl.vertexAttribPointer(plain_a_normal, 3, gl.FLOAT, false, 0, 0)

  gl.uniformMatrix4fv(plain_u_model_view_matrix, false, model_view_matrix)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model_buffers.cube.indices)
  gl.drawElements(gl.TRIANGLES, model_buffers.cube.num_indices, gl.UNSIGNED_SHORT, 0)
}

function render_monkey () {
  gl.useProgram(plain_shader_program)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.monkey.vertices)
  gl.enableVertexAttribArray(plain_a_pos)
  gl.vertexAttribPointer(plain_a_pos, 3, gl.FLOAT, false, 0, 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.monkey.normals)
  gl.enableVertexAttribArray(plain_a_normal)
  gl.vertexAttribPointer(plain_a_normal, 3, gl.FLOAT, false, 0, 0)

  gl.uniformMatrix4fv(plain_u_model_view_matrix, false, model_view_matrix)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model_buffers.monkey.indices)
  gl.drawElements(gl.TRIANGLES, model_buffers.monkey.num_indices, gl.UNSIGNED_SHORT, 0)
}

function render () {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)


  render_screen()
  render_cube()
  render_monkey()
}

function reset_perspective_matrices () {
  const aspect = canvas.width / canvas.height
  const fov = Math.PI/4
  const near = 1
  const far = 50
  const pa = 1/Math.tan(fov/2)/aspect
  const pb = 1/Math.tan(fov/2)
  const pc = (near + far)/(near - far)
  const pd = -1
  const pe = 2*near*far/(near - far)

  perspective_matrix[0] = pa
  perspective_matrix[5] = pb
  perspective_matrix[10] = pc
  perspective_matrix[11] = pd
  perspective_matrix[14] = pe

  inverse_perspective_matrix[0] = 1/pa
  inverse_perspective_matrix[5] = 1/pb
  inverse_perspective_matrix[11] = 1/pe
  inverse_perspective_matrix[14] = 1/pd
  inverse_perspective_matrix[15] = -pc/(pd*pe)
}


function init_gl () {
  document.body.appendChild(canvas)
  canvas.width = window.devicePixelRatio * canvas.offsetWidth
  canvas.height = 9/16*canvas.width
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(0,0,0,1)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)
  gl.cullFace(gl.BACK)
}

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


function main () {
  init_gl(canvas, gl)

  screen_canvas.width = 1920
  screen_canvas.height = 1080
  reset_perspective_matrices()

  /*
   *
   * Load OBJ and textures onto the GPU
   *
   */

  model_buffers.screen = load_obj(gl, assets.screen_obj)
  model_buffers.screen.texture_id = 0
  model_buffers.screen.texture = load_texture(gl, screen_ctx.canvas, model_buffers.screen.texture_id)

  model_buffers.cube = load_obj(gl, assets.cube_obj)

  model_buffers.monkey = load_obj(gl, assets.monkey_obj)


  /*
   *
   * Compile shaders and get control of shader variables
   *
   */

  basic_shader_program = create_shader_program(gl, assets.basic_vertex, assets.basic_fragment)
  gl.useProgram(basic_shader_program)
  basic_a_pos    = gl.getAttribLocation(basic_shader_program, 'a_pos')
  basic_a_normal = gl.getAttribLocation(basic_shader_program, 'a_normal')
  basic_a_uv     = gl.getAttribLocation(basic_shader_program, 'a_uv')
  basic_u_model_view_matrix  = gl.getUniformLocation(basic_shader_program, 'u_model_view_matrix')
  basic_u_sampler            = gl.getUniformLocation(basic_shader_program, 'u_sampler')
  basic_u_perspective_matrix = gl.getUniformLocation(basic_shader_program, 'u_perspective_matrix')
  gl.uniformMatrix4fv(basic_u_perspective_matrix, false, perspective_matrix)


  plain_shader_program = create_shader_program(gl, assets.plain_vertex, assets.plain_fragment)
  gl.useProgram(plain_shader_program)
  plain_a_pos = gl.getAttribLocation(plain_shader_program, 'a_pos')
  plain_a_normal = gl.getAttribLocation(plain_shader_program, 'a_normal')
  plain_a_uv     = gl.getAttribLocation(plain_shader_program, 'a_uv')
  plain_u_model_view_matrix  = gl.getUniformLocation(plain_shader_program, 'u_model_view_matrix')
  plain_u_perspective_matrix = gl.getUniformLocation(plain_shader_program, 'u_perspective_matrix')
  gl.uniformMatrix4fv(plain_u_perspective_matrix, false, perspective_matrix)




  window.addEventListener('resize', function (e) { has_resized = true })
  canvas.addEventListener('mousemove', function (e) { mouse_x = e.offsetX; mouse_y = e.offsetY })
  canvas.addEventListener('click', function (e) { has_clicked = true })

  window.requestAnimationFrame(main_loop)
}

load_assets(asset_urls, assets, () => { load_images(image_urls, images, main) })

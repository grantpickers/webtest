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
  basic_vertex: '/shaders/basic.vert',
  basic_fragment: '/shaders/basic.frag',
}

const image_urls = {
  screen_png: '/img/screen.png',
}




const assets = {}
const images = {}
const models = {}
const model_buffers = {}
let canvas = null
let gl = null
let prev_timestamp = null
let total_time = 0
const TARGET_FRAME_TIME = 1000/60
let basic_shader_program = null
let basic_a_pos = null
let basic_a_normal = null
let basic_a_uv = null
let basic_u_model_view_matrix = null
let basic_u_perspective_matrix = null
let basic_u_sampler = null
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
let inverse_perspective_matrix = null
let pick_ray = new Float32Array(4)
let mouse_x = 0
const PICK_DEPTH = 10
const PICK_STEP = 0.1
let mouse_y = 0
let has_clicked = false
let screen_canvas = null
let screen_ctx = null

function cross3 (a,b) { return new Float32Array([(a[1]*b[2])-(a[2]*b[1]), -((a[0]*b[2])-(a[2]*b[0])), (a[0]*b[1])-(a[1]*b[0])]) }
function sub3 (a,b) { return new Float32Array([a[0]-b[0], a[1]-b[1], a[2]-b[2]]) }
function sum3 (a,b) { return new Float32Array([a[0]+b[0], a[1]+b[1], a[2]+b[2]]) }
function dot3 (a,b) { return a[0]*b[0] + a[1]*b[1] + a[2]*b[2] }
function scale3 (c,v) { return new Float32Array([c*v[0], c*v[1], c*v[2]]) }

function create_rotation_x_pi () {
  // TODO: lol just calculate this
  const rx = Math.PI

  const m = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ])

  m[5] = Math.cos(rx)
  m[6] = -Math.sin(rx)
  m[9] = Math.sin(rx)
  m[10] = Math.cos(rx)

  return m
}

function create_rotation_y_half_pi () {
  // TODO: lol just calculate this
  // TODO: oh shit our RY matrices haven't been column/row major
  const ry = Math.PI/2

  const m = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ])

  m[0] = Math.cos(ry)
  m[2] = Math.sin(ry)
  m[8] = -Math.sin(ry)
  m[10] = Math.cos(ry)

  return m
}

function create_inverse_translation_matrix (t) {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    -t[0], -t[1], -t[2], 1
  ])
}

const screen_0 = new Float32Array([0.060993, -1.000000, 1.948891])
const screen_h = new Float32Array([0.060993, 1.000000, 1.948891])
const screen_v = new Float32Array([0.060993, -1.000000, -1.948891])
const screen_n = cross3(sub3(screen_v, screen_0), sub3(screen_h, screen_0))
const inverse_screen_translation = create_inverse_translation_matrix(screen_h)
//const inverse_screen_rotation = create_rotation_y_half_pi()
const inverse_screen_rotation = new Float32Array(16)
matrix_mult_4(inverse_screen_rotation, create_rotation_x_pi(), create_rotation_y_half_pi())
const inverse_screen_scale = new Float32Array([
  1920/(2*1.948891), 0, 0, 0,
  0, 1080/2, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
])
//const inverse_screen_model_to_world = new Float32Array(16)
const camera_0 = new Float32Array(3)

const p_ = new Float32Array([0, 0, 0, 1])


function update () {
  /*
   * Update stuff at 60fps
   */
  if (has_clicked) {
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
      const t = dot3(screen_n, sub3(screen_0, camera_0)) / denom
      const p = sum3(camera_0, scale3(t, pick_ray))
      //console.log(p)

      // TODO: make vector operations not create data, so that we can operate on a 4-dim p. (instead of butchering it here:)
      // Or, maybe just make a constant global p_ but named well.
      p_[0] = p[0]
      p_[1] = p[1]
      p_[2] = p[2]
      //matrix_operate_4(inverse_screen_model_to_world, p_)
      matrix_operate_4(inverse_screen_translation, p_)
      matrix_operate_4(inverse_screen_rotation, p_)
      matrix_operate_4(inverse_screen_scale, p_)

      console.log('x: '+ p_[0]+', y: ' +p_[1]+' :)')
      //has_clicked = false
    }
  }

  const ry = 0.7*Math.sin(frame*0.01)+1.5
  const tx = -5*Math.sin(ry)
  const ty = 0
  const tz = -5*Math.cos(ry)

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
  screen_ctx.fillStyle = '#000'
  screen_ctx.fillRect(100,100,500,100)
  screen_ctx.fillStyle = '#f00'
  screen_ctx.font = "80px Arial"
  screen_ctx.fillText("Click here!!!?", 120, 180)
  screen_ctx.drawImage(images.screen_png, 500, 400, 960, 540)

  gl.activeTexture(gl.TEXTURE0 + model_buffers.screen.texture_id)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, screen_canvas)


  gl.useProgram(basic_shader_program)

  gl.uniformMatrix4fv(basic_u_model_view_matrix, false, model_view_matrix)
  gl.uniform1i(basic_u_sampler, model_buffers.screen.texture_id)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model_buffers.screen.indices)
  gl.drawElements(gl.TRIANGLES, model_buffers.screen.num_indices, gl.UNSIGNED_SHORT, 0)
}


function render () {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  render_screen()
  // render_chair()
  // render_window()
  // render_spider()
  // render_lady()
}

function reset_perspective_matrices () {
  const aspect = window.innerWidth / window.innerHeight
  const fov = Math.PI/4
  const near = 1
  const far = 50
  const pa = 1/Math.tan(fov/2)/aspect
  const pb = 1/Math.tan(fov/2)
  const pc = (near + far)/(near - far)
  const pd = -1
  const pe = 2*near*far/(near - far)
  perspective_matrix = new Float32Array([
    pa, 0, 0, 0,
    0, pb, 0, 0,
    0, 0, pc, pd,
    0, 0, pe, 0,
  ])
  gl.uniformMatrix4fv(basic_u_perspective_matrix, false, perspective_matrix)
  inverse_perspective_matrix = new Float32Array([
    1/pa, 0, 0, 0,
    0, 1/pb, 0, 0,
    0, 0, 0, 1/pe,
    0, 0, 1/pd, -pc/(pd*pe),
  ])
}


function init_gl () {
  canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  canvas.width = window.devicePixelRatio * window.innerWidth
  canvas.height = window.devicePixelRatio * window.innerHeight
  gl = canvas.getContext('webgl')
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


  screen_canvas = document.createElement('canvas')
  screen_canvas.width = 1920
  screen_canvas.height = 1080
  screen_ctx = screen_canvas.getContext('2d')

  window.addEventListener('resize', function (e) {
    canvas.width = window.devicePixelRatio * window.innerWidth
    canvas.height = window.devicePixelRatio * window.innerHeight
    gl.viewport(0, 0, canvas.width, canvas.height)
    reset_perspective_matrices()
  })
 
  canvas.addEventListener('mousemove', function (e) {
    mouse_x = e.clientX
    mouse_y = e.clientY
  })

  canvas.addEventListener('click', function (e) {
    has_clicked = true
  })

  /*
   *
   * Load OBJ and textures onto the GPU
   *
   */

  model_buffers.screen = load_obj(gl, assets.screen_obj)
  //model_buffers.screen.texture_id = load_texture(gl, images.screen_png)
  model_buffers.screen.texture_id = 0
  model_buffers.screen.texture = load_texture(gl, screen_ctx.canvas, model_buffers.screen.texture_id)


  /*
   *
   * Compile shaders and get control of shader variables
   *
   */

  basic_shader_program = create_shader_program(gl, assets.basic_vertex, assets.basic_fragment)
  gl.useProgram(basic_shader_program)

  basic_a_pos = gl.getAttribLocation(basic_shader_program, 'a_pos')
  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.screen.vertices)
  gl.enableVertexAttribArray(basic_a_pos)
  gl.vertexAttribPointer(basic_a_pos, 3, gl.FLOAT, false, 0, 0)

  basic_a_normal = gl.getAttribLocation(basic_shader_program, 'a_normal')
  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.screen.normals)
  gl.enableVertexAttribArray(basic_a_normal)
  gl.vertexAttribPointer(basic_a_normal, 3, gl.FLOAT, false, 0, 0)

  basic_a_uv = gl.getAttribLocation(basic_shader_program, 'a_uv')
  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.screen.uvs)
  gl.vertexAttribPointer(basic_a_uv, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(basic_a_uv)

  basic_u_model_view_matrix = gl.getUniformLocation(basic_shader_program, 'u_model_view_matrix')
  basic_u_sampler = gl.getUniformLocation(basic_shader_program, 'u_sampler')

  basic_u_perspective_matrix = gl.getUniformLocation(basic_shader_program, 'u_perspective_matrix')

  reset_perspective_matrices()



  window.requestAnimationFrame(main_loop)
}

load_assets(asset_urls, assets, () => { load_images(image_urls, images, main) })

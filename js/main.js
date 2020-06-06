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
let basic_u_projection_matrix = null
let basic_u_sampler = null


/*
 *
 * Application variables
 *
 */
let camera_rotation_y = 0
const camera_translation = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, -4, 1,
]
const camera_rotation = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
]


function update () {
  /*
   * Update stuff at 60fps
   */
  camera_rotation_y = camera_rotation_y + 0.01
  camera_rotation[0] = Math.cos(camera_rotation_y)
  camera_rotation[2] = Math.sin(camera_rotation_y)
  camera_rotation[8] = -Math.sin(camera_rotation_y)
  camera_rotation[10] = Math.cos(camera_rotation_y)
}


/*
 * Use this as a template for rendering things.
 * 1. Choose the shader
 * 2. Send the shader the camera matrix and screen texture
 * 3. Send the shader the vertex indices, and draw
 */
function render_screen () {
  gl.useProgram(basic_shader_program)

  gl.uniformMatrix4fv(basic_u_model_view_matrix, false, matrix_mult_4(camera_translation, camera_rotation))
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


function init_gl () {
  canvas = document.createElement('canvas')
  document.body.appendChild(canvas)
  canvas.width = window.devicePixelRatio * window.innerWidth
  canvas.height = window.devicePixelRatio * window.innerHeight
  gl = canvas.getContext('webgl')
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
  while (total_time >= TARGET_FRAME_TIME) {
    update()
    render()
    total_time -= TARGET_FRAME_TIME
  }
  window.requestAnimationFrame(main_loop)
}


function main () {
  init_gl(canvas, gl)


  /*
   *
   * Load OBJ and textures onto the GPU
   *
   */

  model_buffers.screen = load_obj(gl, assets.screen_obj)
  model_buffers.screen.texture_id = load_texture(gl, images.screen_png)


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

  basic_u_projection_matrix = gl.getUniformLocation(basic_shader_program, 'u_projection_matrix')
  const aspect = window.innerWidth / window.innerHeight
  const fov = Math.PI/4
  const near = 1
  const far = 50
  gl.uniformMatrix4fv(basic_u_projection_matrix, false, new Float32Array([
    1/Math.tan(fov/2)/aspect, 0, 0, 0,
    0, 1/Math.tan(fov/2), 0, 0,
    0, 0, (near + far)/(near - far), -1,
    0, 0, 2*near*far/(near - far), 0,
  ]))


  window.requestAnimationFrame(main_loop)
}

load_assets(asset_urls, assets, () => { load_images(image_urls, images, main) })

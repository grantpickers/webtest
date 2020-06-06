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
let basic_u_model_view_matrix = null
let basic_u_sampler = null


let ry = 0
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
  ry += 0.01

  camera_rotation[0] = Math.cos(ry)
  camera_rotation[2] = Math.sin(ry)
  camera_rotation[8] = -Math.sin(ry)
  camera_rotation[10] = Math.cos(ry)
}

function render () {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  gl.useProgram(basic_shader_program)

  gl.uniformMatrix4fv(basic_u_model_view_matrix, false, matrix_mult_4(camera_translation, camera_rotation))

  const keys = Object.keys(model_buffers)
  for (let i=0; i<keys.length; i++) {
    const k = keys[i]
    gl.uniform1i(basic_u_sampler, model_buffers[k].texture_id)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model_buffers[k].indices)
    gl.drawElements(gl.TRIANGLES, model_buffers[k].num_indices, gl.UNSIGNED_SHORT, 0)
  }
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
   * Load OBJ and textures
   *
   */

  model_buffers.screen = load_obj(gl, assets.screen_obj)
  model_buffers.screen.texture_id = load_texture(gl, images.screen_png)


  /*
   *
   * Initialise shaders
   *
   */

  basic_shader_program = create_shader_program(gl, assets.basic_vertex, assets.basic_fragment)

  gl.useProgram(basic_shader_program)

  const basic_a_pos = gl.getAttribLocation(basic_shader_program, 'a_pos')
  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.screen.vertices)
  gl.enableVertexAttribArray(basic_a_pos)
  gl.vertexAttribPointer(basic_a_pos, 3, gl.FLOAT, false, 0, 0)

  const basic_a_normal = gl.getAttribLocation(basic_shader_program, 'a_normal')
  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.screen.normals)
  gl.enableVertexAttribArray(basic_a_normal)
  gl.vertexAttribPointer(basic_a_normal, 3, gl.FLOAT, false, 0, 0)

  const basic_a_uv = gl.getAttribLocation(basic_shader_program, 'a_uv')
  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.screen.uvs)
  gl.vertexAttribPointer(basic_a_uv, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(basic_a_uv)

  basic_u_model_view_matrix = gl.getUniformLocation(basic_shader_program, 'u_model_view_matrix')
  basic_u_sampler = gl.getUniformLocation(basic_shader_program, 'u_sampler')

  const basic_u_projection_matrix = gl.getUniformLocation(basic_shader_program, 'u_projection_matrix')
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

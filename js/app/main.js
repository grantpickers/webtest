const assets = {}
const asset_urls = {
  screen_obj: '/obj/screen.obj',
  cube_obj: '/obj/cube.obj',
  monkey_obj: '/obj/monkey.obj',
  basic_vertex: '/shaders/basic.vert',
  basic_fragment: '/shaders/basic.frag',
  plain_vertex: '/shaders/plain.vert',
  plain_fragment: '/shaders/plain.frag',
}

const images = {}
const image_urls = {
  screen_png: '/img/screen.png',
}

const model_buffers = {}


function main () {
  init()
  update_perspective(camera_perspective_matrix, camera_inverse_perspective_matrix)

  // Load OBJ and textures
  model_buffers.cube = load_obj(gl, assets.cube_obj)
  model_buffers.monkey = load_obj(gl, assets.monkey_obj)
  model_buffers.screen = load_obj(gl, assets.screen_obj)
  model_buffers.screen.texture_id = 0
  model_buffers.screen.texture = load_texture(gl, screen_ctx.canvas, model_buffers.screen.texture_id)

  // Shaders
  compile_basic_shader()
  compile_plain_shader()

  window.requestAnimationFrame(main_loop)
}

load_assets(asset_urls, assets, () => { load_images(image_urls, images, main) })

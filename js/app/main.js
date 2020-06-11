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

  camera_update_perspective()

  camera_ry_target = Math.PI/2
  camera_tx_target = -0.92
  camera_ty_target = 0
  camera_tz_target = 0




  // Load OBJ and textures

  model_buffers.cube = load_obj(gl, assets.cube_obj)

  model_buffers.monkey = load_obj(gl, assets.monkey_obj)

  model_buffers.screen = load_obj(gl, assets.screen_obj)
  model_buffers.screen.texture_id = 0
  model_buffers.screen.texture = load_texture(gl, screen_ctx.canvas, model_buffers.screen.texture_id)


  // Shaders

  compile_shaders()


  window.requestAnimationFrame(main_loop)
}

load_assets(asset_urls, assets, () => { load_images(image_urls, images, main) })

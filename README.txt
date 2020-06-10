Add object
----------
1. Put the .obj file in obj/
2. js/app/main.js: Add the path to asset_urls
3. js/app/main.js: Load the .obj data in main() 
4. js/app/render.js: Add a render_thing() call in render()


Add shader
----------
1. Put the shader .frag and .vert in shaders/
2. js/app/main.js: Add the paths to asset_urls
3. js/app/shaders.js: Add a compile_some_shader() call in compile_shaders()
4. js/app/render.js: Use the shader in a renderer


3D screen canvas
----------------
js/app/screen.js: Add UI like buttons pages with text
js/app/render.js: Edit render_screen()


Add Application code
----------------
1. index.html: Add js/app/mything.js to the includes
2. js/app/mything.js: Create data for your thing
3. js/app/update.js: Add update_mything() call to update()


JS File list
------------

app/
  main.js
  update.js
  render.js
  shaders.js
  screen.js

engine/
  init.js
  main_loop.js
  pick.js
  camera.js

lib/
  load_obj.js
  load_texture.js
  load_assets.js
  load_images.js
  create_shader_program.js
  matrix_4.js
  vector.js

JS structure
------------

You should change stuff in grant.js and render.js.

/grant.js:
  Cube
  Screen
  Shaders
    basic
    plain
  Update
    handle_resize
    update_pick
    update_cube
    update_screen
    update_camera
  Main

/render.js
  render_screen
  render_cube
  render_monkey

Probably don't change stuff in engine.js and lib.js.

/engine.js:
  Pick
  Camera
  Canvas
  Main Loop

/lib.js:
  Vector
  Matrix
  Loaders
  Create Shader Program


Add object
----------
1. Put the .obj file in obj/
2. js/grant.js: Add the file path in asset_urls
3. js/grant.js: Load the .obj data in main() 
4. js/render.js: Add a render_thing() call in render()


Add shader
----------
1. Put the shader .frag and .vert in shaders/
2. js/grant.js: Add the paths to asset_urls
3. js/grant.js: Add a compile_some_shader() call in main()
4. js/render.js: Use the shader in a renderer


Add variable to frag shader
---------------------------

1. Declare and use the variable in the frag shader
shaders/theshader.frag: 
  varying lowp float hello;

2. Give js access to the variable, and tell the GPU to send the variable to the frag shader, and set the hello output to the hello input
shaders/theshader.vert: 
    uniform ...
    uniform ...
    uniform float u_hello;

    varying ...
    varying ...
    varying lowp float u_hello; 

    main () {
      ...
      ...
      hello = u_hello;
    }

4. Store the GPU memory location the variable
js/grant.js (Shaders section):
  let theshader_u_hello = null
  theshader_u_hello = gl.getUniformLocation(theshader_shader_program, 'u_hello')'

5. Set the variable
js/render.js:
  gl.uniform1f(theshader_u_hello, 0.5)

3D screen canvas
----------------
js/grant.js: Add UI like buttons pages with text
js/render.js: Edit render_screen()


Make shit happen
----------------
1. js/grant.js: Add a update_something() call in update()
2. js/grant.js: Declare and set data for your thing at the top of the file

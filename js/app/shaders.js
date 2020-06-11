function compile_shaders () {
  compile_basic_shader()
  compile_plain_shader()
}

// Basic Shader

let basic_shader_program = null
let basic_a_pos = null
let basic_a_normal = null
let basic_a_uv = null
let basic_u_world_view_matrix = null
let basic_u_perspective_matrix = null
let basic_u_sampler = null
function compile_basic_shader () {
  basic_shader_program = create_shader_program(gl, assets.basic_vertex, assets.basic_fragment)
  gl.useProgram(basic_shader_program)
  basic_a_pos    = gl.getAttribLocation(basic_shader_program, 'a_pos')
  basic_a_normal = gl.getAttribLocation(basic_shader_program, 'a_normal')
  basic_a_uv     = gl.getAttribLocation(basic_shader_program, 'a_uv')
  basic_u_world_view_matrix  = gl.getUniformLocation(basic_shader_program, 'u_world_view_matrix')
  basic_u_sampler            = gl.getUniformLocation(basic_shader_program, 'u_sampler')
  basic_u_perspective_matrix = gl.getUniformLocation(basic_shader_program, 'u_perspective_matrix')
  gl.uniformMatrix4fv(basic_u_perspective_matrix, false, camera_perspective_matrix)
}


// Plain Shader

let plain_shader_program = null
let plain_a_pos = null
let plain_a_normal = null
let plain_u_world_view_matrix = null
let plain_u_perspective_matrix = null
function compile_plain_shader () {
  plain_shader_program = create_shader_program(gl, assets.plain_vertex, assets.plain_fragment)
  gl.useProgram(plain_shader_program)
  plain_a_pos = gl.getAttribLocation(plain_shader_program, 'a_pos')
  plain_a_normal = gl.getAttribLocation(plain_shader_program, 'a_normal')
  plain_a_uv     = gl.getAttribLocation(plain_shader_program, 'a_uv')
  plain_u_world_view_matrix  = gl.getUniformLocation(plain_shader_program, 'u_world_view_matrix')
  plain_u_perspective_matrix = gl.getUniformLocation(plain_shader_program, 'u_perspective_matrix')
  gl.uniformMatrix4fv(plain_u_perspective_matrix, false, camera_perspective_matrix)
}


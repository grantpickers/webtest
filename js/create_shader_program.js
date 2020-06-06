function create_shader_program (gl, vert_source, frag_source) {
  const vert_shader = gl.createShader(gl.VERTEX_SHADER)
  const frag_shader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(vert_shader, vert_source)
  gl.shaderSource(frag_shader, frag_source)
  gl.compileShader(vert_shader)
  const info_log_vert = gl.getShaderInfoLog(vert_shader)
  if (info_log_vert) { console.log(info_log_vert) }
  gl.compileShader(frag_shader)
  const info_log_frag = gl.getShaderInfoLog(frag_shader)
  if (info_log_frag) { console.log(info_log_frag) }
  const program = gl.createProgram()
  gl.attachShader(program, vert_shader)
  gl.attachShader(program, frag_shader)
  gl.linkProgram(program)
  const info_log_link = gl.getProgramInfoLog(program)
  if (info_log_link) { console.log(info_log_link) }
  return program
}

function load_texture(gl, image) {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  if (!window.num_textures) {
    window.num_textures = 0
  }
  const texture_id = window.num_textures
  gl.activeTexture(gl.TEXTURE0 + texture_id)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  window.num_textures = window.num_textures + 1

  return texture_id
}

function init_model_buffers (gl, model) {
  const buffers = {
    vertices: gl.createBuffer(),
    indices: gl.createBuffer(),
    uvs: gl.createBuffer(),
    normals: gl.createBuffer(),
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices)
  gl.bufferData(gl.ARRAY_BUFFER, model.vertices, gl.STATIC_DRAW)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indices, gl.STATIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.uvs)
  gl.bufferData(gl.ARRAY_BUFFER, model.uvs, gl.STATIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normals)
  gl.bufferData(gl.ARRAY_BUFFER, model.normals, gl.STATIC_DRAW)

  return buffers
}

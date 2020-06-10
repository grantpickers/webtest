function render () {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  render_screen()
  render_cube()
  render_monkey()
}

function render_screen () {
  screen_ctx.clearRect(0, 0, screen_canvas.width, screen_canvas.height)
  screen_ctx.fillStyle = "#fff"
  screen_ctx.fillRect(0, 0, screen_canvas.width, screen_canvas.height)

  screen_ctx.font = "bold 20px Arial"
  for (let i=0; i<buttons.length; i++) {
    const b = buttons[i]
    let bg, fg
    if (b.page == current_page) {
      bg = button_active_bg
      fg = button_active_fg
    }
    else if (b.is_hovered) {
      bg = button_hover_bg
      fg = button_hover_fg
    }
    else {
      bg = button_bg
      fg = button_fg
    }

    screen_ctx.fillStyle = bg
    screen_ctx.fillRect(b.x,b.y,b.w,b.h)

    screen_ctx.fillStyle = fg
    screen_ctx.fillText(b.txt, b.x+20, b.y+80)
  }

  screen_ctx.fillStyle = '#222'
  screen_ctx.font = "bold 600px Arial"
  screen_ctx.fillText('G', 1400, 580)

  screen_ctx.font = "100 20px Arial"
  for (let i=0; i<current_page.length; i++) {
    screen_ctx.fillText(current_page[i], 700, 280+30*i)
  }

  gl.useProgram(basic_shader_program)


  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.screen.vertices)
  gl.enableVertexAttribArray(basic_a_pos)
  gl.vertexAttribPointer(basic_a_pos, 3, gl.FLOAT, false, 0, 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.screen.normals)
  gl.enableVertexAttribArray(basic_a_normal)
  gl.vertexAttribPointer(basic_a_normal, 3, gl.FLOAT, false, 0, 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.screen.uvs)
  gl.vertexAttribPointer(basic_a_uv, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(basic_a_uv)


  gl.activeTexture(gl.TEXTURE0 + model_buffers.screen.texture_id)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, screen_canvas)
  gl.uniform1i(basic_u_sampler, model_buffers.screen.texture_id)

  gl.uniformMatrix4fv(basic_u_model_view_matrix, false, camera_model_view_matrix)


  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model_buffers.screen.indices)
  gl.drawElements(gl.TRIANGLES, model_buffers.screen.num_indices, gl.UNSIGNED_SHORT, 0)
}

function render_cube () {
  gl.useProgram(plain_shader_program)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.cube.vertices)
  gl.enableVertexAttribArray(plain_a_pos)
  gl.vertexAttribPointer(plain_a_pos, 3, gl.FLOAT, false, 0, 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.cube.normals)
  gl.enableVertexAttribArray(plain_a_normal)
  gl.vertexAttribPointer(plain_a_normal, 3, gl.FLOAT, false, 0, 0)

  gl.uniformMatrix4fv(plain_u_model_view_matrix, false, camera_model_view_matrix)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model_buffers.cube.indices)
  gl.drawElements(gl.TRIANGLES, model_buffers.cube.num_indices, gl.UNSIGNED_SHORT, 0)
}

function render_monkey () {
  gl.useProgram(plain_shader_program)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.monkey.vertices)
  gl.enableVertexAttribArray(plain_a_pos)
  gl.vertexAttribPointer(plain_a_pos, 3, gl.FLOAT, false, 0, 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.monkey.normals)
  gl.enableVertexAttribArray(plain_a_normal)
  gl.vertexAttribPointer(plain_a_normal, 3, gl.FLOAT, false, 0, 0)

  gl.uniformMatrix4fv(plain_u_model_view_matrix, false, camera_model_view_matrix)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model_buffers.monkey.indices)
  gl.drawElements(gl.TRIANGLES, model_buffers.monkey.num_indices, gl.UNSIGNED_SHORT, 0)
}
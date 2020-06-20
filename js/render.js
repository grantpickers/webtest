function render () {
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  render_screen()
  render_welcometext()
  render_tower()
  render_table()
  render_sky()
}

function render_screen () {
  screen_ctx.clearRect(0, 0, screen_canvas.width, screen_canvas.height)
  screen_ctx.fillStyle = "#3a6fa6"
  screen_ctx.fillRect(0, 0, screen_canvas.width, screen_canvas.height)

  screen_ctx.font = "400 15px 'Helvetica Neue'"
  for (let i=0; i<screen_desktop_items.length; i++) {
    const desktop_item = screen_desktop_items[i]

    // Render icon
    screen_ctx.drawImage(images.folder_png, desktop_item.x + desktop_item.w*0.5 - 25, desktop_item.y, 48, 43)

    screen_ctx.textAlign = "center"

    if (desktop_item == screen_selected_desktop_item) {
      // Render selection
      screen_ctx.fillStyle = "#000080"
      const w = 8 + desktop_item.txt.length * 7
      screen_ctx.fillRect(desktop_item.x + (desktop_item.w - w)*0.5, desktop_item.y + desktop_item.h - 25+5, w, 26)

      screen_ctx.fillStyle = "#3a6fa644"
      screen_ctx.fillRect(desktop_item.x, desktop_item.y, desktop_item.w, desktop_item.h - 25);
    } else {
      // Render text shadow
      screen_ctx.strokeStyle = 'rgba(0,0,0,0.4)'
      screen_ctx.lineWidth = 3
      screen_ctx.strokeText(desktop_item.txt, desktop_item.x + 0.5*desktop_item.w, desktop_item.y + desktop_item.h)
    }

    screen_ctx.shadowBlur = 0;
    screen_ctx.fillStyle = "#fff"
    screen_ctx.fillText(desktop_item.txt, desktop_item.x + 0.5*desktop_item.w, desktop_item.y + desktop_item.h)
  }

  if (screen_explorer_item_set) {
    const win_x = 200
    const win_y = 250
    const win_w = 1200
    const win_h = 700
    screen_ctx.fillStyle = '#fff'
    screen_ctx.fillRect(win_x, win_y, win_w, win_h)
    screen_ctx.drawImage(images.window_frame_t_l_png, win_x, win_y, 5, 30)
    screen_ctx.drawImage(images.window_frame_t_r_png, win_x+win_w-26, win_y, 26, 30)
    screen_ctx.drawImage(images.window_frame_b_l_png, win_x, win_y+win_h-5, 5, 5)
    screen_ctx.drawImage(images.window_frame_b_r_png, win_x+win_w-5, win_y+win_h-5, 5, 5)
    screen_ctx.drawImage(images.window_frame_t_png, win_x+5, win_y, win_w-26-5, 30)
    screen_ctx.drawImage(images.window_frame_r_png, win_x+win_w-5, win_y+30, 5, win_h-30-5)
    screen_ctx.drawImage(images.window_frame_b_png, win_x+5, win_y+win_h-5, win_w-10, 5)
    screen_ctx.drawImage(images.window_frame_l_png, win_x, win_y+30, 5, win_h-30-5)

    for (let i=0; i<screen_explorer_item_set.length; i++) {
      const explorer_item = screen_explorer_item_set[i]

      // Render icon
      screen_ctx.drawImage(images.folder_png, explorer_item.x + explorer_item.w*0.5 - 25 + win_x, explorer_item.y + win_y, 48, 43)

      screen_ctx.textAlign = "center"

      if (explorer_item == screen_selected_explorer_item) {
        // Render selection
        screen_ctx.fillStyle = "#000080"
        const w = 8 + explorer_item.txt.length * 7
        screen_ctx.fillRect(explorer_item.x + (explorer_item.w - w)*0.5 + win_x, explorer_item.y + explorer_item.h - 25+5 + win_y, w, 26)

        screen_ctx.fillStyle = "#3a6fa644"
        screen_ctx.fillRect(explorer_item.x + win_x, explorer_item.y + win_y, explorer_item.w, explorer_item.h - 25);
      }

      screen_ctx.fillStyle = "#000"
      screen_ctx.fillText(explorer_item.txt, explorer_item.x + 0.5*explorer_item.w + win_x, explorer_item.y + explorer_item.h + win_y)
    }
  }

  // GL

  gl.useProgram(screen_shader_program)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.screen.vertices)
  gl.enableVertexAttribArray(screen_a_pos)
  gl.vertexAttribPointer(screen_a_pos, 3, gl.FLOAT, false, 0, 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.screen.normals)
  gl.enableVertexAttribArray(screen_a_normal)
  gl.vertexAttribPointer(screen_a_normal, 3, gl.FLOAT, false, 0, 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.screen.uvs)
  gl.vertexAttribPointer(screen_a_uv, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(screen_a_uv)

  gl.activeTexture(gl.TEXTURE0 + model_buffers.screen.texture_id)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, screen_canvas)
  gl.uniform1i(screen_u_sampler, model_buffers.screen.texture_id)

  gl.uniformMatrix4fv(screen_u_model_view_matrix, false, screen_model_view_matrix)
  gl.uniformMatrix4fv(screen_u_world_model_transpose_matrix, false, screen_world_model_transpose_matrix)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model_buffers.screen.indices)
  gl.drawElements(gl.TRIANGLES, model_buffers.screen.num_indices, gl.UNSIGNED_SHORT, 0)
}

function render_welcometext () {
  gl.useProgram(envmap_shader_program)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.welcometext.vertices)
  gl.enableVertexAttribArray(envmap_a_pos)
  gl.vertexAttribPointer(envmap_a_pos, 3, gl.FLOAT, false, 0, 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.welcometext.normals)
  gl.enableVertexAttribArray(envmap_a_normal)
  gl.vertexAttribPointer(envmap_a_normal, 3, gl.FLOAT, false, 0, 0)

  gl.uniformMatrix4fv(envmap_u_model_view_matrix, false, welcometext_model_view_matrix)

  gl.activeTexture(gl.TEXTURE0 + model_buffers.welcometext.texture_id)
  gl.uniform1i(envmap_u_sampler, model_buffers.welcometext.texture_id)

  gl.uniform4fv(envmap_u_camera_position, camera_position)

  gl.uniformMatrix4fv(envmap_u_model_view_matrix, false, welcometext_model_view_matrix)
  gl.uniformMatrix4fv(envmap_u_model_world_matrix, false, welcometext_model_world_matrix)
  gl.uniformMatrix4fv(envmap_u_world_model_transpose_matrix, false, welcometext_world_model_transpose_matrix)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model_buffers.welcometext.indices)
  gl.drawElements(gl.TRIANGLES, model_buffers.welcometext.num_indices, gl.UNSIGNED_SHORT, 0)
}

function render_tower () {
  gl.useProgram(plain_shader_program)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.tower.vertices)
  gl.enableVertexAttribArray(plain_a_pos)
  gl.vertexAttribPointer(plain_a_pos, 3, gl.FLOAT, false, 0, 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.tower.normals)
  gl.enableVertexAttribArray(plain_a_normal)
  gl.vertexAttribPointer(plain_a_normal, 3, gl.FLOAT, false, 0, 0)

  gl.uniformMatrix4fv(plain_u_model_view_matrix, false, tower_model_view_matrix)
  gl.uniformMatrix4fv(plain_u_world_model_transpose_matrix, false, tower_world_model_transpose_matrix)
  gl.uniform1f(plain_u_light, tower_light)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model_buffers.tower.indices)
  gl.drawElements(gl.TRIANGLES, model_buffers.tower.num_indices, gl.UNSIGNED_SHORT, 0)
}

function render_table () {
  gl.useProgram(plain_shader_program)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.table.vertices)
  gl.enableVertexAttribArray(plain_a_pos)
  gl.vertexAttribPointer(plain_a_pos, 3, gl.FLOAT, false, 0, 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.table.normals)
  gl.enableVertexAttribArray(plain_a_normal)
  gl.vertexAttribPointer(plain_a_normal, 3, gl.FLOAT, false, 0, 0)

  gl.uniformMatrix4fv(plain_u_model_view_matrix, false, table_model_view_matrix)
  gl.uniformMatrix4fv(plain_u_world_model_transpose_matrix, false, table_world_model_transpose_matrix)
  gl.uniform1f(plain_u_light, table_light)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model_buffers.table.indices)
  gl.drawElements(gl.TRIANGLES, model_buffers.table.num_indices, gl.UNSIGNED_SHORT, 0)
}

function render_sky () {
  gl.useProgram(skybox_shader_program)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.sky.vertices)
  gl.enableVertexAttribArray(skybox_a_pos)
  gl.vertexAttribPointer(skybox_a_pos, 3, gl.FLOAT, false, 0, 0)

  gl.bindBuffer(gl.ARRAY_BUFFER, model_buffers.sky.uvs)
  gl.vertexAttribPointer(skybox_a_uv, 2, gl.FLOAT, false, 0, 0)
  gl.enableVertexAttribArray(skybox_a_uv)

  gl.activeTexture(gl.TEXTURE0 + model_buffers.sky.texture_id)
  gl.uniform1i(skybox_u_sampler, model_buffers.sky.texture_id)

  gl.uniformMatrix4fv(skybox_u_model_view_matrix, false, sky_model_view_matrix)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model_buffers.sky.indices)
  gl.drawElements(gl.TRIANGLES, model_buffers.sky.num_indices, gl.UNSIGNED_SHORT, 0)
}

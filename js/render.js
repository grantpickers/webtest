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
    let thumb_width = 0    
    let thumb_height = 0
    if (images[desktop_item.thumb].width > images[desktop_item.thumb].height) {
      thumb_width = 50
      thumb_height = thumb_width/images[desktop_item.thumb].width*images[desktop_item.thumb].height
    }
    else {
      thumb_height = 50
      thumb_width = thumb_height/images[desktop_item.thumb].height*images[desktop_item.thumb].width
    }
    screen_ctx.drawImage(
      images[desktop_item.thumb],
      desktop_item.x + 0.5*desktop_item.w - 0.5*thumb_width,
      desktop_item.y + 25 - 0.5*thumb_height,
      thumb_width,
      thumb_height
    )


    screen_ctx.textAlign = "center"

    if (desktop_item == screen_selected_item) {
      // Render selection
      screen_ctx.fillStyle = "#000080"
      const w = 8 + desktop_item.txt.length * 7
      screen_ctx.fillRect(desktop_item.x + (desktop_item.w - w)*0.5, desktop_item.y + desktop_item.h - 25+5, w, 26)

      screen_ctx.fillStyle = "#3a6fa644"
      screen_ctx.fillRect(desktop_item.x, desktop_item.y, desktop_item.w, desktop_item.h - 20);
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
 /* ********
  DRAWING UI
*/ 
  if (screen_explorer_item_set) {
    screen_ctx.fillStyle = '#fff'
    screen_ctx.fillRect(screen_win_x, screen_win_y, screen_win_w, screen_win_h)
    screen_ctx.drawImage(images.window_frame_t_l_png, screen_win_x, screen_win_y, 5, 30)
    screen_ctx.drawImage(images.window_frame_t_r_png, screen_win_x+screen_win_w-26, screen_win_y, 26, 30)
    screen_ctx.drawImage(images.window_frame_b_l_png, screen_win_x, screen_win_y+screen_win_h-5, 5, 5)
    screen_ctx.drawImage(images.window_frame_b_r_png, screen_win_x+screen_win_w-5, screen_win_y+screen_win_h-5, 5, 5)
    screen_ctx.drawImage(images.window_frame_t_png, screen_win_x+5, screen_win_y, screen_win_w-26-5, 30)
    screen_ctx.drawImage(images.window_frame_r_png, screen_win_x+screen_win_w-5, screen_win_y+30, 5, screen_win_h-30-5)
    screen_ctx.drawImage(images.window_frame_b_png, screen_win_x+5, screen_win_y+screen_win_h-5, screen_win_w-10, 5)
    screen_ctx.drawImage(images.window_frame_l_png, screen_win_x, screen_win_y+30, 5, screen_win_h-30-5)
    
    screen_ctx.textAlign = "left"
    screen_ctx.fillText(screen_explorer_title, screen_win_x + 35, screen_win_y + 19)

    for (let i=0; i<screen_explorer_item_set.length; i++) {
      const explorer_item = screen_explorer_item_set[i]

      // Render icon
      let thumb_width = 0    
      let thumb_height = 0
      if (images[explorer_item.thumb].width > images[explorer_item.thumb].height) {
        thumb_width = 50
        thumb_height = thumb_width/images[explorer_item.thumb].width*images[explorer_item.thumb].height
      }
      else {
        thumb_height = 50
        thumb_width = thumb_height/images[explorer_item.thumb].height*images[explorer_item.thumb].width
      }
      screen_ctx.drawImage(images[explorer_item.thumb], explorer_item.x + screen_win_x + 0.5*explorer_item.w - 0.5*thumb_width, explorer_item.y + screen_win_y + 25 - 0.5*thumb_height, thumb_width, thumb_height)

      screen_ctx.textAlign = "center"

      if (explorer_item == screen_selected_item) {
        // Render selection
        screen_ctx.fillStyle = "#000080"
        const w = 8 + explorer_item.txt.length * 7
        screen_ctx.fillRect(explorer_item.x + (explorer_item.w - w)*0.5 + screen_win_x, explorer_item.y + explorer_item.h - 25+5 + screen_win_y, w, 26)

        /*
        screen_ctx.fillStyle = "#3a6fa644"
        screen_ctx.fillRect(explorer_item.x + screen_win_x, explorer_item.y + screen_win_y, explorer_item.w, explorer_item.h - 25);
        */

        screen_ctx.globalCompositeOperation = "color-burn"
        screen_ctx.fillStyle = "hsla(0,50%,80%,0.4)";
        screen_ctx.fillRect(explorer_item.x + screen_win_x, explorer_item.y + screen_win_y, explorer_item.w, explorer_item.h - 25);

        screen_ctx.globalCompositeOperation = "saturation";
        screen_ctx.fillStyle = "hsla(0,100%,50%,0.4)";
        screen_ctx.fillRect(explorer_item.x + screen_win_x, explorer_item.y + screen_win_y, explorer_item.w, explorer_item.h - 25);

        screen_ctx.globalCompositeOperation = "hue";
        screen_ctx.fillStyle = "hsla(211,1%,50%,0.4)";
        screen_ctx.fillRect(explorer_item.x + screen_win_x, explorer_item.y + screen_win_y, explorer_item.w, explorer_item.h - 25);

        screen_ctx.globalCompositeOperation = "source-over";

        screen_ctx.fillStyle = "#fff"
        screen_ctx.fillText(explorer_item.txt, explorer_item.x + 0.5*explorer_item.w + screen_win_x, explorer_item.y + explorer_item.h + screen_win_y)
      }
      else {
        screen_ctx.fillStyle = "#000"
        screen_ctx.fillText(explorer_item.txt, explorer_item.x + 0.5*explorer_item.w + screen_win_x, explorer_item.y + explorer_item.h + screen_win_y)
      }
    }
  }
  /*
  TODO: Centre and resize images and add frame
  */
  if (screen_preview_image) {
    const img = images[screen_preview_image]
    /*
    img looks like this: {width: 1234, height: 5677, ...}
    */
    screen_ctx.drawImage(img, 30, 40, img.width, img.height )
    screen_ctx.drawImage(images.window_frame_t_r_png, 30 + img.width - 26 + 5, 40 - 30, 26, 30)
  }

  if (screen_hovered_desktop_item && screen_hovered_desktop_item.txt == 'Painting') {
    screen_ctx.drawImage(video_catblue_mp4,screen_hovered_desktop_item.x, screen_hovered_desktop_item.y, 60, 52)
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

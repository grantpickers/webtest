function update () {
  if (has_resized) { handle_resize() }
  update_pick()
  update_screen()
  update_camera()

  has_clicked = false
  has_resized = false
}

function handle_resize () {
  canvas.width = window.devicePixelRatio * canvas.offsetWidth
  canvas.height = 9/16*canvas.width
  gl.viewport(0, 0, canvas.width, canvas.height)
  camera_update_perspective()
  gl.useProgram(basic_shader_program)
  gl.uniformMatrix4fv(basic_u_perspective_matrix, false, camera_perspective_matrix)
  gl.useProgram(plain_shader_program)
  gl.uniformMatrix4fv(plain_u_perspective_matrix, false, camera_perspective_matrix)
}

function update_pick () {
  pick_ray[0] = 2 * mouse_x / canvas.width - 1
  pick_ray[1] = -2 * mouse_y / canvas.height + 1
  pick_ray[2] = -1
  pick_ray[3] = 1

  matrix_mult_4(camera_view_model_matrix, camera_inverse_rotation, camera_inverse_translation)
  matrix_operate_4(camera_inverse_perspective_matrix, pick_ray)
  pick_ray[3] = 0
  matrix_operate_4(camera_view_model_matrix, pick_ray)

  const denom = dot3(pick_ray, screen_n)
  if (denom != 0) {
    camera_0[0] = -camera_translation[12]
    camera_0[1] = -camera_translation[13]
    camera_0[2] = -camera_translation[14]
    const t = dot3(screen_n, sub3(temp0, screen_0, camera_0)) / denom
    sum3(pick_p, camera_0, scl3(temp0, t, pick_ray))
    matrix_operate_4(screen_inverse_translation, pick_p)
    matrix_operate_4(screen_inverse_rotation, pick_p)
    matrix_operate_4(screen_inverse_scale, pick_p)
  }
}

function update_screen () {
  const previous_page = current_page

  const screen_mouse_x = pick_p[0]
  const screen_mouse_y = pick_p[1]
  for (let i=0; i<buttons.length; i++) {
    const b = buttons[i]
    const is_hovered = screen_mouse_x > b.x && screen_mouse_y > b.y && screen_mouse_x < b.x+b.w && screen_mouse_y < b.y+b.h
    b.is_hovered = is_hovered
    if (is_hovered && has_clicked) {
      current_page = b.page
      if (current_page !== previous_page) {
        if (current_page == pages.works) {
          camera_ry_target = Math.PI/2 - 1*Math.PI/7
          camera_tx_target = -4.4*Math.sin(camera_ry_target)
          camera_ty_target = 0
          camera_tz_target = 1-4.4*Math.cos(camera_ry_target)
          camera_animation_tween = 0
        }
        if (current_page == pages.about || current_page == pages.contact) {
          camera_ry_target = Math.PI/2
          camera_tx_target = -0.92
          camera_ty_target = 0
          camera_tz_target = 0
          camera_animation_tween = 0
        }
      }
    }
  }
}

function update_camera () {
  if (camera_animation_tween < 1) {
    camera_animation_tween += 0.005
  }

  camera_ry = camera_animation_tween * (camera_ry_target) + (1-camera_animation_tween) * camera_ry
  camera_tx = camera_animation_tween * (camera_tx_target) + (1-camera_animation_tween) * camera_tx
  camera_ty = camera_animation_tween * (camera_ty_target) + (1-camera_animation_tween) * camera_ty
  camera_tz = camera_animation_tween * (camera_tz_target) + (1-camera_animation_tween) * camera_tz

  camera_translation[12] = camera_tx
  camera_translation[13] = camera_ty
  camera_translation[14] = camera_tz

  camera_rotation[0] = Math.cos(camera_ry)
  camera_rotation[2] = Math.sin(camera_ry)
  camera_rotation[8] = -Math.sin(camera_ry)
  camera_rotation[10] = Math.cos(camera_ry)

  matrix_mult_4(camera_model_view_matrix, camera_rotation, camera_translation)

  matrix_transpose_4(camera_inverse_rotation, camera_rotation)

  camera_inverse_translation[12] = -camera_tx
  camera_inverse_translation[13] = -camera_ty
  camera_inverse_translation[14] = -camera_tz
}

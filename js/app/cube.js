const cube_translation = new Float32Array([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  2, 0,-1, 1,
])
const cube_rotation = matrix_mult_4(new Float32Array(16), matrix_mult_4(new Float32Array(16), create_z_rotation_matrix(1), create_y_rotation_matrix(3)), create_x_rotation_matrix(1))
const cube_model_world_matrix = new Float32Array(16)
const cube_model_view_matrix = new Float32Array(16)

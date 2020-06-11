const cube_width = 0.25
const cube_translation = create_translation_matrix(2,0,-1)
const cube_inverse_translation = create_translation_matrix(-2,0,1)

const cube_rotation = matrix_mult_4(new Float32Array(16), matrix_mult_4(new Float32Array(16), create_z_rotation_matrix(1), create_y_rotation_matrix(3)), create_x_rotation_matrix(1))
const cube_rotation_rate = create_y_rotation_matrix(0.01)
const cube_inverse_rotation = new Float32Array(16)

const cube_model_world_matrix = new Float32Array(16)
const cube_world_model_matrix = new Float32Array(16)

const cube_model_view_matrix = new Float32Array(16)
const cube_view_model_matrix = new Float32Array(16)
const cube_view_model_transpose_matrix = new Float32Array(16)

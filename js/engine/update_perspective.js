function update_perspective (perspective_matrix, inverse_perspective_matrix) {
  const aspect = canvas.width / canvas.height
  const fov = Math.PI/4
  const near = 1
  const far = 50
  const pa = 1/Math.tan(fov/2)/aspect
  const pb = 1/Math.tan(fov/2)
  const pc = (near + far)/(near - far)
  const pd = -1
  const pe = 2*near*far/(near - far)

  perspective_matrix[0] = pa
  perspective_matrix[5] = pb
  perspective_matrix[10] = pc
  perspective_matrix[11] = pd
  perspective_matrix[14] = pe

  inverse_perspective_matrix[0] = 1/pa
  inverse_perspective_matrix[5] = 1/pb
  inverse_perspective_matrix[11] = 1/pe
  inverse_perspective_matrix[14] = 1/pd
  inverse_perspective_matrix[15] = -pc/(pd*pe)
}



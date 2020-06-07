function matrix_transpose_4 (m, a) {
  for (let i=0; i<4; i++) {
    for (let j=0; j<4; j++) {
      m[i*4 + j] = a[j*4 + i]
      m[j*4 + i] = a[i*4 + j]
    }
  }
}

function matrix_mult_4 (m, a, b) {
  for (let i=0; i<4; i++) {
    for (let j=0; j<4; j++) {
      m[i*4 + j] = 0
      for (let k=0; k<4; k++) {
        m[i*4 + j] += a[j + k*4] * b[i*4 + k]
      }
    }
  }
}

function matrix_operate_4 (m, v) {
  let t = new Float32Array(4)
  t[0] = v[0]
  t[1] = v[1]
  t[2] = v[2]
  t[3] = v[3]
  for (let j=0; j<4; j++) {
    v[j] = 0
    for (let k=0; k<4; k++) {
      v[j] += m[j + k*4] * t[k]
    }
  }
}

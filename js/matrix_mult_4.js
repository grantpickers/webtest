function matrix_mult_4 (a, b) {
  let m = new Float32Array(16)
  for (let i=0; i<4; i++) {
    for (let j=0; j<4; j++) {
      for (let k=0; k<4; k++) {
        m[i*4 + j] += a[j + k*4] * b[i*4 + k]
      }
    }
  }
  return m
}

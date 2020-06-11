/*
 * These matrix operations are anti-memory-leak, and overwrite-safe.
 */

const ROTATION_Y_HALF_PI = new Float32Array([
  0, 0, 1, 0,
  0, 1, 0, 0,
 -1, 0, 0, 0,
  0, 0, 0, 1
])

const ROTATION_X_PI = new Float32Array([
  1, 0, 0, 0,
  0,-1, 0, 0,
  0, 0,-1, 0,
  0, 0, 0, 1
])

function matrix_transpose_4 (m, a) {
  for (let i=0; i<4; i++) {
    for (let j=0; j<4; j++) {
      let t = a[i*4 + j]
      m[i*4 + j] = a[j*4 + i]
      m[j*4 + i] = t
    }
  }
  return m
}

function matrix_mult_4 (m, a, b) {
  const t = new Float32Array(16)
  for (let i=0; i<4; i++) {
    for (let j=0; j<4; j++) {
      for (let k=0; k<4; k++) {
        t[i*4 + j] += a[j + k*4] * b[i*4 + k]
      }
    }
  }
  for (let i=0; i<16; i++) {
    m[i] = t[i]
  }
  return m
}

function matrix_operate_4 (w, m, v) {
  let t = new Float32Array(4)
  t[0] = v[0]
  t[1] = v[1]
  t[2] = v[2]
  t[3] = v[3]
  for (let j=0; j<4; j++) {
    w[j] = 0
    for (let k=0; k<4; k++) {
      w[j] += m[j + k*4] * t[k]
    }
  }
  return w
}

// TODO: create_[xyz]_rotation_matrix (m, t) to not alloc memory
function create_x_rotation_matrix (t) {
  const c = Math.cos(t)
  const s = Math.sin(t)
  return new Float32Array([
    1, 0, 0, 0,
    0, c, s, 0,
    0,-s, c, 0,
    0, 0, 0, 1,
  ])
}
function create_y_rotation_matrix (t) {
  const c = Math.cos(t)
  const s = Math.sin(t)
  return new Float32Array([
    c, 0,-s, 0,
    0, 1, 0, 0,
    s, 0, c, 0,
    0, 0, 0, 1,
  ])
}
function create_z_rotation_matrix (t) {
  const c = Math.cos(t)
  const s = Math.sin(t)
  return new Float32Array([
    c, s, 0, 0,
   -s, c, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
  ])
}
function create_translation_matrix (x,y,z) {
  return new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    x, y, z, 1,
  ])
}

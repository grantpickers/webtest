/****************************
 * Vector
 ***************************/

const temp0 = new Float32Array(3)

function cross3 (v,a,b) { 
  const ax = a[0]
  const ay = a[1]
  const az = a[2]
  const bx = b[0]
  const by = b[1]
  const bz = b[2]
  v[0] = ay*bz-az*by
  v[1] = az*bx-ax*bz
  v[2] = ax*by-ay*bx
  return v
}
function sub3 (v,a,b) { v[0] = a[0]-b[0]; v[1] = a[1]-b[1]; v[2] = a[2]-b[2]; return v; }
function sum3 (v,a,b) { v[0] = a[0]+b[0]; v[1] = a[1]+b[1]; v[2] = a[2]+b[2]; return v; }
function scl3 (v,c,a) { v[0] = c*a[0];    v[1] = c*a[1];    v[2] = c*a[2];    return v; }
function dot3 (a,b) { return a[0]*b[0] + a[1]*b[1] + a[2]*b[2] }



/****************************
 * Matrix
 ***************************/


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


/****************************
 * Loaders
 ***************************/


function load_texture(gl, image, id) {
  const texture = gl.createTexture()
  gl.activeTexture(gl.TEXTURE0+id)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  return texture
}


function load_obj (gl, obj) {
  const model = {
    vertices: [],
    indices: [],
    normals: [],
    uvs: [],
  }

  let offset = 0
  let line = ''
  let i = offset

  while (!(line[0] == 'v' && line[1] == ' ')) {
    while (obj[i] !== '\n') {
      i = i + 1
      if (obj[i] === undefined) { throw ("OBJ missing vertex data") }
    }
    line = obj.substring(offset, i)
    i = i + 1
    offset = i
  }
  while (line[0] == 'v' && line[1] == ' ') {
    const split = line.split(' ')
    model.vertices.push(parseFloat(split[1]), parseFloat(split[2]), parseFloat(split[3]))
    while (obj[i] !== '\n') {
      i++
      if (obj[i] === undefined) { throw ("OBJ data corrupted (expected end of line in vertex data)") }
    }
    line = obj.substring(offset, i)
    i++
    offset = i
  }

  let uvs = []
  while (!(line[0] == 'v' && line[1] == 't')) {
    while (obj[i] !== '\n') {
      i = i + 1
      if (obj[i] === undefined) { throw ("OBJ missing vertex UV data") }
    }
    line = obj.substring(offset, i)
    i = i + 1
    offset = i
  }
  while (line[0] == 'v' && line[1] == 't') {
    const split = line.split(' ')
    uvs.push([parseFloat(split[1]), parseFloat(split[2])])
    while (obj[i] !== '\n') {
      i++
      if (obj[i] === undefined) { throw ("OBJ data corrupted (expected end of line in UV data)") }
    }
    line = obj.substring(offset, i)
    i++
    offset = i
  }

  let normals = []
  while (!(line[0] == 'v' && line[1] == 'n')) {
    while (obj[i] !== '\n') {
      i = i + 1
      if (obj[i] === undefined) { throw ("OBJ missing vertex normal data") }
    }
    line = obj.substring(offset, i)
    i = i + 1
    offset = i
  }
  while (line[0] == 'v' && line[1] == 'n') {
    const split = line.split(' ')
    normals.push([parseFloat(split[1]), parseFloat(split[2]), parseFloat(split[3])])
    while (obj[i] !== '\n') {
      i++
      if (obj[i] === undefined) { throw ("OBJ data corrupted (expected end of line in vertex normal data)") }
    }
    line = obj.substring(offset, i)
    i++
    offset = i
  }

  let indices = []
  while (!(line[0] == 'f' && line[1] == ' ')) {
    while (obj[i] !== '\n') {
      i = i + 1
      if (obj[i] === undefined) { throw ("OBJ missing face data") }
    }
    line = obj.substring(offset, i)
    i = i + 1
    offset = i
  }
  while (line[0] == 'f' && line[1] == ' ') {
    const split = line.split(' ')
    for (let j=1; j<split.length; j++) {
      split[j] = split[j].split('/')
    }

    model.indices.push(parseInt(split[1][0])-1, parseInt(split[2][0])-1, parseInt(split[3][0])-1)


    model.uvs[2*(parseInt(split[1][0])-1)+0] = uvs[parseInt(split[1][1])-1][0]
    model.uvs[2*(parseInt(split[1][0])-1)+1] = uvs[parseInt(split[1][1])-1][1]

    model.uvs[2*(parseInt(split[2][0])-1)+0] = uvs[parseInt(split[2][1])-1][0]
    model.uvs[2*(parseInt(split[2][0])-1)+1] = uvs[parseInt(split[2][1])-1][1]

    model.uvs[2*(parseInt(split[3][0])-1)+0] = uvs[parseInt(split[3][1])-1][0]
    model.uvs[2*(parseInt(split[3][0])-1)+1] = uvs[parseInt(split[3][1])-1][1]

    model.normals[3*(parseInt(split[1][0])-1)+0] = normals[parseInt(split[1][2])-1][0]
    model.normals[3*(parseInt(split[1][0])-1)+1] = normals[parseInt(split[1][2])-1][1]
    model.normals[3*(parseInt(split[1][0])-1)+2] = normals[parseInt(split[1][2])-1][2]

    model.normals[3*(parseInt(split[2][0])-1)+0] = normals[parseInt(split[2][2])-1][0]
    model.normals[3*(parseInt(split[2][0])-1)+1] = normals[parseInt(split[2][2])-1][1]
    model.normals[3*(parseInt(split[2][0])-1)+2] = normals[parseInt(split[2][2])-1][2]

    model.normals[3*(parseInt(split[3][0])-1)+0] = normals[parseInt(split[3][2])-1][0]
    model.normals[3*(parseInt(split[3][0])-1)+1] = normals[parseInt(split[3][2])-1][1]
    model.normals[3*(parseInt(split[3][0])-1)+2] = normals[parseInt(split[3][2])-1][2]
    while (obj[i] !== '\n') {
      i++
      if (obj[i] === undefined) { break }
    }
    line = obj.substring(offset, i)
    i++
    offset = i
  }

  model.vertices = new Float32Array(model.vertices)
  model.indices = new Uint16Array(model.indices)
  model.uvs = new Float32Array(model.uvs)
  model.normals = new Float32Array(model.normals)

  const buffers = {
    vertices: gl.createBuffer(),
    indices: gl.createBuffer(),
    uvs: gl.createBuffer(),
    normals: gl.createBuffer(),
    num_indices: model.indices.length,
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertices)
  gl.bufferData(gl.ARRAY_BUFFER, model.vertices, gl.STATIC_DRAW)

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, model.indices, gl.STATIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.uvs)
  gl.bufferData(gl.ARRAY_BUFFER, model.uvs, gl.STATIC_DRAW)

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normals)
  gl.bufferData(gl.ARRAY_BUFFER, model.normals, gl.STATIC_DRAW)

  return buffers
}


function load_images (image_urls, images, cb) {
  for (let k in image_urls) {
    const img = new Image()
    img.src = image_urls[k]
    img.onload = ((k) => () => {
      images[k] = img
      if (Object.keys(images).length == Object.keys(image_urls).length) {
        cb()
      }
    })(k)
  }
}


function load_assets (asset_urls, assets, cb) {
  for (let k in asset_urls) {
    fetch(asset_urls[k]).then(res => res.text())
    .then((k => data => {
      assets[k] = data
      if (Object.keys(assets).length == Object.keys(asset_urls).length) {
        cb()
      }
    })(k))
  }
}


/****************************
 * Create Shader Program
 ***************************/

function create_shader_program (gl, vert_source, frag_source) {
  const vert_shader = gl.createShader(gl.VERTEX_SHADER)
  const frag_shader = gl.createShader(gl.FRAGMENT_SHADER)
  gl.shaderSource(vert_shader, vert_source)
  gl.shaderSource(frag_shader, frag_source)
  gl.compileShader(vert_shader)
  const info_log_vert = gl.getShaderInfoLog(vert_shader)
  if (info_log_vert) {
    console.log(vert_source)
    console.log(info_log_vert)
  }
  gl.compileShader(frag_shader)
  const info_log_frag = gl.getShaderInfoLog(frag_shader)
  if (info_log_frag) {
    console.log(frag_source)
    console.log(info_log_frag)
  }
  const program = gl.createProgram()
  gl.attachShader(program, vert_shader)
  gl.attachShader(program, frag_shader)
  gl.linkProgram(program)
  const info_log_link = gl.getProgramInfoLog(program)
  if (info_log_link) { console.log(info_log_link) }
  return program
}

function load_obj (obj) {
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

  return model
}


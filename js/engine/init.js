let canvas = document.createElement('canvas')
let gl = canvas.getContext('webgl')
let mouse_x = 0
let mouse_y = 0
let has_clicked = false
let has_resized = true

function init () {
  document.body.appendChild(canvas)
  canvas.width = window.devicePixelRatio * canvas.offsetWidth
  canvas.height = 9/16*canvas.width
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.clearColor(0,0,0,1)
  gl.enable(gl.DEPTH_TEST)
  gl.enable(gl.CULL_FACE)
  gl.cullFace(gl.BACK)

  window.addEventListener('resize', function (e) { has_resized = true })
  canvas.addEventListener('mousemove', function (e) { mouse_x = e.offsetX; mouse_y = e.offsetY })
  canvas.addEventListener('click', function (e) { has_clicked = true })
}


// Screen Object

const screen_canvas = document.createElement('canvas')
const screen_pixel_width = 1920
const screen_pixel_height = 1080
screen_canvas.width = screen_pixel_width
screen_canvas.height = screen_pixel_height
const screen_ctx = screen_canvas.getContext('2d')
const screen_0 = new Float32Array([0.060993, -0.500000, 0.8888888])
const screen_h = new Float32Array([0.060993, 0.500000, 0.8888888])
const screen_v = new Float32Array([0.060993, -0.500000, -0.8888888])
const screen_n = cross3(new Float32Array(3), sub3([], screen_v, screen_0), sub3([], screen_h, screen_0))
const screen_inverse_rotation = matrix_mult_4(new Float32Array(16), ROTATION_X_PI, ROTATION_Y_HALF_PI)
const screen_inverse_translation = new Float32Array([
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  -screen_h[0], -screen_h[1], -screen_h[2], 1
])
const screen_model_width = 1.7777777
const screen_model_height = 1
const screen_inverse_scale = new Float32Array([
  screen_pixel_width/screen_model_width, 0, 0, 0,
  0, screen_pixel_height/screen_model_height, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1,
])


// Screen UI

const buttons = [
  { x: 150, y: 100, w: 500, h: 100, txt: "3D WORKS", page: 'works', },
  { x: 150, y: 240, w: 500, h: 100, txt: "ABOUT",    page: 'about', },
  { x: 150, y: 380, w: 500, h: 100, txt: "CONTACT",  page: 'contact', },
]
const pages = {
  works: [
    "Aenean commodo ligula eget dolor.",
    "Cum sociis natoque penatibus et magnis dis.",
  ],
  about: [
    'grant.gl',
    '',
    "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
    "Aenean commodo ligula eget dolor.",
    "Aenean massa.",
    "Cum sociis natoque penatibus et magnis dis.",
  ],
  contact: [
    "Aenean commodo ligula eget dolor.",
    "Aenean massa.",
  ],
}
const button_bg = '#eee'
const button_fg = '#00f'
const button_hover_bg = '#aaa'
const button_hover_fg = '#00f'
const button_active_bg = '#000'
const button_active_fg = '#fff'
let current_page = pages.about


// Link screen data

for (let i=0; i<buttons.length; i++) {
  const b = buttons[i]
  const keys = Object.keys(pages)
  for (let j=0; j<keys.length; j++) {
    const k = keys[j]
    if (b.page == k) {
      b.page = pages[k]
    }
  }
}

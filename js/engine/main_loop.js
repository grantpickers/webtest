let prev_timestamp = null
let total_time = 0
const TARGET_FRAME_TIME = 1000/60

function main_loop (timestamp) {
  if (prev_timestamp == null) {
    prev_timestamp = timestamp
  }
  const frame_time = timestamp - prev_timestamp
  prev_timestamp = timestamp
  total_time += frame_time
  if (total_time > TARGET_FRAME_TIME*3) {
    total_time = TARGET_FRAME_TIME
  }
  while (total_time >= TARGET_FRAME_TIME) {
    update()
    render()
    total_time -= TARGET_FRAME_TIME
  }
  window.requestAnimationFrame(main_loop)
}


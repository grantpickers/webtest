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

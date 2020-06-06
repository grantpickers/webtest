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

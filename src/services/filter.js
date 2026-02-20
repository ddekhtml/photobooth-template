import 'context-filter-polyfill';

export function applyFilterToImage(imageSrc, cssFilter) {
  return new Promise(resolve => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imageSrc

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight

      const ctx = canvas.getContext('2d')

      // Pakai polyfill otomatis kalau ctx.filter nggak support
      if (cssFilter && cssFilter.trim() !== '') {
        ctx.filter = cssFilter
      } else {
        ctx.filter = 'none'
      }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      ctx.filter = 'none' // reset (penting buat iOS)

      resolve(canvas.toDataURL('image/png'))
    }
  })
}

// services/canvas.js
let canvas = null
let ctx = null

export function createCanvas(width, height) {
  canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  ctx = canvas.getContext('2d') // ambil alat gambar 2d
  return canvas
}

export async function drawFrame(frameImage) {
  const img = new Image()
  img.src = frameImage
  await img.decode()
  ctx.drawImage(img, 0, 0)
}

export async function drawPhoto(photo, slot) {
  const img = new Image()
  img.src = photo
  await img.decode()

  const imgRatio = img.width / img.height
  const slotRatio = slot.width / slot.height

  let sx = 0
  let sy = 0
  let sWidth = img.width
  let sHeight = img.height

  if (imgRatio > slotRatio) {
    // crop kiri kanan
    sWidth = img.height * slotRatio
    sx = (img.width - sWidth) / 2
  } else {
    // crop atas bawah
    sHeight = img.width / slotRatio
    sy = (img.height - sHeight) / 2
  }

  ctx.drawImage(
    img,
    sx,
    sy,
    sWidth,
    sHeight,
    slot.x,
    slot.y,
    slot.width,
    slot.height
  )
}

export function exportCanvas(type = 'image/png', scale=1,quality = 0.92) {
  if (scale === 1) {
    return canvas.toDataURL(type, quality)
  }
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = canvas.width * scale
  tempCanvas.height = canvas.height * scale
  const tempCtx = tempCanvas.getContext('2d')
  tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height)
  return tempCanvas.toDataURL(type, quality)
}

export function destroyCanvas() {
  canvas = null
  ctx = null
}

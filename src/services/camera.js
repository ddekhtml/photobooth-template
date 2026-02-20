let stream = null

export async function startCamera(videoEl) {
  stream = await navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: 'user',
      width: { ideal: 1920 },
      height: { ideal: 1080 }
    },
    audio: false
  })

  videoEl.srcObject = stream
}

export function stopCamera() {
  if (stream) {
    stream.getTracks().forEach(t => t.stop())
    stream = null
  }
}

export function capturePhoto(videoEl) {
  const canvas = document.createElement('canvas')

  const targetRatio = 750 / 600 // rasio slot kamu
  const videoRatio = videoEl.videoWidth / videoEl.videoHeight

  let sx = 0
  let sy = 0
  let sWidth = videoEl.videoWidth
  let sHeight = videoEl.videoHeight

  if (videoRatio > targetRatio) {
    // video terlalu lebar → crop kiri kanan
    sWidth = videoEl.videoHeight * targetRatio
    sx = (videoEl.videoWidth - sWidth) / 2
  } else {
    // video terlalu tinggi → crop atas bawah
    sHeight = videoEl.videoWidth / targetRatio
    sy = (videoEl.videoHeight - sHeight) / 2
  }

  canvas.width = sWidth
  canvas.height = sHeight

  const ctx = canvas.getContext('2d')
  ctx.drawImage(videoEl, sx, sy, sWidth, sHeight, 0, 0, sWidth, sHeight)

  return canvas.toDataURL('image/png')
}
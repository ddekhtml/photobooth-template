let stream = null

export async function startCamera(videoEl) {
  stream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'user' },
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
  canvas.width = videoEl.videoWidth
  canvas.height = videoEl.videoHeight

  const ctx = canvas.getContext('2d')
  ctx.drawImage(videoEl, 0, 0)

  return canvas.toDataURL('image/png')
}

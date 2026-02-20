export async function base64ToBlob(base64, mime = 'image/jpeg') {
  // pisah header data:image/jpeg;base64, kalau ada
  const parts = base64.split(',')
  const b64Data = parts.length > 1 ? parts[1] : parts[0]

  const byteCharacters = atob(b64Data) // decode base64
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)

  return new Blob([byteArray], { type: mime })
}

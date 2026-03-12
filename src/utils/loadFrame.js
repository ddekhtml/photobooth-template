const modules = import.meta.glob('/src/event/4r/*/frames.js')

export async function loadFrames(eventId) {
  const path = `/src/event/4r/${eventId}/frames.js`

//   console.log('Available modules:', Object.keys(modules))
//   console.log('Looking for:', path)

  if (!modules[path]) {
    console.error('Frames not found for event:', eventId)
    return []
  }

  const module = await modules[path]()
  return module.frames || []
}

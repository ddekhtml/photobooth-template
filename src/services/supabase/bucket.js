import { openDB } from 'idb'

// DB Promise
export const dbPromise = openDB('photobooth', 3, {
  upgrade(db) {
    // Satu tabel sederhana: submissions
    // Hanya satu baris nanti di-reuse
    const store = db.createObjectStore('sesi', { keyPath: 'id' })
    store.createIndex('bucket', 'bucket') // index buat query cepat
  }
})
export async function getSession(id = 1) {
  const db = await dbPromise
  return db.get('sesi', id)
}
export async function updateSession(updates) {
  const db = await dbPromise
  const record = await db.get('sesi', 1) // id selalu 1
  if (!record) {
    await db.put('sesi', { id: 1, bucket: updates.bucket, session: updates.session})
    return
  }
  const updated = { ...record, ...updates }
  await db.put('sesi', updated)
}

export async function clearAllsesi() {
  const db = await dbPromise
  await db.clear('sesi')
}

export async function getSessionBucket(id = 1) {
  const db = await dbPromise
  const session = await db.get('sesi', id)
  if (!session) return null
  return session.bucket
}

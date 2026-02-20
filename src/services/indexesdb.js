import { openDB } from 'idb'

// const db = await dbPromise --> use database 
// put 
// get 
// getAll 
// delete 

export const dbPromise = openDB('photoboothDB', 1, {
  upgrade(db) { // dipakai hanya pertama kali, versi baru 
    const store = db.createObjectStore('submissions', { keyPath: 'id' }) // tabel bernama submission degan record punya key unik
    store.createIndex('eventId', 'eventId') // buat index biar bisa query dengan cepat
  }
})

// simpan satu record
export async function saveSubmission(submission) {
  const db = await dbPromise
  await db.put('submissions', submission)
}

// ambil semua record
export async function getAllSubmissions() {
  const db = await dbPromise
  return db.getAll('submissions')
}

// ambil record by id
export async function getSubmissionById(id) {
  const db = await dbPromise
  return db.get('submissions', id)
}

// ambil semua record by eventId
export async function getSubmissionsByEvent(eventId) {
  const db = await dbPromise
  const tx = db.transaction('submissions') // start transaksi 
  const store = tx.objectStore('submissions') // pilih tabel 
  const index = store.index('eventId') // pilih index 
  return index.getAll(eventId)
}

// update record by id
export async function updateSubmission(id, updates) {
  const db = await dbPromise
  const record = await db.get('submissions', id)
  if (!record) return
  const updated = { ...record, ...updates }
  await db.put('submissions', updated)
}

// hapus record
export async function deleteSubmission(id) {
  const db = await dbPromise
  await db.delete('submissions', id)
}

// hapus semua
export async function clearAllSubmissions() {
  const db = await dbPromise
  await db.clear('submissions')
}

import { base64ToBlob } from './blob.js'
import { supabase } from './supabase.js'

export async function setEvent(eventName) {
  const { data: existing } = await supabase
    .from('event')
    .select('*')
    .eq('event_name', eventName)
    .single()

  if (existing) {
    throw new Error('Event sudah ada')
  }

  const { data, error } = await supabase
    .from('event')
    .insert([{ event_name: eventName }])
    .select()

  if (error) throw error

  return data
}


export async function createBaseOnce(baseId, event_name, bucket_name) {
  const { data, error } = await supabase
    .from('base')
    .insert([
      { 
        id: baseId,
        event_name: event_name, 
        bucket_name : bucket_name
       }
    ])
    .select()
  if (error) {
    console.error('BASE INSERT ERROR:', error)
    throw error
  }
  console.log('BASE CREATED:', data)
}

export async function uploadPhotoAndInsert({
  photo,
  baseId,
  bucket,
  index
}) {
  // 1. base64 → Blob
  const file = await base64ToBlob(photo)
  const filePath = `${baseId}/${index}.jpeg`

  // 2. upload ke Storage
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      contentType: 'image/jpeg',
      upsert: false
    })

  if (uploadError) throw uploadError

  // 3. ambil public URL
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath)

  const publicUrl = data.publicUrl

  // 4. insert ke table photos
  const { error: photoError } = await supabase
    .from('photos')
    .insert([
      {
        base_id: baseId,
        url: publicUrl,
      }
    ])

  if (photoError) throw photoError

  return publicUrl
}
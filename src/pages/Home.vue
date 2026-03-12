<script setup>
import { useRouter } from 'vue-router'
import { useSessionStore } from '../stores/sessionStore';
import { usePhotoStore } from '../stores/photoStore';
import { onMounted, ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid'
import { saveSubmission } from '../services/indexesdb';
import { getSession, updateSession } from '../services/supabase/bucket';

const photoStore = usePhotoStore()
const bucket = ref(null)
const sessionCount = ref()

const router = useRouter()
const sessionStore = useSessionStore()
const backgroundStyle = computed(() => {
  return {
    backgroundImage: `url(/event/${sessionStore.eventId}/ui/main-bg.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }
})
function goAdmin() {
  router.push('/admin')
}

onMounted(() => {
  if (sessionStore.eventName==='') {
    router.push('/event')
  }
})

async function startEvent() {
  const time = new Date().toISOString()
    const setId = uuidv4()
    photoStore.setCreated(time)
    photoStore.setCurrentSubmissionId(setId)
   
    let session = await getSession()

    if (!session) {
        await updateSession({ id: 1, bucket: 'photos_1', session: 1 })
        session = await getSession()
    } else {
        session.session = (session.session || 0) + 1
        await updateSession({ session: session.session })
    }
    sessionCount.value = session.session
    const bucketNumber = Math.floor((session.session - 1) / 5) + 1
    const limitedBucketNumber = Math.min(bucketNumber, 20)
    const finalBucket = `photos_${limitedBucketNumber}`

    await updateSession({ bucket: finalBucket })

    bucket.value = finalBucket
    photoStore.setBucket(finalBucket)

    await saveSubmission({
        id: setId, 
        created_at: time, 
        event_name : sessionStore.eventName,
        selected_frame : null, 
        raw_photos: null,
        selected_filter : null, 
        filtered_photos : null, 
        final_photo: null, 
        emailed : false, 
        printed: false, 
        bucket_name : finalBucket, 
    })
  sessionStore.setStep('frame')
  router.push('/frame')
}
</script>
<template>
  <div
    class="h-dvh w-full flex flex-col text-font font-sunday overflow-hidden relative"
    :style="backgroundStyle"
  >

    <!-- ADMIN ICON -->
    <i
      class="pi pi-cog absolute top-6 right-6 text-2xl cursor-pointer 
             hover:rotate-90 transition duration-300"
      @click="goAdmin"
    ></i>

   
    <div
      class="mt-100 self-center bg-font font-serif text-bg text-4xl 
             px-20 pt-4 pb-5 rounded-full cursor-pointer 
             hover:scale-105 transition"
      @click="startEvent"
    >
      Mulai
    </div>

  </div>
</template>

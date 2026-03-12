<script setup>
import { useRouter } from 'vue-router'
import { useSessionStore } from '../stores/sessionStore'
import { usePhotoStore } from '../stores/photoStore'
import { updateSubmission } from '../services/indexesdb'
import { ref, onMounted, computed } from 'vue'
import { loadFrames } from '../utils/loadFrame'

const router = useRouter()
const session = useSessionStore()
const photo = usePhotoStore()

const frames = ref([])
const backgroundStyle = computed(() => {
  return {
    backgroundImage: `url(/event/${session.eventId}/ui/second-bg.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }
})

async function selectFrame(frame) {
  photo.setFrame(frame)
  await updateSubmission(photo.currentSubmissionId, {
    selected_frame: frame.id,
  })
  session.setStep('camera')
  router.push('/camera')
}

onMounted(async () => {
  if (!photo.currentSubmissionId) {
    session.setStep('home')
    router.push('/')
    return
  }

  if (!session.eventId) {
    router.push('/event')
    return
  }
  frames.value = await loadFrames(session.eventId) 
})
</script>

<template>
  <div
    class="h-dvh w-full flex flex-col overflow-hidden relative"
    :style="backgroundStyle"
  >  
    <h1 class="text-font text-center text-6xl font-sunday m-8 mt-25">
      PILIH FRAME
    </h1>

    <div class="flex flex-row overflow-x-auto bg-bg w-full gap-x-10 scrollbar-hide m-auto justify-center overflow-y-hidden">

      <div
        v-for="frame in frames"
        :key="frame.id"
        class="shrink-0 flex flex-col items-center mb-8"
      >
        <img
          :src="frame.image"
          :alt="frame.name"
          class="w-80"
          @click="selectFrame(frame)"
        />
      </div>

    </div>

  </div>
</template>

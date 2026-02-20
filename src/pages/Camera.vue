<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

import Countdown from '../components/Countdown.vue'
import { startCamera, capturePhoto, stopCamera } from '../services/camera'

import { usePhotoStore } from '../stores/photoStore'
import { useSessionStore } from '../stores/sessionStore'
import { getSubmissionById, updateSubmission } from '../services/indexesdb'

const router = useRouter()
const photoStore = usePhotoStore()
const sessionStore = useSessionStore()
const videoRef = ref(null)
const countdown = ref(0)
const scaleWidth = computed(() => {
  const slotWidth = photoStore.selectedFrame?.slots?.[1]?.width
  if (!slotWidth) return 1

  return 750 / slotWidth
})
const scaleHeight = computed(() => {
  const slotHeight = photoStore.selectedFrame?.slots?.[1]?.height
  if (!slotHeight) return 1

  return 560 / slotHeight
})

const maxPhotos = computed(() =>
  Number(photoStore.selectedFrame?.photoCount || 1)
)

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const startSession = async () => {
  await startCamera(videoRef.value) // pastiin kamera nyala dulu
  for (let i = photoStore.rawPhotos.length; i < maxPhotos.value; i++) {
    if (i>0){
      countdown.value=5
      await sleep(750)
    }
    await runCountdown()

    const photo = capturePhoto(videoRef.value)
    photoStore.addRawPhoto(photo)
  }
  const rawPhotosSnapshot = [...photoStore.rawPhotos]

  await updateSubmission(photoStore.currentSubmissionId, {
    raw_photos: rawPhotosSnapshot
  })
  sessionStore.setStep("filter")
  router.push("/filter")
}

function runCountdown() {
  return new Promise(resolve => {
    countdown.value = 5
    const timer = setInterval(() => {
      countdown.value--
      if (countdown.value === 0) {

        clearInterval(timer)
        resolve()
      }
    }, 1000)
  })
}

onMounted( async () => {
    console.log(`camera ${useSessionStore().eventName}`)

  if (!photoStore.currentSubmissionId){
    sessionStore.setStep('home')
    router.push('/')
    return 
  }
  if (!photoStore.selectedFrame) {
    sessionStore.setStep('frame')
    router.push('/frame')
    return
  }
  startSession()
})

onBeforeUnmount(async () => {
  stopCamera()
})

function toHome(){
  router.push('/')
}

</script>

<template>
  
  <div class="flex-col w-full h-dvh overflow-hidden flex ">
      <i class="pi pi-times text-font text-xl m-2" @click="toHome"></i>
      <div
        v-if="photoStore.selectedFrame"
        class="relative overflow-hidden rounded-xl bg-black self-center mt-8"
        :style="{
          width: `${photoStore.selectedFrame.slots[1].width * scaleWidth}px`,
          height: `${photoStore.selectedFrame.slots[1].height * scaleHeight}px`
        }"
      >
        <video
          ref="videoRef"
          autoplay
          playsinline
          muted
          class="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
        />
        <Countdown :value="countdown" />
      </div>

      <div class="flex justify-center gap-x-2 mt-3 bg-bg border-t-2 border-t-font flex-1 items-center">
          <div v-for="(photo, i) in photoStore.rawPhotos" :key="i" class="mt-2">
             <img
              :src="photo"
              class="w-48 rounded-2xl"
            />
          </div> 
      </div>
      
    </div>
</template>

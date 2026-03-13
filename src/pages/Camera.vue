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
const countdown = ref(5)
const previewPhoto = ref(null)
const retake = ref(false)

const backgroundStyle = computed(() => {
  return {
    backgroundImage: `url(/event/${sessionStore.eventId}/ui/second-bg.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }
})


function waitRetake() {
  return new Promise(resolve => {
    retake.value = false

    const timer = setTimeout(() => {
      resolve(false) // tidak retake
    }, 5000)

    const check = setInterval(() => {
      if (retake.value) {
        clearTimeout(timer)
        clearInterval(check)
        resolve(true) // retake
      }
    }, 100)
  })
}

const scaleWidth = computed(() => {
  const slotWidth = photoStore.selectedFrame?.slots?.[0]?.width
  if (!slotWidth) return 1

  return 750 / slotWidth
})
const scaleHeight = computed(() => {
  const slotHeight = photoStore.selectedFrame?.slots?.[0]?.height
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
    await runCountdown()

    const photo = capturePhoto(videoRef.value)
    previewPhoto.value = photo 

    const wantRetake = await waitRetake()
    previewPhoto.value = null

    if (wantRetake) {
      i-- // ulang foto yang sama
      await sleep(300)  
      continue
    }
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
  stopCamera()
  router.push('/')
}

</script>

<template>
  
  <div
    class="h-dvh w-full flex flex-col overflow-hidden relative"
    :style="backgroundStyle"
  >
      <div class="flex items-center gap-3 p-2">
        <i
          class="pi pi-times text-font text-xl cursor-pointer"
          @click="toHome"
        ></i>

        <button
          v-if="previewPhoto"
          @click="retake = true"
          class="bg-font px-4 py-1 rounded-2xl font-serif text-bg"
        >
          Retake
        </button>
      </div>
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
        v-show="!previewPhoto"
        class="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
      />

      <img
        v-show="previewPhoto"
        :src="previewPhoto"
        class="absolute inset-0 w-full h-full object-cover"
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

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePhotoStore } from '../stores/photoStore'
import { useSessionStore } from '../stores/sessionStore'
import QrDisplay from '../components/QrDisplay.vue'
import {
  createCanvas,
  drawFrame,
  drawPhoto,
  exportCanvas,
  destroyCanvas
} from '../services/canvas'
import { updateSubmission } from '../services/indexesdb'
import { createBaseOnce, uploadPhotoAndInsert } from '../services/supabase/upload'
import { base64ToBlob } from '../services/supabase/blob'

const photoStore = usePhotoStore()
const sessionStore = useSessionStore()
const router = useRouter()
const isDone = ref(false)
const isPrint = ref(false)
const isCreated = ref(false)
const previewIndex = ref(0)
let previewInterval = null

const previewPhoto = computed(() =>
  photoStore.filteredPhoto?.[previewIndex.value]
)

let countdownTimer = null

const resultImage = ref(null)


function startPreview() {
  previewInterval = setInterval(() => {
    previewIndex.value =
      (previewIndex.value + 1) % photoStore.filteredPhoto.length
  }, 700)
}

function stopPreview() {
  clearInterval(previewInterval)
  previewInterval = null
}


function addPadding(imageSrc, padLeft, padTop) {
  return new Promise((resolve) => {
    const img = new Image()
    img.src = imageSrc

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = img.width + padLeft
      canvas.height = img.height + padTop
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, padLeft, padTop)

      resolve(canvas.toDataURL('image/png'))
    }
  })
}

async function generateFinalPhoto() {
  const frame = photoStore.selectedFrame
  const photos = photoStore.filteredPhoto

  destroyCanvas()
  createCanvas(frame.canvas.width, frame.canvas.height)

  for (let i = 0; i < frame.slots.length; i++) {
    await drawPhoto(photos[i], frame.slots[i])
  }

  await drawFrame(frame.image)

  resultImage.value = exportCanvas('image/png', 1, 1)

  await updateSubmission(photoStore.currentSubmissionId, {
    final_photo: resultImage.value
  })
  const photosToSend = [
    resultImage.value ,
    ...photoStore.filteredPhoto           
  ]
  
  await createBaseOnce(photoStore.currentSubmissionId, sessionStore.eventName, photoStore.bucket_id)
  isCreated.value=true
  for (let index = 0; index < photosToSend.length; index++) {
      const photo = photosToSend[index]
      try {
        await uploadPhotoAndInsert({
          photo,
          baseId: photoStore.currentSubmissionId,
          bucket: photoStore.bucket_id,
          index
        })
      } catch (err) {
        console.error('FAILED AT INDEX', index, err)
        break 
      }
    }
  isDone.value = true    
  await updateSubmission(photoStore.currentSubmissionId, 
        {emailed : isDone.value}
    )
    
}


onMounted(async () => {
    console.log(`mount result ${useSessionStore().eventName}`)

  if (!photoStore.filteredPhoto?.length) {
    router.push('/')
    return
  }
  startPreview()
  await new Promise(r => setTimeout(r, 200))

  await updateSubmission(photoStore.currentSubmissionId, {
    filtered_photos: photoStore.filteredPhotos,
    selected_filter: photoStore.selectedFilter
  })
  await generateFinalPhoto()
})
onUnmounted(() => {
  stopPreview()
  clearInterval(countdownTimer)
  destroyCanvas()
})

async function next() {
  isPrint.value = true

  const paddedImage = await addPadding(resultImage.value, 26, 26)

  await sendToPrint(paddedImage)

  stopPreview()
  sessionStore.step = 'done'
  router.push('/done')
}

async function sendToPrint(base64Image) {
   try {
    const blob = await base64ToBlob(base64Image)
    const formData = new FormData()
    formData.append('file', blob, `${photoStore.currentSubmissionId}.png`)

    const data = await fetch('https://unhealed-snoopily-brynlee.ngrok-free.dev/photo', {
      method: 'POST',
      body: formData
    }) 
    await updateSubmission(photoStore.currentSubmissionId, 
        {printed : isPrint.value}
    )
  } catch (err) {
    console.error('Error sending to print:', err)
  }
  console.log(`result print ${useSessionStore().eventName}`)

}


function toHome(){
  sessionStore.setStep("home")
  router.push("/")
}


</script>
<template>
  <div class="flex flex-col h-dvh w-full">
     <div class="flex flex-row">
      <i class="pi pi-times text-font text-xl m-2" @click="toHome"></i>
          <div
        v-if="!isDone || isPrint"
        class="ml-auto mr-6 mt-2 w-12 h-12
              flex items-center justify-center"
      >
        <i class="pi pi-spin pi-spinner text-font text-2xl"></i>
      </div>
    <button
      v-else-if="isDone && !isPrint"
      @click="next"
      class="ml-auto mr-6 mt-2 px-6 py-2
            bg-font text-white font-serif text-lg
            rounded-full shadow-md
            active:scale-95 transition"
    >
      <i class="pi pi-print mr-2"></i>
      Print
    </button>


    </div>
      <div class="font-sunday text-6xl text-font text-center" @click="next">
        DOWNLOAD PHOTO
      </div>
      <div class="grid grid-cols-6 border-y-2 border-font mt-10  items-center">
        <div class="col-span-4 border-r-2 border-font flex items-center justify-center py-10">
          <img :src="previewPhoto" alt="" class="rounded-2xl">
        </div>
        <div class="col-span-2  flex-col flex py-10" v-show="isCreated">
          <QrDisplay
            :value="photoStore.currentSubmissionId"
            class="mx-auto"
          />
        </div>
      </div>
  </div>
</template>

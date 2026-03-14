<script setup>
import { ref, onMounted, onUnmounted, computed,onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { usePhotoStore } from '../stores/photoStore'
import { useSessionStore } from '../stores/sessionStore'
import { getSubmissionById } from '../services/indexesdb'
import { base64ToBlob } from '../services/supabase/blob'

const photoStore = usePhotoStore()
const session = useSessionStore()
const showKeychainModal = ref(false)
const selectedPhotos = ref([]) 
const backgroundStyle = computed(() => {
  return {
    backgroundImage: `url(/event/${session.eventId}/ui/second-bg.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }
})

const router = useRouter()
const countdown = ref(5)
let autoHomeTimer = null

function goHome(){
  clearTimeout(autoHomeTimer)
  router.push('/')
}

function startAutoHome() {
  autoHomeTimer = setTimeout(() => {
    goHome()
  }, 3000)
} 
function skipKeychain() {
  showKeychainModal.value = false
  goHome()
}

function togglePhoto(photo) {
  const index = selectedPhotos.value.indexOf(photo)

  if (index !== -1) {
    selectedPhotos.value.splice(index, 1)
  } else {
    if (selectedPhotos.value.length < 2) {
      selectedPhotos.value.push(photo)
    }
  }
}

onMounted(async () => {
  showKeychainModal.value = true
  
})

onBeforeUnmount(()=>{
   usePhotoStore().resetAll()
  if (timer) clearInterval(timer)
})

function drawFit(ctx, img, x, y, w, h) {
  const ratio = Math.min(w / img.width, h / img.height)

  const newWidth = img.width * ratio
  const newHeight = img.height * ratio

  const offsetX = x + (w - newWidth) / 2
  const offsetY = y + (h - newHeight) / 2

  ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight)
}

async function generateKeychainPrint() {

  showKeychainModal.value = false

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  canvas.width = 1231
  canvas.height = 1821

  ctx.fillStyle = "#ffffff"
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  const images = await Promise.all(
    selectedPhotos.value.map(src => {
      return new Promise(resolve => {
        const img = new Image()
        img.src = src
        img.onload = () => resolve(img)
      })
    })
  )

  // foto atas
  drawFit(ctx, images[0], 395, 400, 440, 330)

  // foto bawah
  drawFit(ctx, images[1], 395, 900, 440, 330)

  const base64 = canvas.toDataURL("image/png")

  await sendToPrint(base64)

  goHome()
}
async function sendToPrint(base64Image) {
  const blob = await base64ToBlob(base64Image)

  const formData = new FormData()
  formData.append("file", blob, "keychain.png")

  await fetch("https://unhealed-snoopily-brynlee.ngrok-free.dev/photo", {
    method: "POST",
    body: formData
  })
}
</script>

<template>
  <div
    class="h-dvh w-full flex flex-col text-font font-sunday overflow-hidden relative"
    :style="backgroundStyle"
  >
    <div class="my-auto">
        <div class="font-sunday text-7xl text-font text-center">
          TERIMA KASIH
        </div>
        <div class="bg-font text-bg font-serif italic text-center w-fit px-10 rounded-2xl py-2 text-xl my-5 mx-auto">
          Senang bisa menjadi bagian dari momenmu 
          <br>
          Follow instagram kami, <span class="text-amber-100">@dbooth.photo</span>
        </div>
    </div>
  </div>
  <div
    v-if="showKeychainModal"
    class="fixed inset-0 bg-black/60 flex items-center justify-center z-50 font-serif"
    >

    <div class="bg-white p-6 rounded-2xl w-125">

    <div class="text-xl font-bold mb-4 text-center text-font">
    <i>Jika ingin mencetak untuk keychain<br>
    pilih 2 foto</i>
    </div>

    <div class="grid grid-cols-2 gap-4">

    <img
    v-for="photo in photoStore.filteredPhoto"
    :key="photo"
    :src="photo"
    @click="togglePhoto(photo)"
    class="cursor-pointer rounded-xl border-4"
    :class="selectedPhotos.includes(photo) ? 'border-font' : 'border-transparent'"
    >

    </div>

    <div class="flex justify-center gap-4 mt-6">

    <button
    @click="skipKeychain"
    class="px-4 py-2 bg-gray-300 rounded-xl"
    >
    Skip
    </button>

    <button
    :disabled="selectedPhotos.length !== 2"
    @click="generateKeychainPrint"
    class="px-4 py-2 bg-font text-white rounded-xl"
    >
    Print Keychain
    </button>

    </div>

    </div>

    </div>
    
</template>

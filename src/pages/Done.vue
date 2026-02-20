<script setup>
import { ref, onMounted, onUnmounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { usePhotoStore } from '../stores/photoStore'
import { useSessionStore } from '../stores/sessionStore'
import { getSubmissionById } from '../services/indexesdb'

const router = useRouter()
const countdown = ref(5)
let timer = null

onMounted(async () => {
  timer = setInterval(() => {
    countdown.value--

    if (countdown.value <= 0) {
      clearInterval(timer)
      router.push('/')
    }
  }, 1000)
  console.log(`admin${useSessionStore().eventName}`)

  
})

onBeforeUnmount(()=>{
   usePhotoStore().resetAll()
  if (timer) clearInterval(timer)
})
</script>

<template>
  <div class="h-dvh w-full bg-bg flex flex-col">
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

 
</template>

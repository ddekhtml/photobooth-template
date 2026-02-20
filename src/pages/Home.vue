<script setup>
import { useRouter } from 'vue-router'
import { useSessionStore } from '../stores/sessionStore'
import { onMounted, computed } from 'vue'

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
  console.log(`home ${useSessionStore().eventName}`)

  if (!sessionStore.eventName) {
    router.push('/event')
  }
})

function startEvent() {
  sessionStore.setStep('tutorial')
  router.push('/tutorial')
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

    <h1 class="text-9xl self-center mt-25">
      {{ sessionStore.eventName }}
    </h1>

    <div
      class="mt-20 self-center bg-font font-serif text-bg text-4xl 
             px-20 pt-4 pb-5 rounded-full cursor-pointer 
             hover:scale-105 transition"
      @click="startEvent"
    >
      Mulai
    </div>

  </div>
</template>

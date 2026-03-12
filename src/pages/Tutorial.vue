<script setup>
import { useRouter } from 'vue-router';
import { useSessionStore } from '../stores/sessionStore';
import { onMounted, ref, computed } from 'vue';

const router = useRouter()
const sessionStore= useSessionStore()

function goHome(){
    sessionStore.resetSession()
    router.push('/')
}
const backgroundStyle = computed(() => {
  return {
    backgroundImage: `url(/event/${sessionStore.eventId}/ui/second-bg.png)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  }
})
onMounted(() => {
    console.log(`tutorial ${useSessionStore().eventName}`)

    if (sessionStore.step!=='tutorial'){
        goHome()
        return
    }
})

function startEvent(){
    sessionStore.setStep('frame')
    router.push('/frame')
}

</script>
<template>
    <div class="h-dvh w-full  flex flex-col overflow-hidden text-font bg-bg relative " :style="backgroundStyle">
        <!-- <div
    class="h-dvh w-full flex flex-col text-font font-sunday overflow-hidden relative"
    :style="backgroundStyle"
    > -->
        <div class="flex flex-row mt-1">
        <i class="pi pi-times text-font text-xl m-2" @click="goHome"></i>
        <i class="pi pi-arrow-right text-font text-2xl ml-auto mr-7 mt-2" @click="startEvent"></i>
    </div>
    </div>
</template>




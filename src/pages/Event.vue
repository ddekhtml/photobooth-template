<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useSessionStore } from '../stores/sessionStore'
import { setEvent } from '../services/supabase/upload'

const router = useRouter()
const sessionStore = useSessionStore()

const event_name = ref('')
const event_id = ref('')
const errorMsg = ref('')

async function save() {
  errorMsg.value = ''

  if (!event_id.value || !event_name.value) {
    errorMsg.value = 'Event ID dan Event Name wajib diisi'
    return
  }

  const time = new Date().toISOString()

  sessionStore.setEvent(
    event_id.value,
    event_name.value,
    time
  )
  await setEvent(event_name.value)
  event_name.value =""
  event_id.value=""
}

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="relative w-full h-dvh flex flex-col justify-center items-center bg-bg text-font font-serif gap-6">

    <!-- HOME ICON -->
    <i
      class="pi pi-home absolute top-6 left-6 text-2xl cursor-pointer hover:scale-110 transition"
      @click="goHome"
    ></i>

    <div class="text-4xl font-sunday">
      Setup Event
    </div>

    <div class="flex flex-col gap-4 w-80">

      <input
        v-model="event_name"
        type="text"
        placeholder="Event Name"
        class="px-4 py-3 rounded-xl border border-font/30 focus:outline-none focus:ring-2 focus:ring-font"
      />

      <input
        v-model="event_id"
        type="text"
        placeholder="Event ID"
        class="px-4 py-3 rounded-xl border border-font/30 focus:outline-none focus:ring-2 focus:ring-font"
      />

      <div
        @click="save"
        class="text-center cursor-pointer bg-font text-bg py-3 rounded-xl hover:scale-105 transition"
      >
        Save
      </div>

      <div v-if="errorMsg" class="text-red-500 text-sm text-center">
        {{ errorMsg }}
      </div>

    </div>

  </div>
</template>

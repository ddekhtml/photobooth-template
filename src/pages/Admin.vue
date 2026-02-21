<script setup>
import { ref, onMounted } from 'vue'
import { clearAllSubmissions, getAllSubmissions } from '../services/indexesdb'
import { useSessionStore } from '../stores/sessionStore'
import { useRouter } from 'vue-router'
import { clearAllsesi } from '../services/supabase/bucket'

function clearPhotos() {
  clearAllSubmissions()
}
function clearBucket() {
  clearAllsesi()
}

const datas = ref([])
const session = useSessionStore()
onMounted(async () => {
  datas.value = await getAllSubmissions()
})
const router = useRouter()

function toHome(){
    router.push('/')
}
function setevent(){
    router.push('/event')
}
</script>
<template>
  <div class="h-screen w-screen flex flex-col bg-bg text-font overflow-hidden">

    <div class="flex items-center justify-between px-8 py-5 border-b border-font/20">
      <div>
        <h1 class="font-sunday text-5xl">
          {{ session.eventName }}
        </h1>
        <p class="font-serif text-sm opacity-60">
          {{ session.eventDate }}
        </p>
      </div>

      <i
        class="pi pi-times text-2xl cursor-pointer hover:scale-110 transition"
        @click="toHome"
      ></i>
    </div>

    <!-- ACTION BUTTONS -->
    <div class="flex gap-4 px-8 py-4">
      <button
        @click="clearPhotos"
        class="px-4 py-2 rounded-xl bg-red-500 text-white shadow hover:scale-105 transition"
      >
        Delete Photo
      </button>

      <button
        @click="clearBucket"
        class="px-4 py-2 rounded-xl bg-yellow-500 text-white shadow hover:scale-105 transition"
      >
        Delete Bucket
      </button>

      <button
        @click="setevent"
        class="px-4 py-2 rounded-xl bg-font text-bg shadow hover:scale-105 transition"
      >
        Set Event
      </button>
    </div>

    <!-- TABLE -->
    <div class="flex-1 overflow-auto px-5 pb-6">
      <table class="min-w-full text-xs border-collapse">

        <thead class="bg-font text-bg font-serif">
          <tr>
            <th class="p-3">ID</th>
            <th class="p-3">Created</th>
            <th class="p-3">Event</th>
            <th class="p-3">Frame</th>
            <th class="p-3">Raw Photos</th>
            <th class="p-3">Filter</th>
            <th class="p-3">Filtered Photo</th>
            <th class="p-3">Final Photo</th>
            <th class="p-3">Printed</th>
            <th class="p-3">Emailed</th>
            <th class="p-3">Bucket</th>
          </tr>
        </thead>

        <tbody class="font-serif">
          <tr
            v-for="(item, index) in datas"
            :key="index"
            class="border-b border-font/20 hover:bg-white/5 transition"
          >
            <td class="p-3 text-center">
              {{ item.id?.slice(0,3) }}
            </td>
            <td class="p-3 text-center">
              {{
                new Date(item.created_at).toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit'
                })
              }}
            </td>
            <td class="p-3 text-center">
              {{ item.event_name?.slice(0,8) }}
            </td>
            <!-- Frame -->
            <td class="p-3 text-center">
              <span v-if="item.selected_frame">
                {{ item.selected_frame.id }}
              </span>
              <span v-else class="opacity-50">null</span>
            </td>
            <!-- Raw Photos -->
            <td class="p-3">
              <div
                v-if="item.selected_frame"
                class="flex flex-col gap-1"
              >
                <img
                  v-for="(photo, i) in item.raw_photos"
                  :key="i"
                  :src="photo"
                  class="w-16 rounded shadow"
                />
              </div>
              <div v-else class="opacity-50">none</div>
            </td>
            <!-- Filter -->
            <td class="p-3 text-center">
              <span v-if="item.selected_filter">
                {{ item.selected_filter }}
              </span>
              <span v-else class="opacity-50">null</span>
            </td>

            <td class="p-3">
              <div v-if="item.selected_frame" class="flex flex-wrap gap-1">
                <img
                  v-for="(photo,n) in item.filtered_photos"
                  :key="n"
                  :src="photo"
                  class="w-16 rounded shadow"
                >
              </div>
              <div v-else class="opacity-50">none</div>
            </td>

            <!-- Final Photo -->
            <td class="p-3 text-center">
              <img
                v-if="item.final_photo"
                :src="item.final_photo"
                class="w-20 rounded-lg shadow"
              >
            </td>

            <!-- Email -->
            <td class="p-3 text-center">
              {{ item.emailed }}
            </td>
            <td class="p-3 text-center">
              {{ item.printed }}
            </td>
            <td class="p-3 text-center">
              {{ item.bucket_name }}
            </td>
          </tr>
        </tbody>

      </table>
    </div>
  </div>
</template>

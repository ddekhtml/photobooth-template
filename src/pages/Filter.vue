<script setup>
import { ref,computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

import { filters } from '../config/filters'
import { usePhotoStore } from '../stores/photoStore'
import { useSessionStore } from '../stores/sessionStore'
import { applyFilterToImage } from '../services/filter'
import { getSubmissionById, updateSubmission } from '../services/indexesdb'

const router = useRouter()
const photoStore = usePhotoStore()
const sessionStore = useSessionStore()
const previewPhoto = computed(() =>
  photoStore.rawPhotos.at(-1)
)
const activeFilter = computed(() =>
  filters.find(f => f.id === photoStore.selectedFilter)
)
function selectFilter(filter) {
  photoStore.setFilter(filter.id)
}
async function next() {
  const result = []
    for (const photo of photoStore.rawPhotos) {
        const filtered = await applyFilterToImage(
        photo,
        activeFilter.value?.css || ''
        )
        result.push(filtered)
    }
  photoStore.setFilteredPhotos(result)
  sessionStore.step = 'result'
  router.push('/result')
}

onMounted(async() => {
    console.log(`filter ${useSessionStore().eventName}`)

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
  selectFilter({
    id: 'normal',
    name: 'Normal',
    css: ''
  },)
})

function toHome(){
  sessionStore.setStep("home")
  router.push("/")
}

</script>
<template>
  <div class="h-dvh w-full overflow-hidden text-font">
    <div class="flex flex-row">
      <i class="pi pi-times text-font text-xl m-2" @click="toHome"></i>
      <i class="pi pi-arrow-right text-font text-2xl ml-auto mr-7 mt-2" @click="next"></i>
    </div>
    <h1 class="text-font font-sunday text-6xl text-center -mt-2">PILIH FILTER</h1>
    <div class="mt-8 w-165 flex mx-auto">
      <img
        v-if="previewPhoto"
        :src="previewPhoto"
        class="w-full rounded-xl"
        :style="{ filter: activeFilter?.css }"
      />
    </div>
    <div
        ref="filterContainer"
        class="flex gap-4 overflow-x-auto overflow-y-hidden py-4 mt-4
                whitespace-nowrap flex-1 border-t-2 border-font
                justify-center px-6"
        >

  <div
    v-for="filter in filters"
    :key="filter.id"
    class="inline-flex flex-col items-center shrink-0 cursor-pointer transition-transform duration-200 active:scale-95"
    @click="selectFilter(filter)"
  >
    <img
      :src="previewPhoto"
      class="w-32 h-24 object-cover rounded-xl border-4 transition-all duration-200"
      :style="{ filter: filter.css }"
      :class="{
        'border-font scale-105': filter.id === photoStore.selectedFilter,
        'border-transparent': filter.id !== photoStore.selectedFilter
      }"
    />
    <p class="font-serif text-center text-sm mt-1">
      {{ filter.name }}
    </p>
  </div>

  <!-- COMING SOON CARD -->
  <div
    class="inline-flex flex-col justify-center items-center
           w-32 h-24 rounded-xl border-2 border-dashed border-font/60
           text-font/70 shrink-0"
  >
    <p class="font-serif text-sm text-center leading-tight">
      New filters are<br />coming soon 
    </p>
  </div>
</div>

  </div>
</template>

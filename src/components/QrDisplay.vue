<script setup>
import QrcodeVue from 'qrcode.vue'

const props = defineProps({
  value: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="p-4 rounded-xl shadow">
    <QrcodeVue
      :value="`https://dbooth.vercel.app/result/${props.value}`"
      :size="300"
      level="H"
    />
    <p class="text-xl text-font font-serif mt-2 text-center">
      Scan untuk download foto
    </p>
  </div>
</template>

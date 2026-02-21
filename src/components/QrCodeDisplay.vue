<script setup>
import { computed } from 'vue'
import QrcodeVue from 'qrcode.vue'

const props = defineProps({
  uuid: {
    type: String,
    required: true
  }
})

const qrValue = computed(() => {
  return `https://example.com/${props.uuid}`
})
</script>

<template>
  <div class="qr-wrapper">
    <QrcodeVue
      :value="qrValue"
      :size="300"
      level="H"
      render-as="svg"
      color="#8e2d2d"
    background="#f7f1eb"
    />
  </div>
</template>

<style scoped>
.qr-wrapper {
  width: 300px;
  height: 300px;
  display: block;
}
</style>
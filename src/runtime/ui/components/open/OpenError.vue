<script setup lang="ts">
import Button from '../elements/Button.vue'

defineProps<{
  error: any
}>()
const emit = defineEmits(['close'])
</script>

<template>
  <div class="h-full flex flex-col items-center pt-5">
    <Icon name="tabler:face-id-error" size="100" />
    <div text-faint>
      {{ error }}
    </div>
    <Gap />
    <Button label="Back" @click="emit('close')" />
  </div>
</template>

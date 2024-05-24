<script setup lang="ts">
import Error from '../elements/Error.vue'
import { ref, useDropZone, useFileDialog, watch } from '#imports'

const model = defineModel<File[]>()
const { files, open } = useFileDialog()
watch(files, (value) => {
  if (!value)
    return
  model.value = [...value]
})
const el = ref<HTMLDivElement>()
const error = ref()
const { isOverDropZone } = useDropZone(el, {
  onDrop(files: File[] | null) {
    if (!files)
      return
    model.value = [...files]
  },
  dataTypes: ['image/jpeg'],
})
</script>

<template>
  <Error v-if="error" :error />
  <div
    ref="el"
    class="relative min-h-20 rounded-xl card:rounded-none"
    :color="isOverDropZone ? 'primary' : 'default'"
  >
    <button
      class="fit flex items-center justify-center rounded-xl text-faint"
      border="2 neutral dashed"
      @[$click]="open()"
    >
      Upload files
    </button>
  </div>
</template>

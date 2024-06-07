<script setup lang="ts">
import Error from '../elements/Error.vue'
import { ref, useDropZone, useFileDialog, watch } from '#imports'

const props = withDefaults(defineProps<{
  accept?: string
}>(), {
  accept: '*',
})

const emit = defineEmits<{
  file: [file: File]
  files: [files: File[]]
}>()

// const model = defineModel<File[]>()
const { files, open } = useFileDialog({
  accept: props.accept,
})
watch(files, (value) => {
  if (!value)
    return
  emit('file', value[0])
  emit('files', [...value])
})
const el = ref<HTMLDivElement>()
const error = ref()
const { isOverDropZone } = useDropZone(el, {
  onDrop(files: File[] | null) {
    if (!files)
      return
    emit('file', files[0])
    emit('files', [...files])
  },
  dataTypes: [props.accept],
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
      Drop files here
    </button>
  </div>
</template>

<script setup lang="ts">
const { error } = defineProps<{
  error: Error | string
}>()
const text = computed(() => {
  if (!error)
    return ''
  if (typeof error === 'string')
    return error
  if (error.message)
    return error.message

  return 'Error'
})
</script>

<template>
  <div class="text-negative flex items-center gap-1 p-1">
    <div>
      <Icon name="material-symbols:error" />
    </div>
    <div>
      {{ text }}
    </div>
  </div>
</template>

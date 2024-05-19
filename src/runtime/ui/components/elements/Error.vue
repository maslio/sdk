<script setup lang="ts">
import { computed } from '#imports'

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
  <Transition
    appear
    appear-from-class="translate-y-20px opacity-0"
    appear-active-class="transition-100"
  >
    <div class="flex items-center gap-1 p-1 text-negative">
      <Icon name="material-symbols:error" size="16" />
      <div>
        {{ text }}
      </div>
    </div>
  </Transition>
</template>

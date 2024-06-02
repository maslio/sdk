<script setup lang="ts">
import { computed } from '#imports'

const { error } = defineProps<{
  error: any
}>()

const text = computed(() => {
  if (!error)
    return ''
  if (typeof error === 'string')
    return error
  if (error.message)
    return error.message
  if (error.errors.message)
    return error.errors.message
  return 'Error'
})
</script>

<template>
  <Transition
    appear
    appear-from-class="translate-y-20px opacity-0"
    appear-active-class="transition-100"
  >
    <div class="flex gap-1 p-1 text-negative">
      <div class="relative top--1px">
        <Icon name="material-symbols:error" size="16" />
      </div>
      <div>
        {{ text }}
      </div>
    </div>
  </Transition>
</template>

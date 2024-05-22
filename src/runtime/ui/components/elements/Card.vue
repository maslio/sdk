<script setup lang="ts">
import { computed } from '#imports'

const props = defineProps<{
  label?: string
  caption?: string
  grid?: '1' | '2' | '3'
  class?: any
}>()
defineSlots<{
  default: () => any
  label: () => any
}>()
const grid = computed(() => {
  if (props.grid === '1')
    return 'grid grid-cols-1'
  if (props.grid === '2')
    return 'grid grid-cols-2'
  if (props.grid === '3')
    return 'grid grid-cols-3'
  return ''
})
</script>

<template>
  <div>
    <div
      v-if="$slots.label || label"
      class="mb-1 truncate px-3 text-base font-300 first:mt-0 text-faint"
    >
      <slot v-if="$slots.label" name="label" />
      <span v-else>{{ label }}</span>
    </div>
    <div
      class="card overflow-hidden rounded-xl card:rounded-none dialog:rounded-none"
      color="default"
      :class="[$props.class, grid]"
    >
      <slot />
    </div>
    <div
      v-if="caption" mb-3
      mt-1
      pl-3 text-sm
      font-300 text-faint
    >
      {{ caption }}
    </div>
  </div>
</template>

<style>
.label {
  --uno: mb-1 truncate px-3 text-base font-300 first: mt-0 text-faint;
}
.card + .card {
  --uno: mt-4;
}
/* .card > *:not(.card):last-child hr {
  display: none;
} */
.card > .card {
  --uno: rounded-none;
}
.card {
  --unp: relative;
}
</style>

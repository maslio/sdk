<script setup lang="ts">
import Item from '../elements/Item.vue'

defineProps<{
  label?: string
  icon?: string
  focused?: boolean
  readonly?: boolean
  disabled?: boolean
  flat?: boolean
}>()
const emit = defineEmits(['click'])

defineSlots<{
  default: () => any
  left: () => any
  main: () => any
  right: () => any
}>()
</script>

<template>
  <Item :icon :class="{ focused: (focused && !readonly) }" @click="emit('click', $event)">
    <template #main>
      <div
        v-if="label"
        class="text-sm text-faint"
      >
        {{ label }}
      </div>
      <div
        v-if="$slots.default"
        class="flex items-center border-b-1 transition-200"
        light="border-b-neutral-200 focused:border-b-neutral-300 text-neutral-700"
        dark="border-b-dark-200 focused:border-b-neutral-400 text-neutral-300"
        :class="{ 'border-none!': flat || readonly }"
      >
        <slot name="default" />
      </div>
    </template>
    <template v-if="$slots.right" #right>
      <slot name="right" />
    </template>
  </Item>
</template>

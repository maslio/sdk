<script setup lang="ts">
import Item from '../elements/Item.vue'
import InputOptionDot from './InputOptionDot.vue'
import { computed } from '#imports'

const { value, readonly } = defineProps<{
  label?: string
  caption?: string
  value?: string | number | boolean
  readonly?: boolean
}>()
defineSlots<{
  default: (props: {
    active: boolean
  }) => any
  label: () => any
}>()
const model = defineModel<string | number | boolean>()
const active = computed(() => model.value === value)
function toggle() {
  if (readonly)
    return
  model.value = value
}
</script>

<template>
  <Item
    :label :clickable="!readonly"
    :caption
    @click="toggle"
  >
    <template #left>
      <InputOptionDot :active />
    </template>
    <template v-if="$slots.default" #default>
      <slot :active />
    </template>
    <template v-if="$slots.main" #label>
      <slot name="label" />
    </template>
  </Item>
</template>

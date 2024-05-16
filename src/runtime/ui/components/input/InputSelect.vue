<script setup lang="ts">
import type { Props as SelectProps } from './Select.vue'

interface Props extends SelectProps {
  label: string
}
const { options } = defineProps<Props>()
const model = defineModel<string | number>()
const value = computed(() => {
  if (model.value == null)
    return ''
  const option = options.find(o => o.value === model.value)
  if (option)
    return option.label
  return model.value
})
</script>

<template>
  <Item :label :value>
    <Select v-model="model" v-bind="$props" />
  </Item>
</template>

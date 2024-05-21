<script setup lang="ts">
import Item from '../elements/Item.vue'
import type { Props as SelectProps } from './Select.vue'
import Select from './Select.vue'
import { computed } from '#imports'

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
    return option.item.label
  return String(model.value)
})
</script>

<template>
  <Item :label :value>
    <template #page>
      <Select v-model="model" v-bind="$props" />
    </template>
  </Item>
</template>

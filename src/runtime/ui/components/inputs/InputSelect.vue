<script setup lang="ts">
import Item from '../elements/Item.vue'
import { openRef } from '../../utils/open'
import type { Props as SelectProps } from './Select.vue'
import Select from './Select.vue'
import { computed } from '#imports'

interface Props extends SelectProps {
  label: string
  autoClose?: boolean
}
defineOptions({
  inheritAttrs: false,
})
const { options, autoClose } = defineProps<Props>()
const model = defineModel<string | number>()
const value = computed(() => {
  if (model.value == null)
    return ''
  const option = options.find(o => o.value === model.value)
  if (option)
    return option.item.label
  return String(model.value)
})
const open = openRef()
function onUpdate() {
  if (autoClose)
    open?.value.close()
}
</script>

<template>
  <Item :label :value :open="{ ref: open }" />
  <Open ref="open">
    <Select
      v-model="model"
      v-bind="$props"
      @update:model-value="onUpdate"
    />
  </Open>
</template>

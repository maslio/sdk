<script setup lang="ts">
import Item from '../elements/Item.vue'
import List from '../elements/List.vue'
import type { Option, Value } from './Select.vue'

export interface Props {
  options: Option[]
  input?: boolean
}
const { options } = defineProps<Props>()
const model = defineModel<Value[]>({ default: [] })

function items(_input: string) {
  const input = _input.trim().toLocaleLowerCase()
  if (!input)
    return options
  return options.filter(o =>
    o.item.label?.toLowerCase().includes(input)
    || o.item.caption?.toLowerCase().includes(input)
    || o.item.value?.toLowerCase().includes(input),
  )
}

function onSelect(option: Option) {
  model.value = model.value.includes(option.value)
    ? model.value.filter(value => value !== option.value)
    : [...model.value, option.value]
}
</script>

<template>
  <List
    v-slot="{ item }" :items
    keys="value"
    :input :input-debounce="0"
  >
    <Item
      v-bind="item.item"
      :selected="model.includes(item.value)"
      option
      @click="onSelect(item)"
    />
  </List>
</template>

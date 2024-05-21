<script setup lang="ts">
import Item from '../elements/Item.vue'
import List from '../elements/List.vue'

export interface Option {
  value: string | number
  label: string
  icon?: string
  caption?: string
}
export type Value = string | number
export interface Props {
  options: Option[]
  input?: boolean
}
const { options } = defineProps<Props>()
const model = defineModel<Value>()

function items(_input: string) {
  const input = _input.trim().toLowerCase()
  if (!input)
    return options
  return options.filter(o => o.label.toLowerCase().includes(input))
}

function onSelect(option: Option) {
  model.value = option.value
}
</script>

<template>
  <List
    :items
    keys="value"
    :input :input-debounce="0"
  >
    <template #default="{ item }">
      <Item
        :label="item.label"
        :icon="item.icon"
        :caption="item.caption"
        :selected="model === item.value"
        option
        @click="onSelect(item)"
      />
    </template>
  </List>
</template>

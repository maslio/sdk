<script setup lang="ts">
export interface Option {
  value: string | number
  label: string
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
  const input = _input.trim().toLocaleLowerCase()
  if (!input)
    return options
  return options.filter(o => o.label.toLowerCase().includes(input))
}

function onSelect(option: Option) {
  model.value = option.value
}
</script>

<template>
  <List v-slot="{ item }" :items keys="value" :input :input-debounce="0">
    <Item
      :label="item.label"
      :caption="item.caption"
      :selected="model === item.value"
      option
      @click="onSelect(item)"
    />
  </List>
</template>

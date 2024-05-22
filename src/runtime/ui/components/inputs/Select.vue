<script setup lang="ts">
import Item, { type Props as ItemProps } from '../elements/Item.vue'
import List from '../elements/List.vue'
import { ref, watch } from '#imports'

export interface Option {
  value: string | number
  item: ItemProps
}
export type Value = string | number
export interface Props {
  options: Option[]
  input?: boolean
}
const props = defineProps<Props>()
const model = defineModel<Value>()

function items(_input: string) {
  const input = _input.trim().toLowerCase()
  if (!input)
    return props.options
  return props.options.filter(o =>
    o.item.label?.toLowerCase().includes(input)
    || o.item.caption?.toLowerCase().includes(input)
    || o.item.value?.toLowerCase().includes(input),
  )
}

function onSelect(option: Option) {
  model.value = option.value
}
const list = ref()
watch(() => props.options, () => list.value.fetch())
</script>

<template>
  <List
    ref="list"
    :items keys="value"
    :input :input-debounce="0"
  >
    <template #default="{ item }">
      <Item
        v-bind="item.item"
        :selected="model === item.value"
        :option="true"
        @click="onSelect(item)"
      />
    </template>
  </List>
</template>

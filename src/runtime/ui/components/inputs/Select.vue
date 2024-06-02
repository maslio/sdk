<script setup lang="ts">
import Checkbox from '../elements/Checkbox.vue'
import Item, { type Props as ItemProps } from '../elements/Item.vue'
import List from '../elements/List.vue'
import { computed, ref, watch } from '#imports'

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

const items = computed(() => {
  const _input = ''
  const input = _input.trim().toLowerCase()
  if (!input)
    return props.options
  return props.options.filter(o =>
    o.item.label?.toLowerCase().includes(input)
    || o.item.caption?.toLowerCase().includes(input)
    || o.item.value?.toLowerCase().includes(input),
  )
})

function onSelect(option: Option) {
  model.value = option.value
}
const list = ref()
</script>

<template>
  <List
    ref="list"
    :items
    item-key="value"
  >
    <template #default="{ item }">
      <Item
        v-bind="item.item"
        :selected="model === item.value"
        :option="true"
        clickable
        @click="onSelect(item)"
      >
        <template #left>
          <Checkbox :selected="model === item.value" />
        </template>
      </Item>
    </template>
  </List>
</template>

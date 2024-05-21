<script setup lang="ts">
import Item from '../elements/Item.vue'
import SelectMulti from './SelectMulti.vue'
import type { Value } from './Select.vue'
import type { Props as SelectProps } from './SelectMulti.vue'
import { computed } from '#imports'

interface Props extends SelectProps {
  label: string
}
defineProps<Props>()
const model = defineModel<Value[]>({ default: [] })

const value = computed(() => {
  return String(model.value.length)
})
</script>

<template>
  <Item :label :value>
    <template #page>
      <SelectMulti v-model="model" v-bind="$props" />
    </template>
  </Item>
</template>

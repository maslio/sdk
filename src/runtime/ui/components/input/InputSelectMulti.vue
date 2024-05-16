<script setup lang="ts">
import type { Value } from './Select.vue'
import type { Props as SelectProps } from './SelectMulti.vue'

interface Props extends SelectProps {
  label: string
}
defineProps<Props>()
const model = defineModel<Value[]>({ default: [] })

const value = computed(() => {
  return model.value.length
})
</script>

<template>
  <Item :label :value>
    <SelectMulti v-model="model" v-bind="$props" />
  </Item>
</template>

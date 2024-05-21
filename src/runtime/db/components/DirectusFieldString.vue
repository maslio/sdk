<script setup lang="ts">
import type { Field } from '@directus/types'
import InputString from '../../ui/components/inputs/InputString.vue'

const props = defineProps<{
  field: Field
  value?: string
}>()

const label = props.field.meta?.field
const model = defineModel<string>({ default: '' })
</script>

<template>
  <InputString
    v-model="model"
    :label
  />
</template>

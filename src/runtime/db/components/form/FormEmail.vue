<script setup lang="ts">
import type { Field } from '@directus/types'
import InputString from '../../../ui/components/inputs/InputString.vue'

defineProps<{
  field: Field
  label: string
  value?: string
  error?: boolean
}>()

const model = defineModel<string>({ default: '' })
</script>

<template>
  <InputString
    v-model="model"
    :label
    :error
    type="email"
  />
</template>

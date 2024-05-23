<script setup lang="ts">
import type { Field } from '@directus/types'
import InputString from '../../ui/components/inputs/InputString.vue'

defineProps<{
  field: Field
  label: string
  value?: string
}>()

const model = defineModel<string>({ default: '' })
</script>

<template>
  <InputString
    v-model="model"
    :label
  />
</template>

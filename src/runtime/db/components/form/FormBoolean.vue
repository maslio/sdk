<script setup lang="ts">
import type { Field } from '@directus/types'
import InputToggle from '../../../ui/components/inputs/InputToggle.vue'

defineProps<{
  field: Field
  label: string
  value?: string
}>()

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <InputToggle
    v-model="model"
    :label="label"
  />
</template>

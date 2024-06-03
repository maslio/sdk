<script setup lang="ts">
import type { Field } from '@directus/types'
import InputSelect from '../../../ui/components/inputs/InputSelect.vue'

const { field } = defineProps<{
  field: Field
  label: string
  value?: string
}>()

// @ts-expect-error this is ok
const options = field.meta?.options.choices.map(opt => ({
  value: opt.value,
  item: {
    label: opt.text,
  },
}))

const model = defineModel<string>()
</script>

<template>
  <InputSelect
    v-model="model"
    :label="label"
    :options
    auto-close
  />
</template>

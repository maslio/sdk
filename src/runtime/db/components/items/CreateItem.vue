<script setup lang="ts">
import { createItem } from '@directus/sdk'
import Form from '../form/Form.vue'
import { useDirectus } from '../../composables/useDirectus'

const props = defineProps<{
  collection: string
  fields: string | string[]
  values?: Record<string, any>
  labels?: Record<string, string>
  submitLabel?: string
}>()
const emit = defineEmits(['save'])
const { requestAny } = useDirectus()

async function submit(values: Record<string, any>) {
  const item = await requestAny(createItem(props.collection, values))
  emit('save', item)
}
</script>

<template>
  <Form
    v-bind="$props"
    :submit
  />
</template>

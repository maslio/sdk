<script setup lang="ts">
import { readItem, updateItem } from '@directus/sdk'
import { defu } from 'defu'
import { flatten } from 'lodash-es'
import Form, { type Group } from '../form/Form.vue'
import { useDirectus } from '../../composables/useDirectus'

const props = defineProps<{
  collection: string
  id: string | number
  fields?: string | string[]
  groups?: Group[]
  values?: Record<string, any>
  labels?: Record<string, string>
  submitLabel?: string
}>()
const emit = defineEmits(['save'])
const { requestAny } = useDirectus()

function arrify(input: string | string[]): string[] {
  return typeof input === 'string' ? input.split(' ') : input
}
const fields = props.groups
  ? flatten(props.groups.map(g => arrify(g.fields)))
  : props.fields ? arrify(props.fields) : []

const values = await requestAny(readItem(props.collection, props.id, { fields })) as Record<string, any>

async function submit(values: Record<string, any>) {
  const item = await requestAny(updateItem(props.collection, props.id, values))
  emit('save', item)
}
</script>

<template>
  <Form
    v-bind="$props"
    :values="defu(values, props.values)"
    :submit
  />
</template>

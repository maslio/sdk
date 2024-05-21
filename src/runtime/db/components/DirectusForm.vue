<script setup lang="ts">
import { readFieldsByCollection, readItem, updateItem } from '@directus/sdk'
import type { Field } from '@directus/types'
import { useDirectus } from '../composables/useDirectus'
import Card from '../../ui/components/elements/Card.vue'
import Button from '../../ui/components/elements/Button.vue'
import DirectusField from './DirectusField.vue'
import { reactive } from '#imports'

const props = withDefaults(defineProps<{
  collection: string
  fields: string[]
  id?: string | number
  values?: Record<string, any>
  saveLabel?: string
  save?: (data: Record<string, any>) => any
}>(), {
  saveLabel: 'Save',
})
const emit = defineEmits(['save'])

if (!props.id && !props.values)
  throw new Error('Required at least id or values')

const { requestAny } = useDirectus()

const allFields = await requestAny(readFieldsByCollection(props.collection)) as Field[]
const fields = props.fields.map((key) => {
  const field = allFields.find(f => f.field === key)
  if (!field)
    throw new Error(`field '${key}' is not found in collection ${props.collection}`)
  return field
})
const values = reactive(
  props.id
    ? await requestAny(readItem(props.collection, props.id, { fields: props.fields })) as Record<string, any>
    : Object.fromEntries(
      props.fields.map(key => [key, props.values?.[key] ?? null]),
    ),
)
async function save() {
  if (props.save)
    await props.save(values)
  else if (props.id)
    await requestAny(updateItem(props.collection, props.id, values))
  emit('save', values)
}
</script>

<template>
  <Card>
    <DirectusField
      v-for="field in fields" :key="field.field"
      v-model="values[field.field]"
      :field="field"
    />
  </Card>
  <Button :label="saveLabel" :action="save" />
</template>

<script setup lang="ts">
import { readFieldsByCollection, readItem, updateItem } from '@directus/sdk'
import type { Field } from '@directus/types'
import { titleCase } from 'scule'
import { useDirectus } from '../composables/useDirectus'
import Card from '../../ui/components/elements/Card.vue'
import Button from '../../ui/components/elements/Button.vue'
import { defineAsyncComponent, reactive, ref, watch } from '#imports'

const props = defineProps<{
  collection: string
  fields: string[]
  id?: string | number
  values?: Record<string, any>
  labels?: Record<string, string>
  saveLabel?: string
  save?: (data: Record<string, any>) => any
}>()
const emit = defineEmits(['save'])

if (!props.id && !props.values)
  throw new Error('Required at least id or values')

const { requestAny } = useDirectus()

function getFieldComponent(_field: Field) {
  return defineAsyncComponent(() => import('./FormString.vue'))
}

function getFieldLabel(field: Field) {
  if (props.labels && props.labels[field.field])
    return props.labels[field.field]
  return titleCase(field.field)
}

const allFields = await requestAny(readFieldsByCollection(props.collection)) as Field[]
const fields = props.fields.map((key) => {
  const field = allFields.find(f => f.field === key)
  if (!field)
    throw new Error(`field '${key}' is not found in collection ${props.collection}`)
  return {
    key: field.field,
    error: ref(false),
    field,
    label: getFieldLabel(field),
    component: getFieldComponent(field),
  }
})
const values = reactive(
  props.id
    ? await requestAny(readItem(props.collection, props.id, { fields: props.fields })) as Record<string, any>
    : Object.fromEntries(
      props.fields.map(key => [key, props.values?.[key] ?? null]),
    ),
)

const errors = reactive(Object.fromEntries(
  fields.map(field => [field.key, false]),
))

watch(values, () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = false
  })
})

async function save() {
  try {
    if (props.save)
      await props.save(values)
    else if (props.id)
      await requestAny(updateItem(props.collection, props.id, values))
    emit('save', values)
  }
  catch (e: any) {
    if (e.errors) {
      const field = e.errors[0].extensions.field
      errors[field] = true
      throw new Error(e.errors[0].message)
    }
    throw new Error(e)
  }
}
</script>

<template>
  <Card>
    <Component
      :is="field.component"
      v-for="field in fields"
      :key="field.key"
      v-model="values[field.key]"
      :field="field.field"
      :label="field.label"
      :error="errors[field.key]"
    />
  </Card>
  <Button :label="saveLabel ?? $t('save')" :click="save" color="primary" />
</template>

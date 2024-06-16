<script setup lang="ts">
import { readFieldsByCollection } from '@directus/sdk'
import type { Field } from '@directus/types'
import { titleCase } from 'scule'
import { defu } from 'defu'
import { flatten } from 'lodash-es'
import { useDirectus } from '../../composables/useDirectus'
import Card from '../../../ui/components/elements/Card.vue'
import Button from '../../../ui/components/elements/Button.vue'
import { defineAsyncComponent, reactive, ref, watch } from '#imports'

defineOptions({
  inheritAttrs: false,
})
const props = defineProps<{
  collection: string
  fields?: string | string[]
  groups?: Group[]
  values?: Record<string, any>
  labels?: Record<string, string>
  submitLabel?: string
  submit: (data: Record<string, any>) => any
}>()

const emit = defineEmits(['submit'])

const { requestAny } = useDirectus()

export interface Group {
  label?: string
  fields: string | string[]
}

function arrify(input: string | string[]): string[] {
  return typeof input === 'string' ? input.split(' ') : input
}

const fields = props.groups
  ? flatten(props.groups.map(g => arrify(g.fields)))
  : props.fields ? arrify(props.fields) : []

function getFieldComponent(field: Field) {
  if (field.meta?.interface === 'select-dropdown')
    return defineAsyncComponent(() => import('./FormSelect.vue'))
  if (field.type === 'boolean')
    return defineAsyncComponent(() => import('./FormBoolean.vue'))
  return defineAsyncComponent(() => import('./FormString.vue'))
}

function getFieldLabel(field: Field) {
  if (props.labels && props.labels[field.field])
    return props.labels[field.field]
  return titleCase(field.field)
}

const directusFields = await requestAny(readFieldsByCollection(props.collection)) as Field[]

const data = fields.map((key) => {
  const field = directusFields.find(f => f.field === key)
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

const groups = props.groups ?? [{ fields }]
function getGroupFields(fields: string | string[]) {
  fields = arrify(fields)
  return data.filter(d => fields.includes(d.key))
}
// const groups = (function () {
//   const groups = []
//   if (props.groups) {
//     for (const group of props.groups) {
//       const fields = arrify(group.fields).map(f => data.find(d => d.key === f))
//       groups.push({
//         id: nanoid(),
//         fields,
//       })
//     }
//   }
//   else {
//     groups.push({
//       id: nanoid(),
//       fields: data,
//     })
//   }
//   return groups
// })()

const values = reactive(
  Object.fromEntries(
    fields.map(key => [key, props.values?.[key] ?? null]),
  ),
)

const errors = reactive(Object.fromEntries(
  data.map(field => [field.key, false]),
))

watch(values, () => {
  Object.keys(errors).forEach((key) => {
    errors[key] = false
  })
})

async function save() {
  const data = defu(values, props.values)
  try {
    if (props.submit)
      await props.submit(data)
    emit('submit', data)
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
  <Card v-for="(group, index) in groups" :key="index">
    <Component
      :is="field.component"
      v-for="field in getGroupFields(group.fields)"
      :key="field.key"
      v-model="values[field.key]"
      :field="field.field"
      :label="field.label"
      :error="errors[field.key]"
    />
  </Card>
  <Button :label="submitLabel ?? $t('save')" :click="save" color="primary" />
</template>

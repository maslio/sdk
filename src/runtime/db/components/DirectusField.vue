<script setup lang="ts">
import type { Field } from '@directus/types'
import { defineAsyncComponent, ref, syncRef } from '#imports'

defineProps<{
  field: Field
}>()
const model = defineModel()
const component = defineAsyncComponent(() => import('./DirectusFieldString.vue'))
const _model = ref<string>(model.value as string)

syncRef(model, _model, { direction: 'rtl' })
</script>

<template>
  <Component
    :is="component"
    v-model="_model"
    :field
  />
</template>

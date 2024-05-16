<script setup lang="ts">
import type { Component } from 'vue'
import type { Placement as FloatPlacement } from './OpenFloat.vue'
import type { Placement as ModalPlacement } from './OpenModal.vue'
import OpenNext from './OpenNext.vue'
import OpenModal from './OpenModal.vue'
import OpenFloat from './OpenFloat.vue'
import OpenFull from './OpenFull.vue'
import OpenDialog from './OpenDialog.vue'
import { computed, ref } from '#imports'

export type Target = 'next' | 'modal' | 'full' | 'dialog' | 'float'
export interface Props {
  label?: string
  width?: number
  target?: Target
  mobile?: Target
  header?: boolean
  parent?: HTMLElement
  placement?: FloatPlacement | ModalPlacement
  blur?: boolean
  component?: Component
  props?: Record<string, any>
}
const props = withDefaults(defineProps<Props>(), {
  target: 'next',
  blur: true,
})
defineSlots<{
  default: () => any
  target: (props: {
    close: () => void
  }) => any
}>()
const is = computed(() => {
  const target = props.mobile ?? props.target
  if (target === 'next')
    return OpenNext
  if (target === 'modal')
    return OpenModal
  if (target === 'float')
    return OpenFloat
  if (target === 'full')
    return OpenFull
  if (target === 'dialog')
    return OpenDialog
  return OpenNext
})
const selected = defineModel<boolean>({ default: false })
const target = ref()
function open() {
  target.value?.open()
}
function close() {
  target.value?.close()
}
defineExpose({ open, close })
</script>

<template>
  <Component
    :is="is"
    ref="target"
    v-model="selected"
    v-bind="$props"
  >
    <Component :is="$props.component" v-if="$props.component" v-bind="$props.props" />
    <slot v-else />
  </Component>
</template>

<script setup lang="ts">
import { defu } from 'defu'
import type { Component } from '#imports'
import { computed, defineAsyncComponent, ref, shallowRef } from '#imports'

type Target = 'next' | 'bottom' | 'top' | 'new' | 'full' | 'center'

interface Props {
  id?: number | string
  target?: Target
  label?: string
  caption?: string
  props?: Record<string, any>
  component?: Component
}

const props = withDefaults(defineProps<Props>(), {
  target: 'next',
})

const targetIs = computed(() => {
  if (props.target === 'next')
    return defineAsyncComponent(() => import('./OpenNext.vue'))
  return defineAsyncComponent(() => import('./OpenDialog.vue'))
})
const targetRef = ref()
const id = ref()
const data = shallowRef<Props>({})

function open(_data: Omit<Props, 'target'> = {}) {
  id.value = _data.id
  data.value = defu<Props, any>(_data, props)
  targetRef.value.open()
}
function close() {
  targetRef.value.close()
}
function opened(_id: typeof id['value']) {
  return _id === id.value
}
function onClose() {
  id.value = null
}

defineExpose({ open, close, opened })
</script>

<template>
  <component
    :is="targetIs"
    ref="targetRef"
    :target="target"
    v-bind="data"
    @close="onClose"
  >
    <slot v-if="$slots.default" v-bind="data" />
    <component :is="data.component" v-else-if="data.component" v-bind="data.props" />
  </component>
</template>

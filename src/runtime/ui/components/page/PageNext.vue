<script setup lang="ts">
import { useLayout } from '../../composables/useLayout'
import Layout from '../layout/Layout.vue'
import Spinner from '../elements/Spinner.vue'
import PageError from './PageError.vue'
import { type Ref, computed, getCurrentInstance, onErrorCaptured, ref, refDebounced } from '#imports'

defineOptions({
  inheritAttrs: false,
})
const { label, width } = defineProps<{
  label?: string
  width?: number
  target: 'next' | 'full'
}>()
const id = (import.meta.dev ? label : null) ?? String(getCurrentInstance()?.uid)
const pending = ref(false)
const error = ref<Error | null>(null)
const { nextId, nextEl, isMini } = useLayout()
const opened = computed(() => nextId.value === id)
function open() {
  error.value = null
  nextId.value = id
}
function close() {
  nextId.value = null
}
defineExpose({
  open,
  close,
  opened,
  pending: refDebounced(pending, 50),
})
onErrorCaptured((e: Error) => {
  error.value = e
  pending.value = false
  console.error(e)
  return false
})

const transition = {
  'enter-from-class': 'translate-x--3 mobile:translate-x-0!',
  'enter-active-class': 'transition-100 mobile:transition-300',
  'leave-active-class': 'mobile:transition-300 v-leave-active',
  'leave-to-class': 'translate-x-0!',
}
const transitionFull = {
  'enter-from-class': 'translate-x-10 mobile:translate-x-0!',
  'enter-active-class': 'transition-200 mobile:transition-300',
  'leave-active-class': 'transition-100 mobile:transition-300 v-leave-active',
  'leave-to-class': 'translate-x-10 opacity-0 mobile:translate-x-0! mobile:opacity-100',
}
</script>

<template>
  <Teleport v-if="nextEl" :to="nextEl">
    <Transition
      v-bind="target === 'full' ? transitionFull : transition"
    >
      <Layout
        v-if="opened" v-show="!pending"
        :width="width"
        :label
        :close
        :close-icon="isMini ? 'back' : 'close'"
        :class="{ hidden: pending, full: target === 'full' }"
        class="mobile:translate-x--100%"
      >
        <PageError v-if="error" :error @close="close" />
        <Suspense v-else @resolve="pending = false" @pending="pending = true">
          <slot />
          <template #fallback>
            <div class="h-100px flex items-center justify-center">
              <Spinner />
            </div>
          </template>
        </Suspense>
      </Layout>
    </Transition>
  </Teleport>
</template>

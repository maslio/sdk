<script setup lang="ts">
import { useLayout } from '../../composables/useLayout'
import Layout from '../layout/Layout.vue'
import Spinner from '../elements/Spinner.vue'
import PageError from './PageError.vue'
import { computed, getCurrentInstance, onErrorCaptured, ref } from '#imports'

defineOptions({
  inheritAttrs: false,
})
const { label, width } = defineProps<{
  label?: string
  width?: number
}>()
const id = (import.meta.dev ? label : null) ?? String(getCurrentInstance()?.uid)
const loading = ref(true)
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
defineExpose({ open, close, opened })
onErrorCaptured((e: Error) => {
  error.value = e
  loading.value = false
  console.error(e)
  return false
})
</script>

<template>
  <Teleport v-if="nextEl" :to="nextEl">
    <Transition
      enter-from-class="translate-x-0!"
      enter-active-class="mobile:transition-300"
      leave-active-class="mobile:transition-300 v-leave-active"
      leave-to-class="translate-x-0!"
    >
      <Layout
        v-if="opened" :width="width"
        :label
        class="mobile:translate-x--100%"
        :close
        :close-icon="isMini ? 'back' : 'close'"
      >
        <PageError v-if="error" :error @close="close" />
        <Suspense v-else @resolve="loading = false" @pending="loading = true">
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

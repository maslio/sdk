<script setup lang="ts">
import Spinner from '../elements/Spinner.vue'
import Layout from '../layout/Layout.vue'
import PageError from './PageError.vue'
import { onErrorCaptured, ref, refDebounced } from '#imports'

defineOptions({
  inheritAttrs: false,
})
defineProps<{
  label?: string
  width?: number
}>()
const opened = ref(false)
const pending = ref(false)
const error = ref<Error | null>(null)
function close() {
  opened.value = false
}
function open() {
  error.value = null
  opened.value = true
}
onErrorCaptured((e: Error) => {
  error.value = e
  pending.value = false
  console.error(e)
  return false
})

defineExpose({
  open,
  close,
  opened,
  pending: refDebounced(pending, 50),
})
</script>

<template>
  <Teleport to="#__nuxt">
    <Transition
      enter-from-class="translate-x-100% desktop:translate-x-320px desktop:opacity-0"
      enter-active-class="transition-300"
      leave-active-class="transition-200 v-leave-active"
      leave-to-class="translate-x-100% desktop:translate-x-320px desktop:opacity-0"
    >
      <Layout
        v-if="opened" v-show="!pending"
        :label
        :width
        :no-header="!label"
        :close
        close-icon="back"
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

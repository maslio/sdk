<script setup lang="ts">
import Spinner from '../elements/Spinner.vue'
import Layout from '../layout/Layout.vue'
import OpenError from './OpenError.vue'
import { onErrorCaptured, ref } from '#imports'

defineOptions({
  inheritAttrs: false,
})
defineProps<{
  label?: string
  width?: number
}>()
const selected = defineModel<boolean>({ default: false })
const loading = ref(true)
const error = ref<Error | null>(null)
function close() {
  selected.value = false
}
function open() {
  error.value = null
  selected.value = true
}
defineExpose({ open, close })
onErrorCaptured((e: Error) => {
  error.value = e
  loading.value = false
  console.error(e)
  return false
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
        v-if="selected"
        :label
        :width
        :no-header="!label"
        :close
        close-icon="back"
      >
        <OpenError v-if="error" :error @close="close" />
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

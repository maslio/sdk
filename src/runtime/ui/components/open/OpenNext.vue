<script setup lang="ts">
import { useLayout } from '../../composables/useLayout'
import Layout from '../layout/Layout.vue'
import OpenLoading from './OpenLoading.vue'
import OpenError from './OpenError.vue'
import { computed, getCurrentInstance, onErrorCaptured, ref, syncRefs } from '#imports'

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
const selected = defineModel<boolean>()
const isOpened = computed(() => {
  return nextId.value === id
})
syncRefs(isOpened, selected)
function open() {
  error.value = null
  nextId.value = id
}
function close() {
  nextId.value = null
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
  <Teleport v-if="nextEl" :to="nextEl">
    <Transition
      enter-from-class="translate-x-0!"
      enter-active-class="mobile:transition-300"
      leave-active-class="mobile:transition-300 v-leave-active"
      leave-to-class="translate-x-0!"
    >
      <Layout
        v-if="isOpened" :width="width"
        :label
        class="mobile:translate-x--100%"
        :close
        :close-icon="isMini ? 'back' : 'close'"
      >
        <OpenError v-if="error" :error @close="close" />
        <Suspense v-else @resolve="loading = false" @pending="loading = true">
          <slot />
          <template #fallback>
            <OpenLoading />
          </template>
        </Suspense>
      </Layout>
    </Transition>
  </Teleport>
</template>

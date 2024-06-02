<script setup lang="ts">
import { useLayout } from '../../composables/useLayout'
import Layout from '../layout/Layout.vue'
import Spinner from '../elements/Spinner.vue'
import OpenError from './OpenError.vue'
import { computed, getCurrentInstance, onErrorCaptured, ref, useToNumber, watch } from '#imports'

defineOptions({
  inheritAttrs: false,
})
const props = defineProps<{
  label?: string
  width?: number
}>()
const emit = defineEmits(['close'])
const width = useToNumber(() => props.width ?? 320)
const id = String(getCurrentInstance()?.uid)
const loading = ref(true)
const error = ref<Error | null>(null)
const { nextId, nextEl, isMini } = useLayout()
const opened = computed(() => nextId.value === id)
const transition = ref(false)
function open() {
  transition.value = !nextId.value
  error.value = null
  nextId.value = id
}
function close() {
  nextId.value = null
  emit('close')
}
watch(opened, (value) => {
  if (!value)
    emit('close')
})
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
      enter-from-class="translate-x-10 mobile:translate-x-0!"
      :enter-active-class="transition ? 'transition-200 mobile:transition-300' : ''"
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

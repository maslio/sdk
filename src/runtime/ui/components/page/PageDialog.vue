<script setup lang="ts">
import { useLayout } from '../../composables/useLayout'
import Layout from '../layout/Layout.vue'
import Spinner from '../elements/Spinner.vue'
import PageError from './PageError.vue'
import { onClickOutside, onErrorCaptured, ref, useResizeObserver, useSwipe } from '#imports'

defineOptions({
  inheritAttrs: false,
})
const props = withDefaults(defineProps<{
  target: 'center' | 'top' | 'bottom'
  label?: string
  header?: boolean
}>(), {
})
const { pageEl } = useLayout()
const opened = ref(false)
const loading = ref(true)
const error = ref<Error | null>(null)
function close() {
  opened.value = false
}
const [classEnter, classItems] = (function () {
  if (props.target === 'top')
    return ['children:translate-y--100%', 'items-start']
  if (props.target === 'center')
    return ['children:scale-80 opacity-0', 'items-center']
  else
    return ['children:translate-y-100%', 'items-end']
})()
function open() {
  error.value = null
  opened.value = true
}

const backdrop = ref<HTMLElement>()
const swipe = useSwipe(backdrop, {
  onSwipe() {
    if (swipe.direction.value === 'up' && classItems === 'items-start')
      close()
    else if (swipe.direction.value === 'down' && classItems === 'items-end')
      close()
  },
})

const dialog = ref()
onErrorCaptured((e: Error) => {
  error.value = e
  loading.value = false
  console.error(e)
  return false
})
const layout = ref()
const height = ref(0)
useResizeObserver(layout, (entries) => {
  height.value = entries[0].contentRect.height
})
onClickOutside(layout, (e) => {
  e.stopPropagation()
  close()
})

defineExpose({ open, close, opened })
</script>

<template>
  <Teleport v-if="pageEl" :to="pageEl">
    <Transition
      :enter-from-class="classEnter"
      enter-active-class="transition-200 children:transition-200"
      leave-active-class="transition-200 children:transition-200"
      :leave-to-class="classEnter"
    >
      <div
        v-if="opened"
        ref="backdrop"
        class="dialog fit flex justify-center text-light backdrop-blur-2"
        :class="classItems"
      >
        <div class="fit" @click="close" />
        <div
          ref="dialog"
          overflow-hidden rounded-xl
          class="m-3 max-h-90% max-w-100% w-full ring-2"
          dark="ring-dark-300"
          light="ring-neutral-200"
        >
          <div :style="{ height: height ? `${height}px` : 'auto' }" class="transition-height-150">
            <Layout
              ref="layout" :label
              :no-header="!header"
              :close
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
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

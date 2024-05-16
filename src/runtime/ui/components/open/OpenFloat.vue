<script setup lang="ts">
import { type Placement, flip, offset, shift, useFloating } from '@floating-ui/vue'

export type { Placement }
defineOptions({
  inheritAttrs: false,
})
const props = withDefaults(defineProps<{
  label?: string
  width?: number
  header?: boolean
  placement: Placement
  parent: HTMLElement
}>(), {
})
const { pageEl } = useLayout()
const width = ref(0)
const parent = toRef(() => props.parent)
const placement = toRef(() => props.placement)
const selected = defineModel<boolean>()
const loading = ref(true)
const error = ref<Error | null>(null)
const target = ref()
onClickOutside(target, (e) => {
  e.stopPropagation()
  close()
})
const { floatingStyles, update } = useFloating(parent, target, {
  placement,
  middleware: [offset(2), flip(), shift({ padding: 2 })],
})
function close() {
  selected.value = false
}
function open() {
  width.value = props.width ?? pageEl.value.clientWidth
  error.value = null
  selected.value = true
}
defineExpose({ open, close })
onErrorCaptured((e: Error) => {
  error.value = e
  loading.value = false
  console.error(e)
  setTimeout(update)
  return false
})
const layout = ref()
const height = ref(0)
useResizeObserver(layout, (entries) => {
  height.value = entries[0].contentRect.height
})
</script>

<template>
  <Teleport v-if="pageEl" :to="pageEl">
    <div
      v-if="selected"
      ref="target"
      :style="floatingStyles"
      class="dialog z-10 w-250px overflow-hidden rounded-xl ring-2"
      dark="ring-dark-300"
      light="ring-neutral-200"
    >
      <div :style="{ height: height ? `${height}px` : 'auto' }" class="transition-height-100">
        <Layout ref="layout" :label embeded :no-header="!header" :close>
          <OpenError v-if="error" :error @close="close" />
          <Suspense v-else @resolve="loading = false; update()" @pending="loading = true">
            <slot />
            <template #fallback>
              <div class="h-100px flex items-center justify-center">
                <IconCSS name="spinner" animate-spin />
              </div>
            </template>
          </Suspense>
        </Layout>
      </div>
    </div>
  </Teleport>
</template>

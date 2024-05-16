<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})
const props = withDefaults(defineProps<{
  label?: string
  width?: number
  header?: boolean
  blur?: boolean
  placement?: Placement
}>(), {
  placement: 'center',
})
export type Placement = 'center' | 'page-center' | 'page-bottom' | 'page-top'

const { pageEl } = useLayout()
const selected = defineModel<boolean>()
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
const modal = ref()
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
const css = computed(() => {
  let transition = 'children:translate-y--40px opacity-0'
  let items = 'items-center'
  if (props.placement === 'page-top') {
    transition = 'children:translate-y--100%'
    items = 'items-start'
  }
  else if (props.placement === 'page-bottom') {
    transition = 'children:translate-y-100%'
    items = 'items-end'
  }
  return { transition, items }
})
</script>

<template>
  <Teleport v-if="pageEl" :to="placement === 'center' ? 'body' : pageEl">
    <Transition
      :enter-from-class="css.transition"
      enter-active-class="transition-200 children:transition-200"
      leave-active-class="transition-200 children:transition-200"
      :leave-to-class="css.transition"
    >
      <div
        v-if="selected"
        fit flex justify-center
        class="dialog text-light backdrop-blur-2"
        :class="{ 'backdrop-blur-2': blur, [css.items]: true }"
      >
        <div class="fit" @click="close" />
        <div
          ref="modal"
          overflow-hidden rounded-xl
          class="m-3 max-h-90% max-w-100% ring-2"
          :class="{ 'w-full!': placement !== 'center' && !width }"
          :style="{ width: `${width ?? 250}px` }"
          dark="ring-dark-300"
          light="ring-neutral-200"
        >
          <div :style="{ height: height ? `${height}px` : 'auto' }" class="transition-height-300">
            <Layout ref="layout" :label :no-header="!header" :close>
              <OpenError v-if="error" :error @close="close" />
              <Suspense v-else @resolve="loading = false" @pending="loading = true">
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
      </div>
    </Transition>
  </Teleport>
</template>

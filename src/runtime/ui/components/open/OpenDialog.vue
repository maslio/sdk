<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})
const props = withDefaults(defineProps<{
  label?: string
  header?: boolean
  parent: HTMLElement
}>(), {
})
const { pageEl } = useLayout()
const selected = defineModel<boolean>()
const loading = ref(true)
const error = ref<Error | null>(null)
function close() {
  selected.value = false
}
const classEnter = ref('')
const classItems = ref('')
function open() {
  const elemRect = props.parent.getBoundingClientRect()
  const pageRect = pageEl.value.getBoundingClientRect()
  const top = elemRect.top - pageRect.top
  const bottom = pageRect.bottom - elemRect.bottom
  if (top > 200 && bottom > 200) {
    classEnter.value = 'children:scale-80 opacity-0'
    classItems.value = 'items-center'
  }
  else if (top > bottom) {
    classEnter.value = 'children:translate-y-100%'
    classItems.value = 'items-end'
  }
  else {
    classEnter.value = 'children:translate-y--100%'
    classItems.value = 'items-start'
  }
  error.value = null
  selected.value = true
}

const backdrop = ref<HTMLElement>()
const swipe = useSwipe(backdrop, {
  onSwipe() {
    if (swipe.direction.value === 'up' && classItems.value === 'items-start')
      close()
    else if (swipe.direction.value === 'down' && classItems.value === 'items-end')
      close()
  },
})

defineExpose({ open, close })
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
        v-if="selected"
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

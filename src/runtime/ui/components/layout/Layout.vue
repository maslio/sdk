<script setup lang="ts">
const props = withDefaults(defineProps<{
  root?: boolean
  width?: string | number
  label?: string
  noHeader?: boolean
  close?: () => void
  closeIcon?: string
}>(), {
  width: 320,
})

defineSlots<{
  default: () => void
  placeholder: () => void
}>()

const widthNumber = useToNumber(props.width)
const layoutWidth = ref(1024)
const freeWidth = ref(layoutWidth.value - widthNumber.value)
const layoutEl = ref() as Ref<HTMLElement>
const isMini = computed(() => {
  return layoutWidth.value < 640
})

useResizeObserver(layoutEl, (entries) => {
  const entry = entries[0]
  layoutWidth.value = entry.contentRect.width
  freeWidth.value = entry.contentRect.width - widthNumber.value
})

const styleRoot = computed(() => {
  if (isMini.value)
    return { width: '100%' }
  return { width: `${props.width}px` }
})

const pageEl = ref() as Ref<HTMLElement>
const menuEl = ref() as Ref<HTMLElement>
const nextEl = ref() as Ref<HTMLElement>
const nextId = ref()
const bottomEl = ref() as Ref<HTMLElement>
const footerEl = ref() as Ref<HTMLElement>
const id = useId()

function close() {
  props.close?.()
}

const swipe = useSwipe(pageEl, {
  onSwipe() {
    if (swipe.direction.value === 'right' && isMini.value)
      close()
  },
})

provide<LayoutProvide>('layout', { isMini, pageEl, menuEl, nextEl, nextId, footerEl, bottomEl, close, id })
</script>

<template>
  <div
    :id
    ref="layoutEl"
    class="layout absolute h-full w-full flex justify-center overflow-hidden text-base"
    color="back dialog:default"
    min-w-200px dialog:relative
    dialog:h-auto dialog:w-auto
    :class="{ mobile: isMini }"
  >
    <div
      ref="pageEl"
      class="page relative h-full flex flex-col mobile:w-full!"
      :style="styleRoot"
    >
      <header
        v-if="!noHeader && !root"
        class="group header h-14 flex items-center gap-2 p-3 dialog:h-12 dialog:p-2"
      >
        <Button
          v-if="closeIcon"
          flat mini
          :icon="closeIcon"
          @click="close"
        />
        <div v-else w-1 />
        <div
          flex-1 truncate
          pr-3
          text-base
        >
          {{ label }}
        </div>
        <div
          ref="menuEl"
          class="h-10 flex flex-nowrap items-center"
        />
      </header>
      <main
        class="relative flex flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto p-3 pt-0 dialog:gap-0 dialog:px-0 dialog:pb-2 dialog:first:pt-2"
        :class="{ 'mt-3': root }"
        dialog:scrollbar-gutter-auto
        scrollbar="~ rounded w-4px gutter-stable"
        dark:scrollbar="track-color-dark-900 thumb-color-neutral-700/50"
        light:scrollbar="track-color-light-900 thumb-color-neutral-400/50"
      >
        <slot />
        <div ref="bottomEl" class="sticky bottom-0" />
      </main>
      <footer ref="footerEl" class="px-3" />
    </div>
    <div ref="nextEl" class="next">
      <div v-if="$slots.placeholder" class="fit hidden last:block">
        <slot name="placeholder" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.layout:has(+ .layout) {
  --uno: 'transition-transform-300';
}
.layout:has(+ .layout:not(.v-leave-active)) {
  transform: translateX(-150px);
}
.layout > .next {
  --uno: 'relative flex-1';
}
.layout > .page {
  --uno: 'transition-transform-300';
}
.dialog .layout > .page {
  --uno: 'transition-transform-200';
}
.mobile:has(> .next > .layout.v-leave-active) {
  > .page {
    position: relative;
  }
}
.mobile:has(> .next > .layout:not(.v-leave-active)) {
  > .page {
    position: absolute;
    transform: translateX(-50%);
    height: 100%;
    overflow: hidden;
  }
}
.mobile > .next {
  --uno: 'relative left-100% top-0 h-full w-full';
}
.mobile > .next:has(> .layout.v-leave-active) {
  --uno: 'absolute';
}
</style>

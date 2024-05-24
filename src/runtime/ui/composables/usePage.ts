import type { Component } from 'vue'
import { computed, defineAsyncComponent, nextTick, ref } from '#imports'

export type PageTarget = 'next' | 'full' | 'top' | 'center' | 'bottom'
export interface PageProps {
  label?: string
  width?: number
  target?: PageTarget
  header?: boolean
  parent?: HTMLElement
  component?: Component
  props?: Record<string, any>
}

export function usePage(props: PageProps | PageTarget = 'next', label?: string) {
  if (typeof props === 'string')
    props = { target: props, label }
  props.label ??= label

  const component = (function () {
    if (props.target === 'next')
      return defineAsyncComponent(() => import('../components/page/PageNext.vue'))
    if (props.target === 'full')
      return defineAsyncComponent(() => import('../components/page/PageNext.vue'))
    return defineAsyncComponent(() => import('../components/page/PageDialog.vue'))
  })()

  const target = ref()
  const rendered = ref(false)
  const opened = computed(() => {
    return target.value?.opened
  })

  async function open() {
    if (!rendered.value) {
      rendered.value = true
      await nextTick()
    }
    target.value?.open()
  }
  function close() {
    target.value?.close()
  }

  return {
    component,
    opened,
    close,
    open,
    props,
    target,
  }
}

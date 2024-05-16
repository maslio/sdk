import type { ComputedRef, Ref } from 'vue'

export interface LayoutProvide {
  id: string
  isMini: ComputedRef<boolean>
  pageEl: Ref<HTMLElement>
  menuEl: Ref<HTMLElement>
  nextEl: Ref<HTMLElement>
  nextId: Ref<any>
  bottomEl: Ref<HTMLElement>
  footerEl: Ref<HTMLElement>
  close: () => void
}

export function useLayout() {
  return inject('layout') as LayoutProvide
}

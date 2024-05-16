import type { ComputedRef, Ref } from 'vue'
import { inject } from '#imports'

export interface LayoutProvide {
  id: string
  isMini: ComputedRef<boolean>
  pageEl: Ref<HTMLElement>
  menuEl: Ref<HTMLElement>
  nextEl: Ref<HTMLElement>
  nextId: Ref<string | null>
  bottomEl: Ref<HTMLElement>
  footerEl: Ref<HTMLElement>
  close: () => void
}

export function useLayout() {
  return inject('layout') as LayoutProvide
}

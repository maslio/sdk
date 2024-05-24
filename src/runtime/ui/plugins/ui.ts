import { defineNuxtPlugin, useAppConfig } from '#imports'

export default defineNuxtPlugin(() => {
  const ui = useAppConfig().ui as any
  return {
    provide: {
      click: ui.mousedown ? 'mousedown' : 'click',
    },
  }
})

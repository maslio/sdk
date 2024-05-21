import { createFluentVue } from 'fluent-vue'
import { computed, defineNuxtPlugin, useCookie, useRuntimeConfig } from '#imports'
// @ts-expect-error created by module
import * as bundles from '~/.nuxt/locales/index'

export default defineNuxtPlugin((nuxt) => {
  const config = useRuntimeConfig()
  // @ts-expect-error created by module
  const locales = config.public.locales.split(',') as string[]
  const defaultLocale = config.public.defaultLocale as string

  const selectedLocale = useCookie('locale', {
    default: () => defaultLocale,
  })

  const fluent = createFluentVue({
    bundles: [bundles[selectedLocale.value]],
  })

  nuxt.vueApp.use(fluent)

  return {
    provide: {
      locale: computed(() => selectedLocale.value),
      locales,
      changeLocale(locale: string) {
        if (!locales.includes(locale))
          throw new Error(`Invalid locale ${locale}`)
        selectedLocale.value = locale
        fluent.bundles = [bundles[selectedLocale.value]]
      },
    },
  }
})

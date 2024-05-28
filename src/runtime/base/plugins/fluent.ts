import { FluentBundle, FluentResource } from '@fluent/bundle'
import { createFluentVue } from 'fluent-vue'
import { callOnce, computed, defineNuxtPlugin, shallowRef, useCookie, useRuntimeConfig, useState } from '#imports'

export default defineNuxtPlugin(async (nuxt) => {
  const data = useState<string>(() => shallowRef())
  const config = useRuntimeConfig()

  // @ts-expect-error created by module
  const locales = config.public.locales.split(',') as string[]
  const defaultLocale = config.public.defaultLocale as string
  const selectedLocale = useCookie('locale', {
    default: () => defaultLocale,
  })

  async function fetchLocale() {
    data.value = await $fetch(`/_locale/${selectedLocale.value}`)
  }

  function createBundle() {
    const bundle = new FluentBundle(selectedLocale.value)
    bundle.addResource(new FluentResource(data.value))
    return bundle
  }

  await callOnce(async () => {
    await fetchLocale()
  })

  const fluent = createFluentVue({
    bundles: [createBundle()],
  })

  async function changeLocale(_locale: string) {
    if (!locales.includes(_locale))
      throw new Error(`Invalid locale ${_locale}`)
    selectedLocale.value = _locale
    await fetchLocale()
    fluent.bundles = [createBundle()]
    // reloadNuxtApp()
    if (import.meta.client)
      window.location.reload()
  }

  nuxt.vueApp.use(fluent)

  return {
    provide: {
      locale: computed(() => selectedLocale.value),
      locales,
      changeLocale,
    },
  }
})

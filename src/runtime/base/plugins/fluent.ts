import { FluentBundle, FluentResource } from '@fluent/bundle'
import { createFluentVue } from 'fluent-vue'
import { callOnce, computed, defineNuxtPlugin, shallowRef, useCookie, useRuntimeConfig, useState } from '#imports'

export default defineNuxtPlugin(async (nuxt) => {
  const data = useState<string>(() => shallowRef())
  const config = useRuntimeConfig()

  // @ts-expect-error created by module
  const locales = config.public.locales.split(',') as string[]
  const defaultLocale = config.public.defaultLocale as string
  const cookieLocale = useCookie('locale', {
    default: () => defaultLocale,
  })
  const locale = cookieLocale.value

  async function fetchLocale() {
    data.value = await $fetch(`/_locale/${locale}`)
  }

  function createBundle() {
    const bundle = new FluentBundle(locale)
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
    cookieLocale.value = _locale
    window.location.reload()
  }

  nuxt.vueApp.use(fluent)

  return {
    provide: {
      locale,
      locales,
      changeLocale,
    },
  }
})

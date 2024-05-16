import { authentication, createDirectus, rest } from '@directus/sdk'
import { defineNuxtPlugin } from '#imports'

export default defineNuxtPlugin((nuxtApp) => {
  const url = `${location.protocol}//${location.host}/_db`

  // @ts-expect-error Directus
  const client = createDirectus<DirectusSchema>(url)
    .with(rest({ credentials: 'include' }))
    .with(authentication('session', { credentials: 'include' }))

  nuxtApp.provide('directus', client)
})

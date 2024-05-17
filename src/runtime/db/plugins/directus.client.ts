import { authentication, createDirectus, rest } from '@directus/sdk'
import { defineNuxtPlugin } from '#imports'
// @ts-expect-error directus
import type { DirectusSchema } from '#build/directus.d.ts'

export default defineNuxtPlugin((nuxtApp) => {
  const url = `${location.protocol}//${location.host}/_db`

  const client = createDirectus<DirectusSchema>(url)
    .with(rest({ credentials: 'include' }))
    .with(authentication('session', { credentials: 'include' }))

  nuxtApp.provide('directus', client)
})

import { createDirectus, rest, staticToken } from '@directus/sdk'
import { type H3Event, getCookie } from 'h3'
import { fetchMe } from '../utils/user'
import { defineNuxtPlugin, useRuntimeConfig, useState } from '#imports'

export default defineNuxtPlugin(async (nuxtApp) => {
  const url = useRuntimeConfig().directusUrl
  const event = nuxtApp.ssrContext?.event as H3Event
  const token = getCookie(event, 'directus_session_token')

  // @ts-expect-error Directus
  let client = createDirectus<DirectusSchema>(url)
    .with(rest())
  if (token) {
    client = client.with(staticToken(token))
    const user = await fetchMe(client)
    useState('user', () => user)
  }

  nuxtApp.provide('directus', client)
})

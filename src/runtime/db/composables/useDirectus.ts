import type { AuthenticationClient, DirectusClient, RestClient } from '@directus/sdk'
import { type User, fetchMe } from '../utils/user'
import { type Ref, useNuxtApp, useState } from '#imports'
// @ts-expect-error directus
import type { DirectusSchema } from '#build/directus.d.ts'

type Client = DirectusClient<DirectusSchema> & RestClient<DirectusSchema> & AuthenticationClient<DirectusSchema>
type ClientAny = DirectusClient<any> & RestClient<any> & AuthenticationClient<any>

export function useDirectus() {
  const nuxtApp = useNuxtApp()
  const client = nuxtApp.$directus as Client

  const request: Client['request'] = options => client.request(options)

  const requestAny: ClientAny['request'] = options => client.request(options)

  const user: Ref<User | null> = useState<User>('user')

  const login: Client['login'] = async (email, password, options) => {
    const authData = await client.login(email, password, options)
    user.value = await fetchMe(client)
    return authData
  }
  const logout: Client['logout'] = async () => {
    await client.logout()
    user.value = null
  }

  async function refreshUser() {
    user.value = await fetchMe(client)
  }

  return {
    client,
    request,
    login,
    logout,
    user,
    refreshUser,
    requestAny,
  }
}

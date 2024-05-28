import { Buffer } from 'node:buffer'
import { type AssetsQuery, type DirectusClient, type RestClient, createDirectus, readAssetArrayBuffer, rest, staticToken } from '@directus/sdk'
import { type H3Event, getCookie } from 'h3'
import { jwtDecode } from 'jwt-decode'
import { createError, useRuntimeConfig } from '#imports'
// @ts-expect-error directus
import type { DirectusSchema } from '~/.nuxt/directus.d.ts'

type Client = DirectusClient<DirectusSchema> & RestClient<DirectusSchema>
type ClientAny = DirectusClient<any> & RestClient<any>

let clientAdmin: Client

function adminClient() {
  if (!clientAdmin) {
    const { directusUrl, directusToken } = useRuntimeConfig()
    clientAdmin = createDirectus<DirectusSchema>(directusUrl as string)
      .with(rest())
      .with(staticToken(directusToken as string))
  }
  return clientAdmin
}

function userClient(event: H3Event) {
  const { directusUrl } = useRuntimeConfig()
  const token = getCookie(event, 'directus_session_token')
  if (!token)
    throw createError({ status: 401 })
  return createDirectus<DirectusSchema>(directusUrl as string)
    .with(rest())
    .with(staticToken(token))
}

export function useDirectus(event: H3Event | 'admin') {
  const client = event === 'admin' ? adminClient() : userClient(event)
  const requestAny: ClientAny['request'] = options => client.request(options)
  const request: Client['request'] = options => client.request(options)
  async function getImage(id: string, query?: AssetsQuery) {
    const arrayBuffer = await request(readAssetArrayBuffer(id, query))
    const buffer = Buffer.from(arrayBuffer)
    return buffer.toString('base64')
  }
  return {
    client,
    request,
    getImage,
    requestAny,
  }
}

interface SessionData {
  id: string
  role: string
  app_access: 1
  admin_access: 1
  session: string
  iat: number
  exp: number
  iss: string
}

export function decodeDirectusToken(token: string) {
  return jwtDecode<SessionData>(token)
}

type Role = 'admin'

export function useAccess(role?: Role, event?: H3Event): void {
  // @ts-expect-error useEvent
  event ??= useEvent() as H3Event
  const token = getCookie(event, 'directus_session_token')
  const data = token ? decodeDirectusToken(token) : null
  if (!data || !data.app_access)
    throw createError({ status: 401 })
  if (role === 'admin') {
    if (!data.admin_access)
      throw createError({ status: 403 })
  }
}

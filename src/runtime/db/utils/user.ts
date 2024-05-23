import { type DirectusClient, type RestClient, readMe } from '@directus/sdk'
// @ts-expect-error directus
import type { DirectusSchema } from '~/.nuxt/directus.d.ts'

export interface User {
  id: string
  email: string
  first_name: string
  last_name: string
  role: {
    id: string
    name: string
    app_access: boolean
    admin_access: boolean
  }
}
export async function fetchMe(client: DirectusClient<DirectusSchema> & RestClient<DirectusSchema>) {
  return await client.request(readMe<any, any>({
    fields: ['id', 'first_name', 'last_name', 'email', 'avatar', {
      role: ['id', 'name', 'app_access', 'admin_access'],
    }],
  })) as User
}

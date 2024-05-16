import { type DirectusClient, type RestClient, readMe } from '@directus/sdk'

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
// @ts-expect-error Directus
export async function fetchMe(client: DirectusClient<DirectusSchema> & RestClient<DirectusSchema>) {
  return await client.request(readMe<any, any>({
    fields: ['id', 'first_name', 'last_name', 'email', {
      role: ['id', 'name', 'app_access', 'admin_access'],
    }],
  })) as User
}

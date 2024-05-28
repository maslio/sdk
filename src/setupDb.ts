/* eslint-disable node/prefer-global/process */
import { $fetch } from 'ofetch'
import { joinURL } from 'ufo'
import type { Nuxt } from '@nuxt/schema'
import { addComponentsDir, addImportsDir, addPlugin, addServerHandler, addServerImportsDir, addTypeTemplate, createResolver, logger } from '@nuxt/kit'
import genDirectusTypes from './config/genDirectusTypes'

const { resolve } = createResolver(import.meta.url)

export interface OptionsDb {
  prefix?: string
}

export default async function setupDb(options: OptionsDb, nuxt: Nuxt) {
  const directusUrl = process.env.DIRECTUS_URL || 'http://localhost:8055'
  const directusToken = process.env.DIRECTUS_TOKEN || ''

  if (!await checkDirectus(directusUrl, directusToken))
    return
  nuxt.options.runtimeConfig.directusUrl = directusUrl
  nuxt.options.runtimeConfig.directusToken = directusToken

  addServerHandler({
    route: '/_db/**',
    handler: resolve('./runtime/db/server/routes/proxy'),
  })

  addTypeTemplate({
    filename: 'directus.d.ts',
    getContents: async () => genDirectusTypes(directusUrl, directusToken),
  })
  addPlugin({
    src: resolve('./runtime/db/plugins/directus.client'),
    mode: 'client',
  })
  addPlugin({
    src: resolve('./runtime/db/plugins/directus.server'),
    mode: 'server',
  })

  addComponentsDir({
    path: resolve('./runtime/db/components'),
    prefix: options.prefix ?? 'db',
    pathPrefix: false,
    ignore: ['imports/*'],
  })
  addImportsDir(resolve('./runtime/db/composables'))
  addServerImportsDir(resolve('./runtime/db/server/utils'))
  addImportsDir(resolve('./runtime/db/imports'))
  addServerImportsDir(resolve('./runtime/db/imports'))
}

async function checkDirectus(url: string, token: string): Promise<boolean> {
  if (!token) {
    logger.error(`DIRECTUS_TOKEN is not provided`)
    return false
  }
  try {
    const ping = await $fetch(joinURL(url, 'server/ping'))
    if (ping !== 'pong')
      throw new Error(`Cannot connect to directus at ${url}`)
  }
  catch (e) {
    logger.error(`Cannot connect to directus at ${url}`)
    return false
  }
  return true
}

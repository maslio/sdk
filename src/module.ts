/* eslint-disable node/prefer-global/process */
import { $fetch } from 'ofetch'
import {
  addComponentsDir,
  addImportsDir,
  addPlugin,
  addServerHandler,
  addServerImportsDir,
  addTemplate,
  addTypeTemplate,
  createResolver,
  defineNuxtModule,
  installModule,
  logger,
} from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import { joinURL } from 'ufo'
import type { Day } from 'date-fns'
import genUnoConfig from './config/genUnoConfig'
import genEslintConfig from './config/genEslintConfig'
import genDirectusTypes from './config/genDirectusTypes'
import { genLocaleBundle, genLocaleIndex } from './config/genLocale'

export interface ModuleOptions {
  locales?: string[]
  ui?: OptionsUi
  db?: OptionsDb
  ai?: boolean
}
interface OptionsUi {
  prefix?: string
  weekStartsOn?: Day
}
interface OptionsDb {
  prefix?: string
}

const { resolve, resolvePath } = createResolver(import.meta.url)

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@maslio/kit',
    configKey: 'maslio',
  },
  defaults: {},
  async setup(options, nuxt) {
    await setupBase(options, nuxt)
    await setupFluent(options, nuxt)
    if (options.ui)
      await setupUi(options.ui, nuxt)
    if (options.db)
      await setupDb(options.db, nuxt)
  },
})

async function setupBase(_options: ModuleOptions, _nuxt: Nuxt) {
  await installModule('@vueuse/nuxt')
  await installModule('@nuxtjs/color-mode', {
    classSuffix: '',
  })
  await installModule('@nuxtjs/device')
  await installModule('nuxt-icon')
  addPlugin({
    src: resolve('./runtime/base/plugins/device'),
    order: 1,
  })
  addTemplate({
    getContents: () => genEslintConfig(),
    filename: 'eslint.config.js',
    write: true,
  })
  addImportsDir(resolve('./runtime/base/composables'))
  addImportsDir(resolve('./runtime/base/utils'))
  addServerImportsDir(resolve('./runtime/base/utils'))
}

async function setupFluent(options: ModuleOptions, nuxt: Nuxt) {
  await installModule('unplugin-fluent-vue/nuxt', {
    sfc: {
      blockType: 'fluent',
    },
  })
  const locales = options.locales ?? ['en']
  const dirs: string[] = []
  if (options.ui)
    dirs.push(resolve('./runtime/ui/locales'))
  if (options.db)
    dirs.push(resolve('./runtime/db/locales'))
  if (options.ai)
    dirs.push(resolve('./runtime/ai/locales'))
  dirs.push(await resolvePath('~/locales'))
  for (const locale of locales) {
    addTemplate({
      getContents: () => genLocaleBundle(dirs, locale),
      filename: `locales/${locale}.ts`,
      write: true,
    })
  }
  nuxt.options.runtimeConfig.public.locales = locales.join(',')
  nuxt.options.runtimeConfig.public.defaultLocale = locales[0]
  addTemplate({
    getContents: () => genLocaleIndex(locales),
    filename: `locales/index.ts`,
    write: true,
  })
  addPlugin({ src: resolve('./runtime/base/plugins/fluent') })
}

async function setupUi(options: OptionsUi, nuxt: Nuxt) {
  nuxt.options.appConfig.ui = {
    weekStartsOn: options.weekStartsOn ?? 1,
  }
  nuxt.options.appConfig.nuxtIcon = {
    size: '24px',
    aliases: {
      spinner: 'mingcute:loading-fill',
      close: 'material-symbols:close',
      back: 'octicon:arrow-left-16',
      search: 'material-symbols:search',
      more: 'mingcute:more-2-fill',
      sort: 'material-symbols:sort',
      edit: 'material-symbols:edit',
      send: 'material-symbols:send',
    },
  }
  const unoConfigFile = addTemplate({
    getContents: () => genUnoConfig(),
    filename: 'uno.config.ts',
    write: true,
  })
  await installModule('@unocss/nuxt', {
    configFile: resolve(unoConfigFile.dst),
  })
  nuxt.options.css.push('@unocss/reset/tailwind.css')
  nuxt.options.css.push(resolve('./runtime/ui/assets/global.css'))
  addComponentsDir({
    path: resolve('./runtime/ui/components'),
    prefix: options.prefix ?? '',
    pathPrefix: false,
  })
  addImportsDir(resolve('./runtime/ui/composables'))
  addImportsDir(resolve('./runtime/ui/utils'))
  addPlugin(resolve('./runtime/ui/plugins/maska'))
}

async function setupDb(options: OptionsDb, nuxt: Nuxt) {
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

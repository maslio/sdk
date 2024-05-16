import {
  addComponentsDir,
  addImportsDir,
  addPlugin,
  addTemplate,
  createResolver,
  installModule,
} from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import unoConfig from './templates/uno.config'

export interface Options {}

export const defaults = {}

export async function setup(_options: Options, nuxt: Nuxt) {
  const { resolve } = createResolver(import.meta.url)

  await installModule('nuxt-icon')
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
    getContents: () => unoConfig,
    filename: 'uno.config.ts',
    write: true,
  })

  await installModule('@unocss/nuxt', {
    configFile: unoConfigFile.dst,
  })
  nuxt.options.css.push('@unocss/reset/tailwind.css')
  nuxt.options.css.push(resolve('./assets/global.css'))
  addComponentsDir({
    path: resolve('./components'),
    pathPrefix: false,
  })
  addImportsDir(resolve('./composables'))
  addImportsDir(resolve('./utils'))
  addPlugin(resolve('./plugins/maska'))
}

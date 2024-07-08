import { addComponentsDir, addImportsDir, addPlugin, addTemplate, createResolver, installModule } from '@nuxt/kit'
import type { Day } from 'date-fns'
import type { Nuxt } from '@nuxt/schema'
import genUnoConfig from './config/genUnoConfig'

const { resolve } = createResolver(import.meta.url)

export interface OptionsUi {
  prefix?: string
  weekStartsOn?: Day
  mousedown?: boolean
}

const icons = {
  spinner: 'mingcute:loading-fill',
  close: 'material-symbols:close',
  back: 'ic:baseline-arrow-back',
  search: 'material-symbols:search',
  more: 'mingcute:more-2-fill',
  sort: 'material-symbols:sort',
  edit: 'material-symbols:edit',
  send: 'material-symbols:send',
  next: 'fluent:chevron-right-16-filled',
}

export default async function setupUi(options: OptionsUi, nuxt: Nuxt) {
  await installModule('@nuxt/icon', {
    size: '24px',
    aliases: icons,
  })
  nuxt.options.appConfig.ui = {
    weekStartsOn: options.weekStartsOn ?? 1,
    mousedown: options.mousedown ?? false,
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
  addPlugin(resolve('./runtime/ui/plugins/ui'))
}

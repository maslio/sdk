import {
  addComponentsDir,
  addImportsDir,
  addPlugin,
  createResolver,
  defineNuxtModule,
  installModule,
} from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'

export interface ModuleOptions {
  ui?: Record<string, any>
}

const { resolve } = createResolver(import.meta.url)

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@maslio/kit',
    configKey: 'maslio',
  },
  defaults: {
  },

  async setup(options, nuxt) {
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

    if (options.ui)
      await setupUi(options.ui, nuxt)
  },
})

async function setupUi(_options: ModuleOptions['ui'], nuxt: Nuxt) {
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
  // const unoConfigFile = addTemplate({
  //   getContents: () => unoConfig,
  //   filename: 'uno.config.ts',
  //   write: true,
  // })
  await installModule('@unocss/nuxt', {
    configFile: resolve('./runtime/uno.config'),
  })
  nuxt.options.css.push('@unocss/reset/tailwind.css')
  nuxt.options.css.push(resolve('./runtime/ui/assets/global.css'))
  addComponentsDir({
    path: resolve('./runtime/ui/components'),
    pathPrefix: false,
  })
  addImportsDir(resolve('./runtime/ui/composables'))
  addImportsDir(resolve('./runtime/ui/utils'))
  addPlugin(resolve('./runtime/ui/plugins/maska'))
}

import type { Nuxt } from '@nuxt/schema'
import { addImportsDir, addPlugin, addServerImportsDir, addTemplate, createResolver, installModule } from '@nuxt/kit'
import type { ModuleOptions } from '../module'
import genEslintConfig from '../config/genEslintConfig'
// import type { Import } from 'unimport'

const { resolve } = createResolver(import.meta.url)

export default async function setupBase(_options: ModuleOptions, nuxt: Nuxt) {
  nuxt.options.nitro.imports ||= {}
  nuxt.options.nitro.imports.imports ||= []
  nuxt.options.nitro.imports.imports.push(
    { name: 'z', from: 'zod' },
  )

  nuxt.options.runtimeConfig.nitro ||= {}
  nuxt.options.runtimeConfig.nitro.envPrefix = ''
  await installModule('@vueuse/nuxt')
  await installModule('@nuxtjs/color-mode', {
    classSuffix: '',
  })
  await installModule('@nuxtjs/device')
  await installModule('nuxt-icon')
  await installModule('@nuxt/image', {
    directus: { baseURL: '/_db/assets' },
  })
  addPlugin({
    src: resolve('../runtime/base/plugins/device'),
    order: 1,
  })
  addTemplate({
    getContents: () => genEslintConfig(),
    filename: 'eslint.config.js',
    write: true,
  })
  addImportsDir(resolve('../runtime/base/composables'))
  addImportsDir(resolve('../runtime/base/utils'))
  addServerImportsDir(resolve('../runtime/base/utils'))
}

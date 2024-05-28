import type { Nuxt } from '@nuxt/schema'
import { addPlugin, addTemplate, createResolver, installModule } from '@nuxt/kit'
import type { ModuleOptions } from '../module'
import { genLocaleBundle, genLocaleIndex } from '../config/genLocale'

const { resolve, resolvePath } = createResolver(import.meta.url)

export default async function setupFluent(options: ModuleOptions, nuxt: Nuxt) {
  await installModule('unplugin-fluent-vue/nuxt', {
    sfc: {
      blockType: 'fluent',
    },
  })
  const locales = options.locales ?? ['en']
  const dirs: string[] = []
  if (options.ui)
    dirs.push(resolve('../runtime/ui/locales'))
  if (options.db)
    dirs.push(resolve('../runtime/db/locales'))
  if (options.ai)
    dirs.push(resolve('../runtime/ai/locales'))
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
  addPlugin({ src: resolve('../runtime/base/plugins/fluent') })
}

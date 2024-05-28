import type { Nuxt } from '@nuxt/schema'
import { addPlugin, addServerHandler, addTemplate, createResolver, installModule } from '@nuxt/kit'
import type { ModuleOptions } from '../module'
import { genLocaleFile, genLocaleIndex } from '../config/genLocale'

const { resolve, resolvePath } = createResolver(import.meta.url)

export default async function setupFluent(options: ModuleOptions, nuxt: Nuxt) {
  await installModule('unplugin-fluent-vue/nuxt', {
    sfc: {
      blockType: 'fluent',
    },
  })

  addServerHandler({
    route: '/_locale/:lang',
    handler: resolve('../runtime/base/server/routes/locale'),
  })

  const locales = options.locales ?? ['en-US']
  for (const locale of locales) {
    addTemplate({
      getContents: async () => genLocaleFile(locale, [
        resolve('../runtime/locales'),
        await resolvePath('~/locales'),
      ]),
      filename: `locales/${locale}.json`,
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

  // nuxt.hook('vite:extend', ({ config }) => {
  //   config.plugins ||= []
  //   config.plugins.unshift(vitePlugin())
  // })
}

// const messages = new Set<string>()

// function vitePlugin() {
//   const include = '**/*.(js|ts|vue|jsx|tsx)'
//   const exclude = 'node_modules/**'
//   const filter = createFilter(include, exclude)
//   const regexp = /\$t[:/()]["']?(.+?)["']/g
//   return {
//     name: 'maslio-fluent-plugin',
//     async transform(code: string, id: string) {
//       if (!filter(id))
//         return null
//       if (regexp && regexp instanceof RegExp) {
//         const matches = code.match(regexp)
//         if (matches && matches.length > 0) {
//           for (const match of matches) {
//             const value = regexp.exec(match)
//             if (value && value[1])
//               messages.add(value[1])
//               // console.log(value[1])
//           }
//         }
//       }
//     },
//   }
// }

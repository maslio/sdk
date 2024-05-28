import { addServerImportsDir, createResolver } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'

export interface OptionsAi {

}
const { resolve } = createResolver(import.meta.url)

export default async function setupAi(_options: OptionsAi, nuxt: Nuxt) {
  nuxt.options.runtimeConfig.openaiApiKey = ''
  nuxt.options.runtimeConfig.googleAiApiKey = ''
  addServerImportsDir(resolve('../runtime/ai/utils'))
}

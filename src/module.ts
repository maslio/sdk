import { defineNuxtModule } from '@nuxt/kit'

import setupBase from './setup/setupBase'
import setupFluent from './setup/setupFluent'
import setupUi, { type OptionsUi } from './setup/setupUi'
import setupDb, { type OptionsDb } from './setup/setupDb'
import setupAi, { type OptionsAi } from './setup/setupAi'

export interface ModuleOptions {
  locales?: string[]
  ui?: OptionsUi
  db?: OptionsDb
  ai?: OptionsAi
}

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
    if (options.ai)
      await setupAi(options.ai, nuxt)
  },
})

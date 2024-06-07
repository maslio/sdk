import { addServerScanDir, createResolver } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'

export interface OptionsFs {
  dirs: string[]
}

const { resolve } = createResolver(import.meta.url)

export default async function setupFs(options: OptionsFs, nuxt: Nuxt) {
  const fs: Record<string, string> = {}
  for (const dir of options.dirs)
    fs[dir] = ''
  nuxt.options.runtimeConfig.fs = fs
  addServerScanDir(resolve('./runtime/fs/server'))
}

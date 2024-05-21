import { existsSync } from 'node:fs'
import { createResolver } from '@nuxt/kit'
import { join } from 'pathe'

// const { resolvePath } = createResolver(import.meta.url)

export async function genLocaleBundle(dirs: string[], locale: string): Promise<string> {
  const files: string[] = []
  for (const dir of dirs) {
    const file = join(dir, `${locale}.ftl`)
    console.log(file)
    if (existsSync(file))
      files.push(file)
  }

  const code: string[] = []
  code.push(`import { FluentBundle, FluentResource } from '@fluent/bundle'`)
  for (const i in files)
    code.push(`import messages_${i} from '${files[i]}?raw'`)
  code.push('')
  code.push(`const bundle = new FluentBundle('${locale}')`)
  code.push('')
  for (const i in files)
    code.push(`bundle.addResource(new FluentResource(messages_${i}))`)
  code.push('')
  code.push('export default bundle')
  code.push('')
  return code.join('\n')
}

export function genLocaleIndex(locales: string[]): string {
  const code: string[] = []
  for (const locale of locales)
    code.push(`export { default as ${locale} } from './${locale}' `)
  return code.join('\n')
}

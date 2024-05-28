import { existsSync, readFileSync } from 'node:fs'
import { snakeCase } from 'scule'
import { Resource, parse, serialize } from '@fluent/syntax'
import { join } from 'pathe'
import { murmurHash } from 'ohash'

// const { resolvePath } = createResolver(import.meta.url)

export async function genLocaleFile(locale: string, dirs: string[]): Promise<string> {
  const files: string[] = []
  for (const dir of dirs) {
    const file = join(dir, `${locale}.ftl`)
    if (existsSync(file))
      files.push(file)
  }
  const resource = new Resource()
  for (const file of files) {
    const data = parse(readFileSync(file, 'utf-8'), { withSpans: false })
    resource.body.push(...data.body)
  }
  const data = serialize(resource, {})
  const hash = murmurHash(data)
  const json = JSON.stringify({ data, hash }, null, 2)
  return json
}

// export async function genLocaleBundle(dirs: string[], locale: string): Promise<string> {
//   const files: string[] = []
//   for (const dir of dirs) {
//     const file = join(dir, `${locale}.ftl`)
//     if (existsSync(file))
//       files.push(file)
//   }

//   const code: string[] = []
//   code.push(`import { FluentBundle, FluentResource } from '@fluent/bundle'`)
//   for (const i in files)
//     code.push(`import messages_${i} from '${files[i]}?raw'`)
//   code.push('')
//   code.push(`const bundle = new FluentBundle('${locale}')`)
//   code.push('')
//   for (const i in files)
//     code.push(`bundle.addResource(new FluentResource(messages_${i}))`)
//   code.push('')
//   code.push('export default bundle')
//   code.push('')
//   return code.join('\n')
// }

export function genLocaleIndex(locales: string[]): string {
  const code: string[] = []
  for (const locale of locales)
    code.push(`import ${snakeCase(locale)} from './${locale}.json' `)
  code.push('')
  code.push('export default {')
  for (const locale of locales)
    code.push(`  '${locale}': ${snakeCase(locale)},`)
  code.push('}')
  code.push('')
  return code.join('\n')
}

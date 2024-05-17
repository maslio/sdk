import { createDirectus, readCollections, readFields, rest, staticToken } from '@directus/sdk'
import type { Collection, Field } from '@directus/types'
import { pascalCase } from 'scule'

export default async function (directusUrl: string, directusToken: string) {
  const client = createDirectus(directusUrl)
    .with(rest())
    .with(staticToken(directusToken))

  const _collections = await client.request(readCollections()) as Collection[]
  const fields = await client.request(readFields()) as Field[]

  const collections = _collections.filter(col => !col.collection.startsWith('directus_'))

  const schema: string[] = []

  schema.push(`import { User } from '@directus/types'`)

  schema.push(`interface ${itemName('directus_users')} extends User {`)
  schema.push(`}`)

  // interfaces for all collections
  for (const col of collections) {
    schema.push(`interface ${itemName(col.collection)} {`)
    for (const field of fields.filter(f => f.collection === col.collection))
      schema.push(`  ${tsType(field)}`)
    schema.push('}')
  }

  // Schema interface
  schema.push(`export interface DirectusSchema {`)
  for (const col of collections)
    schema.push(`  ${col.collection}: ${itemName(col.collection)}[]`)
  schema.push(`  directus_users: ${itemName('directus_users')}`)

  schema.push('}')
  schema.push('')

  return schema.join('\n')
}

function tsType(field: Field) {
  const key = field.field
  // if (key === 'response')
  //   console.log(field)

  let type: string
  switch (field.type) {
    case 'integer':
      type = 'number'; break
    case 'float':
      type = 'number'; break
    case 'boolean':
      type = 'boolean'; break
    case 'timestamp':
      type = '\'datetime\''; break
    case 'string':
      type = 'string'; break
    case 'text':
      type = 'string'; break
    default:
      type = 'any'; break
  }
  if (field.schema?.data_type === 'json')
    type = '\'json\''

  if (field.meta?.options?.choices) {
    interface Choise { value: string }
    const choices = field.meta.options.choices as Choise[]
    type = choices.map(c => `'${c.value}'`).join(' | ')
  }
  else if (field.schema?.foreign_key_table) {
    type = `${type} | ${itemName(field.schema.foreign_key_table)}`
  }
  const q = field.schema?.is_nullable ? '?' : ''
  return `${key}${q}: ${type}`
}

function itemName(name: string) {
  return `Item${pascalCase(name)}`
}

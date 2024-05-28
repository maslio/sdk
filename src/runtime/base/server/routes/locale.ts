import { createError, defineEventHandler, getRouterParams } from 'h3'
// @ts-expect-error locales
import locales from '~/.nuxt/locales/index'

export default defineEventHandler(async (event) => {
  const { lang } = getRouterParams(event)
  if (!locales[lang])
    throw createError({ status: 404, message: 'Not Found' })
  return locales[lang].data
})

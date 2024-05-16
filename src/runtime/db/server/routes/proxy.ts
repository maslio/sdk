import { defineEventHandler, proxyRequest } from 'h3'
import { joinURL } from 'ufo'
import { useRuntimeConfig } from '#imports'

export default defineEventHandler(async (event) => {
  const proxyUrl = useRuntimeConfig().directusUrl as string
  const path = event.path.replace(/^\/_db\//, '')
  const target = joinURL(proxyUrl, path)
  return proxyRequest(event, target)
})

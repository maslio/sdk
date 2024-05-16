import { kebabCase } from 'scule'
import { defineNuxtPlugin, useHead } from '#imports'

export default defineNuxtPlugin(({ $device }) => {
  const device = $device as Record<string, boolean>
  const classes = Object.keys(device)
    .filter(key => key.startsWith('is') && device[key] === true)
    .map(key => kebabCase(key).slice(3))
  useHead({
    bodyAttrs: {
      class: classes.join(' '),
    },
  })
})

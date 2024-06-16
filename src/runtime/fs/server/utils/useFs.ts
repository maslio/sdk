import p from 'pathe'
import { createError, useRuntimeConfig } from '#imports'

export function useFs(dir: string) {
  const fs = useRuntimeConfig().fs as Record<string, string>
  if (!fs[dir])
    throw createError({ statusCode: 400, statusMessage: `Directory '${dir}' is not found in runtime config` })
  const root = fs[dir]

  function join(...path: string[]) {
    return p.join(...path)
  }

  function resolve(...path: string[]) {
    return p.join(root, ...path)
  }

  function relative(...path: string[]) {
    return p.relative(root, join(...path))
  }

  return { root, resolve, relative, join }
}

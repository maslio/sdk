import type { Import, Preset, builtinPresets } from 'unimport'
import { addImports as addImportsNuxt, useNuxt } from '@nuxt/kit'

type BuiltinPresetName = keyof typeof builtinPresets
type Target = 'client' | 'server' | 'both'

export function addImports(imports: Import | Import[], target: Target = 'both') {
  if (target === 'client' || target === 'both')
    addImportsNuxt(imports)
  if (target === 'server' || target === 'both')
    addImportsServer(imports)
}

export function addImportsPresets(presets: (Preset | BuiltinPresetName)[], target: Target = 'both') {
  if (target === 'client' || target === 'both')
    addImportsPresetsClient(presets)
  if (target === 'server' || target === 'both')
    addImportsPresetsServer(presets)
}

function addImportsServer(imports: Import | Import[]) {
  const nuxt = useNuxt()
  nuxt.options.nitro.imports ||= {}
  nuxt.options.nitro.imports.imports ||= []
  const _imports = Array.isArray(imports) ? imports : [imports]
  nuxt.options.nitro.imports.imports.push(..._imports)
}

function addImportsPresetsClient(presets: (Preset | BuiltinPresetName)[]) {
  const nuxt = useNuxt()
  nuxt.options.imports.presets ||= []
  nuxt.options.imports.presets.push(...presets)
}

function addImportsPresetsServer(presets: (Preset | BuiltinPresetName)[]) {
  const nuxt = useNuxt()
  nuxt.options.nitro.imports ||= {}
  nuxt.options.nitro.imports.presets ||= []
  nuxt.options.nitro.imports.presets.push(...presets)
}

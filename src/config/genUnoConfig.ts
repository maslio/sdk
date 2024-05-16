export default function () {
  const code = `
    import {
      defineConfig,
      presetAttributify,
      presetIcons,
      presetTypography,
      presetUno,
      presetWebFonts,
      transformerDirectives,
      transformerVariantGroup,
    } from 'unocss'
    import { presetScrollbar } from 'unocss-preset-scrollbar'
    
    const parentVariants = ['focused', 'dialog', 'desktop', 'mobile', 'card']
    const selfVariants = ['selected']
    
    export default defineConfig({
      content: {
        pipeline: {
          include: [
            /\\.(vue|ts)($|\\?)/,
          ],
        },
      },
      rules: [
        // these two lines are for removing warnings from console
        ['w-max-content', { width: 'max-content' }],
        ['scrollbar-width-auto', {}],
        ['scrollbar-color-[var(--scrollbar-thumb)_var(--scrollbar-track)]', {}],
        ['scrollbar-gutter-auto', { 'scrollbar-gutter': 'auto' }],
        ['scrollbar-gutter-stable', { 'scrollbar-gutter': 'stable' }],
      ],
      shortcuts: {
        'fit': 'absolute w-full h-full top-0 left-0',
        'text-bright': 'dark:text-light light:text-dark',
        'text-faint': 'dark:text-neutral-400 light:text-neutral-500',
        'text-primary': 'dark:text-purple-800 light:text-purple-600',
        'bg-positive': 'dark:bg-emerald-500 light:bg-emerald-400',
        'bg-negative': 'dark:bg-rose-500 light:bg-rose-400',
        'text-negative': 'dark:text-rose-400 light:text-rose-500',
        'bg-primary': 'dark:bg-purple-800 light:bg-purple-600',
        'color-back': 'dark:(bg-dark-900 text-light) light:(bg-neutral-200 text-dark)',
        'color-default': '\
            dark:(bg-dark-600 text-light clickable:bg-dark-300 selected:bg-neutral-700! focused:bg-dark-300)\
            light:(bg-light-100 text-dark clickable:bg-light-400 selected:bg-light-500! focused:bg-light-400)',
        'color-contrast': '\
          dark:(bg-light-300 text-dark clickable:bg-neutral-200)\
          light:(bg-dark-200 text-light clickable:bg-dark-100)',
        'color-primary': '\
          dark:(bg-purple-800 text-light clickable:bg-purple-700)\
          light:(bg-purple-600 text-light clickable:bg-purple-500)',
        'color-positive': '\
          dark:(bg-emerald-500 clickable:bg-emerald-600 text-gray-900)\
          light:(bg-emerald-400 clickable:bg-emerald-500 text-gray-900)',
        'color-neutral': '\
          dark:(bg-dark-100 text-light)\
          light:(bg-gray-200 text-light)',
        'color-negative': '\
          dark:(bg-rose-500 text-light)\
          light:(bg-rose-400 text-light)',
      },
      theme: {
        breakpoints: {
          'xs': '320px',
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
          '2xl': '1536px',
        },
      },
      variants: [
        ...parentVariants.map((variant) => {
          return (matcher: string) => {
            if (!matcher.startsWith(variant + ':'))
              return matcher
            return {
              matcher: matcher.slice(variant.length + 1),
              selector: (s: string) => '.' + variant + ' ' + s,
            }
          }
        }),
        ...selfVariants.map((variant) => {
          return (matcher: string) => {
            if (!matcher.startsWith(variant + ':'))
              return matcher
            return {
              matcher: matcher.slice(variant.length + 1),
              selector: (s: string) => '.' + variant + s,
            }
          }
        }),
        (matcher) => {
          if (!matcher.startsWith('clickable:'))
            return matcher
          return {
            matcher: matcher.slice(10),
            selector: s => '.clickable'+s+':hover',
          }
        },
      ],
      presets: [
        presetUno(),
        presetAttributify(),
        presetIcons(),
        presetTypography(),
        presetWebFonts({
          provider: 'google',
          fonts: {
            roboto: 'Roboto:300,400,700',
            mono: ['Fira Code', 'Fira Mono:400,700'],
          },
        }),
        presetScrollbar(),
      ],
      transformers: [
        transformerDirectives(),
        transformerVariantGroup(),
      ],
    })
  `
  return code
}

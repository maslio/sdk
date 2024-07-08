export default defineNuxtConfig({
  modules: ['../src/module.ts'],
  maslio: {
    locales: ['en-US', 'ru-RU'],
    ui: {
      weekStartsOn: 1,
      mousedown: true,
    },
    db: {},
    ai: {},
    fs: {
      dirs: ['torrents'],
    },
  },
  devtools: { enabled: true },
  compatibilityDate: '2024-07-08',
})

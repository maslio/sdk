export default defineNuxtConfig({
  modules: ['../src/module.ts'],
  maslio: {
    locales: ['en', 'ru'],
    ui: {
      weekStartsOn: 1,
      mousedown: true,
    },
    db: {},
    ai: {},
  },
  devtools: { enabled: true },
})

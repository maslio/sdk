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
  },
  devtools: { enabled: true },
})

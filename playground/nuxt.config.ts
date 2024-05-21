export default defineNuxtConfig({
  modules: ['../src/module.ts'],
  maslio: {
    locales: ['en', 'ru'],
    ui: true,
    db: true,
  },
  devtools: { enabled: true },
})

export default defineNuxtConfig({
  modules: ['../src/module.ts'],
  maslio: {
    locales: ['en', 'ru'],
    ui: {
      weekStartsOn: 1,
    },
    db: {},
  },
  image: {
    directus: {
      baseURL: '/_db/assets/',
    },
  },
  devtools: { enabled: true },
})

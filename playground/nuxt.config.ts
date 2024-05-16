export default defineNuxtConfig({
  modules: ['../src/module.ts'],
  maslio: {
    ui: true,
    db: true,
  },
  devtools: { enabled: true },
})

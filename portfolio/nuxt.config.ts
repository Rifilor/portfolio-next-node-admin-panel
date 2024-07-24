// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    "@/assets/style/main.scss",
  ],
  modules: [['@pinia/nuxt', {
    autoImports: ['defineStore', 'acceptHMRUpdate']
  }], "@nuxtjs/i18n", "@nuxtjs/svg-sprite", '@nuxt/eslint'],
  imports: {
    dirs: ['stores'],
  },
  i18n: {
    strategy: 'prefix_except_default',
    locales: ['en', 'ua'],
    defaultLocale: 'en',
    vueI18n: './i18n.config.js',
  },
  build: {
    transpile: ['@vuepic/vue-datepicker', 'vee-validate']
  },
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL,
 
    },
  },
  

 
 
})

import { registerPlugins } from '@core/utils/plugins'
import { createInertiaApp } from '@inertiajs/vue3'
import { createApp, h } from 'vue'

// Import styles
import '@core-scss/template/index.scss'
import '@styles/styles.scss'

// Initialize Inertia.js
createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob('./pages/**/*.vue', { eager: true })
    
    return pages[`./pages/${name}.vue`]
  },
  setup({ el, App, props, plugin }) {
    const app = createApp({ render: () => h(App, props) })

    registerPlugins(app) // Register your plugins (like Vuetify)
    app.use(plugin) // Register Inertia plugin
    app.mount(el)
  },
})

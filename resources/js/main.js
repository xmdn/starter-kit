import App from '@/App.vue'
import { abilitiesPlugin } from '@casl/vue'
import { registerPlugins } from '@core/utils/plugins'
import { createApp } from 'vue'

import ability from './@layouts/plugins/casl'

// Styles
import '@core-scss/template/index.scss'
import '@styles/styles.scss'

// Create vue app
const app = createApp(App)

// Use the CASL abilities plugin and provide the ability instance
app.use(abilitiesPlugin, ability, { useGlobalProperties: true })

// Register plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')

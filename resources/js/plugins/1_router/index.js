import { useAuthStore } from '@/utils/auth'
import { setupLayouts } from 'virtual:generated-layouts'
import { createRouter, createWebHistory } from 'vue-router/auto'

import { createPinia } from 'pinia'
import { canNavigate } from '../../@layouts/plugins/casl' // Import CASL function

const pinia = createPinia()
const authStore = useAuthStore(pinia)

const isAuthenticated = !!authStore.token?.value && !!authStore.user?.value

function recursiveLayouts(route, isAuthenticated) {
  if (route.children) {
    for (let i = 0; i < route.children.length; i++)
      route.children[i] = recursiveLayouts(route.children[i], isAuthenticated)
    
    return route
  }

  if (!route.meta) route.meta = {} // Ensure meta exists
  if (!route.meta.layout) {
    route.meta.layout = isAuthenticated ? 'authenticated' : 'default'
  }
  route.meta.layout = authStore.isAuthenticated ? 'authenticated' : 'default'
  
  return setupLayouts([route])[0]
}


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash)
      return { el: to.hash, behavior: 'smooth', top: 60 }
    
    return { top: 0 }
  },
  extendRoutes: pages => [
    ...[...pages].map(route => recursiveLayouts(route)),
  ],
})

// Add navigation guard for authentication
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!to.meta.layout) {
    to.meta.layout = authStore.isAuthenticated ? 'authenticated' : 'default'
  }

  // Always allow access to login
  if (to.path === '/login') return next()

  // **Check CASL Permissions Before Navigating**
  if (!canNavigate(to)) {
    console.warn('ACCESS DENIED: You do not have permission to access this page.')
    
    
    // router.push('/login') // Redirect to an Unauthorized page
  }

  

  // If the user is authenticated
  if (authStore.isAuthenticated && to.path === '/') {
    router.push('/second-page')

    // if (to.path === '/') {
    //   // If the user is authenticated and name is 'John Doe', redirect to '/Testing'
    //   if (authStore.user?.role === 'admin') {
    //     // router.push('/Testing') // Redirect to Testing page
    //   }

    //   // Otherwise, redirect to '/second-page'
    //   // router.push('/second-page')
    // }
  } 

  // else {
    
  // If the user is not authenticated, continue normally
  // if (to.meta.requiresAuth && !authStore.isAuthenticated) {
  //   router.push('/login') // Redirect to login if not authenticated
  // }
  // }

  next() // Proceed to the route
})

// Redirection method for use in auth.js or other parts of the app
export function redirect(route) {
  router.push(route) // Perform the redirection
}

export { router }
export default function (app) {
  app.use(router)
}

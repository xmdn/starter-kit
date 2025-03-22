import axios from 'axios'
import Cookies from 'js-cookie'
import { defineStore } from 'pinia'
import { ability, defineAbilityFor } from '../@layouts/plugins/casl'
import { redirect } from '../plugins/1_router/index'

axios.defaults.withCredentials = true // Enable session cookies for Sanctum


export const useAuthStore = defineStore('auth', {
  state: () => {
    // Use cookieRef to link the state directly to the cookies
    const token = useCookie('accessToken', null) // Default is null if the cookie is not set
    const user = useCookie('userData', null) // Default is null if the cookie is not set
    const isAuthenticated = token.value && user.value // If there's a token and user, set as authenticated

    return {
      token,
      user,
      isAuthenticated,
    }
  },
  actions: {
    initializeAuth() {

      const abilityUsr = defineAbilityFor(this.user)

      const post = { id: 1, user_id: 2 }

      // console.log('ABILITY: ', abilityUsr.cannot('update', subject('Post', post)))

    },
    async handleLogin(email, password) {
      console.log(email, password)
      try {
        const response = await axios.post('http://localhost/api/login', { email, password })

        console.log('RESPONSE DATA: ', response.data)
        this.user = response.data.userData
        this.token = response.data.accessToken
        useCookie('accessToken').value = response.data.accessToken
        useCookie('userData').value = response.data.userData
        
        const abilityUsr = defineAbilityFor(this.user)

        ability.update(abilityUsr.rules)
            
        this.isAuthenticated = true

        redirect('/') // Redirect after login
      } catch (error) {
        console.error('Login Error:', error)
      }
    },
    async handleRegister(name, email, password, password_confirmation) {
      console.log(email, password)
      try {
        // Validate that password and confirm password match
        if (password !== password_confirmation) {
          console.error('Passwords do not match')
          
          return
        }

        const response = await axios.post('http://localhost/api/register', { name, email, password, password_confirmation })

        // this.user = response.data.user
        // this.token = response.data.token
        useCookie('accessToken').value = response.data.accessToken
        useCookie('userData').value = response.data.userData

        // Cookies.set('auth_session', JSON.stringify({ user: response.data.user, token: response.data.token }), { expires: 5 / 144 })
        this.isAuthenticated = true
        redirect('/') // Redirect after login
      } catch (error) {
        console.error('Login Error:', error)
      }
    },
    async handleLogout() {
      try {
        await axios.post('http://localhost/api/logout')

        this.user = null
        this.token = null
        
        this.isAuthenticated = false

        // const ability = useAbility();
            
        ability.update([])
        
        useCookie('XSRF-TOKEN').value = null
        useCookie('userData').value = null
        useCookie('accessToken').value = null
        redirect('/') // Redirect after logout
      } catch (error) {
        console.error('Logout Error:', error)
      }
    },
    async handleOAuthLogin(provider) {
      try {
        // Simulated OAuth Login (Replace with real OAuth API call)
        this.login({ provider, email: `${provider}@example.com`, name: provider.toUpperCase() })
      } catch (error) {
        console.error(`OAuth login failed with ${provider}:`, error.message)
      }
    },
    async loadUser() {
      const accessT = useCookie('accessToken') // Get user data from cookies
      const userData = useCookie('userData')

      console.log('Auth.js userData: ', userData)
      if (userData) {
        try {
    
          console.log('Auth.js userData: ', userData)

          // Set the user and token in the store's state
          this.user = JSON.parse(userData) 
          this.token = JSON.parse(accessT)
          this.isAuthenticated = true  // Set authentication state
    
          return { user: JSON.parse(userData), token: JSON.parse(accessT) } // Return the store as object
        } catch (error) {
          console.error("Error parsing user data:", error)

          // this.clearUser(); // Clear the session if parsing fails
        }
      }
      
    },
    async clearUser() {
      // Clear the cookie when needed (e.g., logout)
      Cookies.remove('auth_session')
    },
  },
})

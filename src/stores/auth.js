import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as msal from '@azure/msal-browser'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isGuest = ref(false)
  const isLoading = ref(false)

  let msalInstance = null
  let isInitialized = false

  const isAuthenticated = computed(() => user.value !== null)
  const userName = computed(() => {
    if (isGuest.value) return 'Invité'
    return user.value?.name || user.value?.email || 'Utilisateur'
  })
  const userId = computed(() => {
    if (isGuest.value) return 'guest'
    return user.value?.id || user.value?.email || 'guest'
  })

  const requestedScopes = {
    scopes: ["User.Read"]
  }

  async function ensureInitialized() {
    if (!isInitialized && !msalInstance) {
      msalInstance = new msal.PublicClientApplication({
        auth: {
          clientId: "e8137439-4d1d-462d-a85f-f81cfea8f0d8"
        },
        cache: {
          cacheLocation: "sessionStorage"
        }
      })

      await msalInstance.initialize()
      isInitialized = true
      console.log('MSAL initialisé avec succès')
    }
  }

  const loginWithMicrosoft = async () => {
    isLoading.value = true

    try {
      await ensureInitialized()

      console.log('Début de la connexion Microsoft...')
      const authResult = await msalInstance.loginPopup(requestedScopes)

      if (authResult && authResult.account) {
        msalInstance.setActiveAccount(authResult.account)

        const authenticatedUser = {
          id: authResult.account.homeAccountId,
          name: authResult.account.name,
          email: authResult.account.username,
          provider: 'microsoft',
          avatar: null,
          authenticatedAt: new Date().toISOString()
        }

        user.value = authenticatedUser
        isGuest.value = false

        localStorage.setItem('health_journal_user', JSON.stringify(authenticatedUser))
        localStorage.setItem('health_journal_is_guest', 'false')

        console.log('Connexion Microsoft réussie:', authenticatedUser)
        return authenticatedUser
      }

    } catch (error) {
      console.error('Erreur lors de la connexion Microsoft:', error)
      if (error.name === 'BrowserAuthError' && error.errorCode === 'popup_window_error') {
        alert('Erreur : Les popups sont bloquées. Veuillez autoriser les popups pour ce site.')
      } else {
        alert('Erreur lors de la connexion Microsoft: ' + error.message)
      }
      throw error
    } finally {
      isLoading.value = false
    }
  }

  const loginAsGuest = () => {
    const guestUser = {
      id: 'guest_' + Date.now(),
      name: 'Invité',
      email: null,
      provider: 'guest',
      authenticatedAt: new Date().toISOString()
    }

    user.value = guestUser
    isGuest.value = true

    localStorage.setItem('health_journal_user', JSON.stringify(guestUser))
    localStorage.setItem('health_journal_is_guest', 'true')

    console.log('Connexion en mode invité:', guestUser)
    return guestUser
  }

  const logout = async () => {
    if (isGuest.value) {
      const confirmed = window.confirm(
        'En tant qu\'invité, toutes vos données seront perdues.\n\nÊtes-vous sûr de vouloir vous déconnecter ?'
      )
      if (!confirmed) return false
    }

    try {
      if (!isGuest.value && msalInstance) {
        await ensureInitialized()
        await msalInstance.logoutPopup()
      }

      if (isGuest.value) {
        const userData = JSON.parse(localStorage.getItem('health_journal_data') || '{}')
        if (userData.users && userData.users.guest) {
          delete userData.users.guest
          localStorage.setItem('health_journal_data', JSON.stringify(userData))
        }
      }

      user.value = null
      isGuest.value = false

      localStorage.removeItem('health_journal_user')
      localStorage.removeItem('health_journal_is_guest')

      console.log('Déconnexion réussie')
      return true

    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
      user.value = null
      isGuest.value = false
      localStorage.removeItem('health_journal_user')
      localStorage.removeItem('health_journal_is_guest')
      return true
    }
  }

  const initializeAuth = async () => {
    const savedUser = localStorage.getItem('health_journal_user')
    const savedIsGuest = localStorage.getItem('health_journal_is_guest')

    if (savedUser) {
      user.value = JSON.parse(savedUser)
      isGuest.value = savedIsGuest === 'true'
      console.log('Session restaurée:', user.value)

      if (!isGuest.value) {
        try {
          await ensureInitialized()
          const accounts = msalInstance.getAllAccounts()
          if (accounts.length > 0) {
            msalInstance.setActiveAccount(accounts[0])
          }
        } catch (error) {
          console.warn('Erreur lors de la restauration de session MSAL:', error)
        }
      }
    }
  }

  initializeAuth()

  return {
    user,
    isGuest,
    isLoading,
    isAuthenticated,
    userName,
    userId,
    loginWithMicrosoft,
    loginAsGuest,
    logout,
    initializeAuth
  }
})

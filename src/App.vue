<template>
  <div id="app" class="min-h-screen bg-theme-primary text-theme-primary">
    <!-- Page de login si pas connecté -->
    <div v-if="!authStore.isAuthenticated" class="min-h-screen bg-theme-primary flex items-center justify-center p-4">
      <div class="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div class="w-full max-w-md">
        <div class="text-center mb-8 animate-fade-in">
          <div class="mx-auto w-16 h-16 mb-4 rounded-full gradient-wellness flex items-center justify-center">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-theme-primary mb-2">
            Journal de Santé
          </h1>
          <p class="text-theme-secondary">
            Suivez votre bien-être au quotidien
          </p>
        </div>

        <div class="card p-8 animate-fade-in" style="animation-delay: 0.2s;">
          <button
            @click="handleMicrosoftLogin"
            :disabled="authStore.isLoading"
            class="w-full mb-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center group"
          >
            <svg v-if="!authStore.isLoading" class="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
            </svg>
            <div v-else class="w-5 h-5 mr-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            {{ authStore.isLoading ? 'Connexion...' : 'Se connecter avec Microsoft' }}
          </button>

          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-slate-300 dark:border-slate-600"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-4 bg-theme-card text-theme-muted">ou</span>
            </div>
          </div>

          <button
            @click="handleGuestLogin"
            class="w-full bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center group"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Continuer en tant qu'invité
          </button>

          <div class="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg">
            <div class="flex">
              <svg class="w-5 h-5 text-yellow-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div class="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Mode invité :</strong> Vos données seront perdues à la déconnexion. 
                Créez un compte pour les conserver.
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 grid grid-cols-2 gap-4 animate-fade-in" style="animation-delay: 0.4s;">
          <div class="card p-4 text-center">
            <div class="w-8 h-8 mx-auto mb-2 text-emerald-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 class="font-semibold text-theme-primary text-sm mb-1">Suivi complet</h3>
            <p class="text-theme-muted text-xs">Sommeil, humeur, activité</p>
          </div>

          <div class="card p-4 text-center">
            <div class="w-8 h-8 mx-auto mb-2 text-violet-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 class="font-semibold text-theme-primary text-sm mb-1">Gamification</h3>
            <p class="text-theme-muted text-xs">Objectifs et badges</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard si connecté -->
    <div v-else class="min-h-screen bg-theme-primary">
      <header class="bg-theme-secondary border-b border-theme p-4">
        <div class="max-w-6xl mx-auto flex justify-between items-center">
          <h1 class="text-2xl font-bold gradient-wellness bg-clip-text text-transparent">
            🏥 Journal de Santé
          </h1>
          
          <div class="flex items-center gap-4">
            <div class="text-theme-secondary">
              Connecté: {{ authStore.userName }}
              <span v-if="authStore.isGuest" class="text-yellow-500 ml-2">(Invité)</span>
            </div>
            
            <ThemeToggle />
            
            <button @click="handleLogout" 
                    class="btn-ghost text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 px-4">
              🚪 Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main class="max-w-6xl mx-auto p-8">
        <div class="card p-6 animate-fade-in">
          <h2 class="text-xl font-semibold text-theme-primary mb-4">🎉 Bienvenue {{ authStore.userName }} !</h2>
          
          <div class="bg-theme-secondary p-4 rounded-lg mb-4">
            <h3 class="font-semibold text-theme-primary mb-2">Informations de connexion :</h3>
            <p class="text-theme-secondary">ID: {{ authStore.userId }}</p>
            <p class="text-theme-secondary">Type: {{ authStore.isGuest ? 'Invité' : 'Microsoft' }}</p>
            <p class="text-theme-secondary">Email: {{ authStore.user?.email || 'Non disponible' }}</p>
          </div>

          <div class="space-y-2 text-sm">
            <p class="text-theme-secondary">✅ Authentification fonctionnelle</p>
            <p class="text-theme-secondary">✅ Système de thèmes</p>
            <p class="text-theme-secondary">✅ Gestion des sessions</p>
            <p class="text-theme-secondary">⏳ Prochaine étape : Interface de journal</p>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'

const authStore = useAuthStore()
const themeStore = useThemeStore()

const handleMicrosoftLogin = () => {
  authStore.loginWithMicrosoft()
}

const handleGuestLogin = () => {
  authStore.loginAsGuest()
}

const handleLogout = () => {
  authStore.logout()
}
</script>
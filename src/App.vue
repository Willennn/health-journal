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

    <!-- Application principale si connecté -->
    <div v-else class="min-h-screen bg-theme-primary">
      <!-- Header -->
      <header class="bg-theme-secondary border-b border-theme p-4 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          <div class="flex items-center space-x-6">
            <h1 class="text-2xl font-bold gradient-wellness bg-clip-text text-transparent flex items-center">
              <svg class="w-8 h-8 mr-2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Journal de Santé
            </h1>
            
            <!-- Navigation -->
            <nav class="hidden md:flex space-x-6">
              <button 
                @click="currentView = 'dashboard'"
                :class="currentView === 'dashboard' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-theme-secondary hover:text-theme-primary'"
                class="pb-2 transition-colors"
              >
                Dashboard
              </button>
              <button 
                @click="currentView = 'journal'"
                :class="currentView === 'journal' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-theme-secondary hover:text-theme-primary'"
                class="pb-2 transition-colors"
              >
                Journal
              </button>
              <button 
                @click="currentView = 'history'"
                :class="currentView === 'history' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-theme-secondary hover:text-theme-primary'"
                class="pb-2 transition-colors"
              >
                Historique
              </button>
              <button 
                @click="currentView = 'analytics'"
                :class="currentView === 'analytics' ? 'text-emerald-500 border-b-2 border-emerald-500' : 'text-theme-secondary hover:text-theme-primary'"
                class="pb-2 transition-colors"
              >
                Analytics
              </button>
            </nav>
          </div>
          
          <div class="flex items-center space-x-4">
            <!-- Indicateur de progression aujourd'hui -->
            <div class="hidden md:flex items-center space-x-2 bg-theme-card px-3 py-2 rounded-lg">
              <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
              <span class="text-sm text-theme-secondary">{{ journalStore.getTodayProgress.overall }}% aujourd'hui</span>
            </div>

            <div class="text-right hidden md:block">
              <div class="text-sm text-theme-primary font-medium">{{ authStore.userName }}</div>
              <div class="text-xs text-theme-muted">
                {{ authStore.isGuest ? 'Mode invité' : 'Connecté' }}
              </div>
            </div>
            
            <ThemeToggle />
            
            <button @click="handleLogout" 
                    class="btn-ghost text-red-500 border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 py-2 px-4">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Contenu principal -->
      <main class="max-w-7xl mx-auto px-4 py-8">
        <!-- Dashboard -->
        <div v-if="currentView === 'dashboard'" class="animate-fade-in">
          <!-- Greeting et stats rapides -->
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-theme-primary mb-2">
              Bonjour {{ authStore.userName }} ! 👋
            </h2>
            <p class="text-theme-secondary">
              {{ getGreetingMessage() }}
            </p>
          </div>

          <!-- Progression du jour -->
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div class="card p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-theme-primary">Sommeil</h3>
                <div class="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                </div>
              </div>
              <div class="space-y-2">
                <div v-if="journalStore.getTodayEntry.sleep.bedTime" class="text-sm text-theme-secondary">
                  Coucher: {{ journalStore.getTodayEntry.sleep.bedTime }}
                </div>
                <div v-if="journalStore.getTodayEntry.sleep.wakeTime" class="text-sm text-theme-secondary">
                  Lever: {{ journalStore.getTodayEntry.sleep.wakeTime }}
                </div>
                <div v-if="!journalStore.getTodayEntry.sleep.bedTime" class="text-sm text-theme-muted">
                  Pas encore renseigné
                </div>
              </div>
            </div>

            <div class="card p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-theme-primary">Humeur</h3>
                <div class="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                  <span class="text-lg">{{ journalStore.getTodayEntry.mood.emoji || '😊' }}</span>
                </div>
              </div>
              <div class="space-y-2">
                <div v-if="journalStore.getTodayEntry.mood.score > 0" class="text-2xl font-bold text-theme-primary">
                  {{ journalStore.getTodayEntry.mood.score }}/10
                </div>
                <div v-else class="text-sm text-theme-muted">
                  Pas encore renseigné
                </div>
              </div>
            </div>

            <div class="card p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-theme-primary">Activité</h3>
                <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div class="space-y-2">
                <div class="text-2xl font-bold text-theme-primary">
                  {{ journalStore.getTotalActivityMinutes(journalStore.getTodayEntry) }}min
                </div>
                <div class="text-sm text-theme-secondary">
                  Objectif: {{ journalStore.goals.activityMinutes }}min
                </div>
              </div>
            </div>

            <div class="card p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-semibold text-theme-primary">Série</h3>
                <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9.663 17h4.673M12 3v1m6.364-.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
              </div>
              <div class="space-y-2">
                <div class="text-2xl font-bold text-theme-primary">
                  {{ journalStore.getCurrentStreak }} jours
                </div>
                <div class="text-sm text-theme-secondary">
                  Record: {{ journalStore.achievements.streaks.best }}
                </div>
              </div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <button 
              @click="currentView = 'journal'"
              class="card p-4 hover:bg-theme-card transition-colors text-left group"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-theme-primary">Ajouter une entrée</h3>
                  <p class="text-sm text-theme-muted">Compléter le journal</p>
                </div>
              </div>
            </button>

            <button 
              @click="showQuickMood = true"
              class="card p-4 hover:bg-theme-card transition-colors text-left group"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span class="text-lg">😊</span>
                </div>
                <div>
                  <h3 class="font-semibold text-theme-primary">Humeur rapide</h3>
                  <p class="text-sm text-theme-muted">Comment vous sentez-vous ?</p>
                </div>
              </div>
            </button>

            <button 
              @click="showQuickActivity = true"
              class="card p-4 hover:bg-theme-card transition-colors text-left group"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-theme-primary">Activité rapide</h3>
                  <p class="text-sm text-theme-muted">Ajouter du sport</p>
                </div>
              </div>
            </button>

            <button 
              @click="currentView = 'analytics'"
              class="card p-4 hover:bg-theme-card transition-colors text-left group"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-theme-primary">Voir les stats</h3>
                  <p class="text-sm text-theme-muted">Analyse des données</p>
                </div>
              </div>
            </button>
          </div>

          <!-- Graphique de la semaine -->
          <div class="card p-6 mb-8">
            <h3 class="text-xl font-semibold text-theme-primary mb-6">Progression de la semaine</h3>
            <div class="grid grid-cols-7 gap-2">
              <div 
                v-for="day in journalStore.getWeekEntries" 
                :key="day.date"
                class="text-center"
              >
                <div class="text-xs text-theme-muted mb-2">{{ day.dayName }}</div>
                <div 
                  :class="[
                    'w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-semibold',
                    getDayCompletionClass(day.entry)
                  ]"
                >
                  {{ getDayCompletionScore(day.entry) }}
                </div>
                <div class="text-xs text-theme-muted mt-1">
                  {{ day.date.split('-')[2] }}
                </div>
              </div>
            </div>
          </div>

          <!-- Badges récents -->
          <div v-if="journalStore.achievements.badges.length > 0" class="card p-6">
            <h3 class="text-xl font-semibold text-theme-primary mb-4">Badges obtenus</h3>
            <div class="flex flex-wrap gap-3">
              <div 
                v-for="badge in journalStore.achievements.badges" 
                :key="badge"
                class="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-violet-500 text-white px-3 py-2 rounded-full text-sm font-medium"
              >
                <span>{{ getBadgeEmoji(badge) }}</span>
                <span>{{ getBadgeName(badge) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Journal -->
        <div v-if="currentView === 'journal'" class="animate-fade-in">
          <JournalEntry />
        </div>

        <!-- Historique -->
        <div v-if="currentView === 'history'" class="animate-fade-in">
          <HistoryCalendar />
        </div>

        <!-- Analytics -->
        <div v-if="currentView === 'analytics'" class="animate-fade-in">
          <div class="text-center py-16">
            <h2 class="text-2xl font-bold text-theme-primary mb-4">Analytics</h2>
            <p class="text-theme-secondary">Fonctionnalité en cours de développement...</p>
          </div>
        </div>
      </main>
    </div>

    <!-- Modales rapides -->
    <!-- Modal humeur rapide -->
    <div v-if="showQuickMood" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showQuickMood = false">
      <div class="bg-theme-card rounded-xl p-6 max-w-md w-full mx-4" @click.stop>
        <h3 class="text-xl font-semibold text-theme-primary mb-4">Comment vous sentez-vous ?</h3>
        <div class="grid grid-cols-5 gap-3 mb-4">
          <button
            v-for="mood in quickMoods"
            :key="mood.score"
            @click="setQuickMood(mood)"
            class="p-3 text-center rounded-lg border-2 border-transparent hover:border-emerald-500 transition-colors"
          >
            <div class="text-2xl mb-1">{{ mood.emoji }}</div>
            <div class="text-xs text-theme-muted">{{ mood.score }}</div>
          </button>
        </div>
        <div class="flex space-x-3">
          <button @click="showQuickMood = false" class="btn-ghost flex-1">Annuler</button>
        </div>
      </div>
    </div>

    <!-- Modal activité rapide -->
    <div v-if="showQuickActivity" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showQuickActivity = false">
      <div class="bg-theme-card rounded-xl p-6 max-w-md w-full mx-4" @click.stop>
        <h3 class="text-xl font-semibold text-theme-primary mb-4">Activité rapide</h3>
        <div class="grid grid-cols-2 gap-3 mb-4">
          <button
            v-for="activity in quickActivities"
            :key="activity.type"
            @click="addQuickActivity(activity)"
            class="p-4 text-center rounded-lg border-2 border-transparent hover:border-emerald-500 transition-colors"
          >
            <div class="text-2xl mb-2">{{ activity.emoji }}</div>
            <div class="text-sm font-medium text-theme-primary">{{ activity.type }}</div>
            <div class="text-xs text-theme-muted">{{ activity.defaultDuration }}min</div>
          </button>
        </div>
        <div class="flex space-x-3">
          <button @click="showQuickActivity = false" class="btn-ghost flex-1">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useJournalStore } from '@/stores/journal'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import JournalEntry from '@/components/JournalEntry.vue'
import HistoryCalendar from '@/components/HistoryCalendar.vue'

const authStore = useAuthStore()
const themeStore = useThemeStore()
const journalStore = useJournalStore()

const currentView = ref('dashboard')
const showQuickMood = ref(false)
const showQuickActivity = ref(false)

const quickMoods = [
  { score: 2, emoji: '😢' },
  { score: 4, emoji: '😕' },
  { score: 6, emoji: '😐' },
  { score: 8, emoji: '😊' },
  { score: 10, emoji: '😄' }
]

const quickActivities = [
  { type: 'Marche', emoji: '🚶', defaultDuration: 30 },
  { type: 'Course', emoji: '🏃', defaultDuration: 20 },
  { type: 'Vélo', emoji: '🚴', defaultDuration: 45 },
  { type: 'Yoga', emoji: '🧘', defaultDuration: 30 }
]

onMounted(() => {
  if (authStore.isAuthenticated) {
    journalStore.loadFromStorage(authStore.userId)
  }
})

const handleMicrosoftLogin = () => {
  authStore.loginWithMicrosoft().then(() => {
    if (authStore.isAuthenticated) {
      journalStore.loadFromStorage(authStore.userId)
    }
  })
}

const handleGuestLogin = () => {
  authStore.loginAsGuest()
  journalStore.loadFromStorage(authStore.userId)
}

const handleLogout = () => {
  authStore.logout()
}

const getGreetingMessage = () => {
  const hour = new Date().getHours()
  const progress = journalStore.getTodayProgress.overall
  
  let timeGreeting = ''
  if (hour < 12) timeGreeting = 'Bonne matinée'
  else if (hour < 17) timeGreeting = 'Bon après-midi'
  else timeGreeting = 'Bonne soirée'
  
  if (progress === 0) {
    return `${timeGreeting} ! Prêt à commencer votre journal de santé ?`
  } else if (progress < 50) {
    return `${timeGreeting} ! Vous avez commencé votre journal, continuez !`
  } else if (progress < 100) {
    return `${timeGreeting} ! Belle progression aujourd'hui, encore un petit effort !`
  } else {
    return `${timeGreeting} ! Journal complet aujourd'hui, félicitations ! 🎉`
  }
}

const getDayCompletionScore = (entry) => {
  let score = 0
  if (entry.sleep.bedTime && entry.sleep.wakeTime) score += 25
  if (entry.mood.score > 0) score += 25
  if (entry.activity.length > 0) score += 25
  if (entry.food.length > 0) score += 25
  return `${score}%`
}

const getDayCompletionClass = (entry) => {
  const score = parseInt(getDayCompletionScore(entry))
  if (score === 0) return 'bg-gray-200 dark:bg-gray-700 text-gray-500'
  if (score < 50) return 'bg-red-200 dark:bg-red-900/30 text-red-600'
  if (score < 100) return 'bg-yellow-200 dark:bg-yellow-900/30 text-yellow-600'
  return 'bg-green-200 dark:bg-green-900/30 text-green-600'
}

const getBadgeEmoji = (badge) => {
  const badges = {
    'first_entry': '🎯',
    'week_streak': '🔥',
    'month_streak': '⭐',
    'hundred_days': '👑'
  }
  return badges[badge] || '🏆'
}

const getBadgeName = (badge) => {
  const badges = {
    'first_entry': 'Premier jour',
    'week_streak': 'Série de 7 jours',
    'month_streak': 'Série de 30 jours',
    'hundred_days': '100 jours'
  }
  return badges[badge] || 'Badge mystère'
}

const setQuickMood = (mood) => {
  journalStore.updateEntry(new Date(), 'mood', {
    score: mood.score,
    emoji: mood.emoji,
    tags: [],
    notes: 'Ajout rapide'
  })
  showQuickMood.value = false
}

const addQuickActivity = (activity) => {
  journalStore.addActivity(new Date(), {
    type: activity.type,
    duration: activity.defaultDuration,
    intensity: 'Modérée',
    calories: Math.round(activity.defaultDuration * 5),
    notes: 'Ajout rapide'
  })
  showQuickActivity.value = false
}
</script>
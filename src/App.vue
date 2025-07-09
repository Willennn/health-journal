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

          <div class="flex items-center my-4">
            <div class="flex-1 border-b border-theme"></div>
            <div class="px-4 text-theme-muted text-sm">ou</div>
            <div class="flex-1 border-b border-theme"></div>
          </div>

          <button
            @click="handleGuestLogin"
            :disabled="authStore.isLoading"
            class="w-full bg-theme-secondary hover:bg-theme-card disabled:bg-theme-muted text-theme-primary font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Continuer en mode invité
          </button>

          <div class="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
            <div class="flex items-start space-x-3">
              <svg class="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div class="text-sm text-amber-700 dark:text-amber-300">
                <p class="font-medium mb-1">Mode invité</p>
                <p>Vos données seront stockées localement. Créez un compte pour les conserver.</p>
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
      <!-- Header CORRIGÉ -->
      <header class="bg-theme-secondary border-b border-theme p-4 sticky top-0 z-50">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
          <div class="flex items-center space-x-6">
            <!-- Logo amélioré avec CORRECT flex layout -->
            <div class="flex items-center space-x-3">
              <!-- Icône avec gradient -->
              <div class="relative">
                <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <!-- Petit indicateur de progression -->
                <div class="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full border-2 border-white"></div>
              </div>
              
              <!-- Titre avec gradient à CÔTÉ de l'icône -->
              <div>
                <h1 class="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  Journal de Santé
                </h1>
                <p class="text-xs text-theme-muted -mt-1">Votre bien-être quotidien</p>
              </div>
            </div>
            
            <!-- Navigation -->
            <nav class="hidden md:flex space-x-6">
              <button 
                @click="currentView = 'dashboard'"
                :class="[
                  'pb-2 transition-colors relative',
                  currentView === 'dashboard' 
                    ? 'text-emerald-500' 
                    : 'text-theme-secondary hover:text-theme-primary'
                ]"
              >
                <span class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 1v6m8-6v6" />
                  </svg>
                  <span>Dashboard</span>
                </span>
                <div 
                  v-if="currentView === 'dashboard'"
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full"
                ></div>
              </button>
              
              <button 
                @click="currentView = 'journal'"
                :class="[
                  'pb-2 transition-colors relative',
                  currentView === 'journal' 
                    ? 'text-emerald-500' 
                    : 'text-theme-secondary hover:text-theme-primary'
                ]"
              >
                <span class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span>Journal</span>
                </span>
                <div 
                  v-if="currentView === 'journal'"
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full"
                ></div>
              </button>
              
              <button 
                @click="currentView = 'history'"
                :class="[
                  'pb-2 transition-colors relative',
                  currentView === 'history' 
                    ? 'text-emerald-500' 
                    : 'text-theme-secondary hover:text-theme-primary'
                ]"
              >
                <span class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span>Historique</span>
                </span>
                <div 
                  v-if="currentView === 'history'"
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full"
                ></div>
              </button>
              
              <button 
                @click="currentView = 'analytics'"
                :class="[
                  'pb-2 transition-colors relative',
                  currentView === 'analytics' 
                    ? 'text-emerald-500' 
                    : 'text-theme-secondary hover:text-theme-primary'
                ]"
              >
                <span class="flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Analytics</span>
                </span>
                <div 
                  v-if="currentView === 'analytics'"
                  class="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-full"
                ></div>
              </button>
            </nav>
          </div>

          <!-- Section droite -->
          <div class="flex items-center space-x-4">
            <!-- Indicateur de progression quotidienne -->
            <div v-if="journalStore.getTodayProgress" class="hidden sm:flex items-center space-x-2 text-sm">
              <div class="w-16 h-2 bg-theme-card rounded-full overflow-hidden">
                <div 
                  class="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
                  :style="{ width: `${journalStore.getTodayProgress.overall}%` }"
                ></div>
              </div>
              <span class="text-theme-muted">{{ journalStore.getTodayProgress.overall }}% aujourd'hui</span>
            </div>

            <!-- Toggle thème -->
            <ThemeToggle />
            
            <!-- Profil utilisateur -->
            <div class="flex items-center space-x-3">
              <div class="hidden sm:block text-right">
                <div class="text-sm font-medium text-theme-primary">{{ authStore.user?.name || 'Utilisateur' }}</div>
                <div class="text-xs text-theme-muted">{{ authStore.isAuthenticated ? 'Connecté' : 'Mode invité' }}</div>
              </div>
              
              <!-- Avatar -->
              <div class="relative">
                <img 
                  v-if="authStore.user?.picture"
                  :src="authStore.user.picture" 
                  :alt="authStore.user.name"
                  class="w-8 h-8 rounded-full border-2 border-emerald-200"
                />
                <div 
                  v-else
                  class="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-medium text-sm"
                >
                  {{ (authStore.user?.name || 'U').charAt(0).toUpperCase() }}
                </div>
                <!-- Indicateur de connexion -->
                <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              
              <!-- Menu utilisateur -->
              <button 
                @click="handleLogout"
                class="text-theme-secondary hover:text-theme-primary transition-colors"
                title="Se déconnecter"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Navigation mobile -->
        <nav class="md:hidden mt-4 flex space-x-4 overflow-x-auto pb-2">
          <button 
            v-for="view in mobileViews"
            :key="view.id"
            @click="currentView = view.id"
            :class="[
              'flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors',
              currentView === view.id
                ? 'bg-emerald-500 text-white'
                : 'bg-theme-card text-theme-secondary hover:bg-theme-primary'
            ]"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="view.iconPath" />
            </svg>
            <span class="text-sm">{{ view.name }}</span>
          </button>
        </nav>
      </header>

      <!-- Contenu principal -->
      <main class="container mx-auto px-4 py-8">
        <!-- Dashboard -->
        <div v-if="currentView === 'dashboard'" class="space-y-8">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-theme-primary mb-4 flex items-center justify-center">
              {{ getGreetingMessage() }} 👋
            </h2>
          </div>

          <!-- Cartes de résumé -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <!-- Sommeil -->
            <div class="card p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-theme-primary">Sommeil</h3>
                <span class="text-2xl">🌙</span>
              </div>
              <div v-if="journalStore.getTodayEntry?.sleep?.bedTime">
                <p class="text-sm text-theme-muted mb-1">Coucher: {{ journalStore.getTodayEntry.sleep.bedTime }}</p>
                <p class="text-sm text-theme-muted mb-2">Lever: {{ journalStore.getTodayEntry.sleep.wakeTime || 'Non renseigné' }}</p>
                <div v-if="journalStore.getSleepDuration(journalStore.getTodayEntry) > 0" class="text-lg font-bold text-emerald-500">
                  {{ journalStore.getSleepDuration(journalStore.getTodayEntry).toFixed(1) }}h
                </div>
              </div>
              <div v-else class="text-theme-muted">Pas encore renseigné</div>
            </div>

            <!-- Humeur -->
            <div class="card p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-theme-primary">Humeur</h3>
                <span class="text-2xl">😊</span>
              </div>
              <div v-if="journalStore.getTodayEntry?.mood?.score">
                <div class="text-2xl mb-2">{{ journalStore.getTodayEntry.mood.emoji }}</div>
                <div class="text-lg font-bold text-emerald-500">{{ journalStore.getTodayEntry.mood.score }}/10</div>
              </div>
              <div v-else class="text-theme-muted">Pas encore renseigné</div>
            </div>

            <!-- Activité -->
            <div class="card p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-theme-primary">Activité</h3>
                <span class="text-2xl">⚡</span>
              </div>
              <div class="text-2xl font-bold text-emerald-500 mb-1">
                {{ journalStore.getTotalActivityMinutes(journalStore.getTodayEntry || { activity: [] }) }}min
              </div>
              <div class="text-sm text-theme-muted">Objectif: {{ journalStore.goals.activityMinutes }}min</div>
            </div>

            <!-- Série -->
            <div class="card p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-lg font-semibold text-theme-primary">Série</h3>
                <span class="text-2xl">🔥</span>
              </div>
              <div class="text-2xl font-bold text-emerald-500 mb-1">{{ journalStore.getCurrentStreak }} jours</div>
              <div class="text-sm text-theme-muted">Record: {{ journalStore.achievements.streaks.best }}</div>
            </div>
          </div>

          <!-- Actions rapides -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <button
              @click="currentView = 'journal'"
              class="card p-6 hover:scale-105 transition-transform cursor-pointer group"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span class="text-lg">➕</span>
                </div>
                <div class="text-left">
                  <div class="font-semibold text-theme-primary">Ajouter une entrée</div>
                  <div class="text-sm text-theme-muted">Compléter le journal</div>
                </div>
              </div>
            </button>

            <button
              @click="showQuickMood = true"
              class="card p-6 hover:scale-105 transition-transform cursor-pointer group"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span class="text-lg">😊</span>
                </div>
                <div class="text-left">
                  <div class="font-semibold text-theme-primary">Humeur rapide</div>
                  <div class="text-sm text-theme-muted">Comment vous sentez-vous ?</div>
                </div>
              </div>
            </button>

            <button
              @click="showQuickActivity = true"
              class="card p-6 hover:scale-105 transition-transform cursor-pointer group"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span class="text-lg">⚡</span>
                </div>
                <div class="text-left">
                  <div class="font-semibold text-theme-primary">Activité rapide</div>
                  <div class="text-sm text-theme-muted">Ajouter du sport</div>
                </div>
              </div>
            </button>

            <button
              @click="currentView = 'analytics'"
              class="card p-6 hover:scale-105 transition-transform cursor-pointer group"
            >
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span class="text-lg">📊</span>
                </div>
                <div class="text-left">
                  <div class="font-semibold text-theme-primary">Voir les stats</div>
                  <div class="text-sm text-theme-muted">Analyse des données</div>
                </div>
              </div>
            </button>
          </div>

          <!-- Progression de la semaine -->
          <div class="card p-6">
            <h3 class="text-xl font-semibold text-theme-primary mb-6">Progression de la semaine</h3>
            <div class="grid grid-cols-7 gap-2">
              <div v-for="(day, index) in journalStore.getWeekEntries" :key="index" class="text-center">
                <div class="text-xs text-theme-muted mb-2">
                  {{ day.dayName }}
                </div>
                <div class="w-8 h-8 mx-auto rounded-lg flex items-center justify-center text-xs font-bold"
                     :class="day.data ? 'bg-emerald-500 text-white' : 'bg-theme-secondary text-theme-muted'">
                  {{ day.progress }}%
                </div>
                <div class="text-xs text-theme-muted mt-1">
                  {{ day.dayNumber }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Journal -->
        <JournalEntry v-if="currentView === 'journal'" />

        <!-- Historique -->
        <HistoryCalendar v-if="currentView === 'history'" />

        <!-- Analytics -->
        <Analytics v-if="currentView === 'analytics'" />
      </main>

      <!-- Modal humeur rapide -->
      <div v-if="showQuickMood" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-theme-primary p-6 rounded-lg w-full max-w-md mx-4">
          <h4 class="text-lg font-semibold text-theme-primary mb-4 text-center">Comment vous sentez-vous ?</h4>
          <div class="grid grid-cols-5 gap-3 mb-6">
            <button
              v-for="mood in quickMoods"
              :key="mood.score"
              @click="addQuickMood(mood)"
              class="p-4 text-center rounded-lg border-2 border-transparent hover:border-emerald-500 transition-colors"
            >
              <div class="text-3xl mb-2">{{ mood.emoji }}</div>
              <div class="text-xs text-theme-muted">{{ mood.score }}/10</div>
            </button>
          </div>
          <div class="flex space-x-3">
            <button @click="showQuickMood = false" class="btn-ghost flex-1">Annuler</button>
          </div>
        </div>
      </div>

      <!-- Modal activité rapide -->
      <div v-if="showQuickActivity" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-theme-primary p-6 rounded-lg w-full max-w-md mx-4">
          <h4 class="text-lg font-semibold text-theme-primary mb-4 text-center">Ajouter une activité</h4>
          <div class="grid grid-cols-2 gap-3 mb-6">
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useThemeStore } from '@/stores/theme'
import { useJournalStore } from '@/stores/journal'
import ThemeToggle from '@/components/ui/ThemeToggle.vue'
import JournalEntry from '@/components/JournalEntry.vue'
import HistoryCalendar from '@/components/HistoryCalendar.vue'
import Analytics from '@/components/Analytics.vue'

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

const mobileViews = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    iconPath: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 1v6m8-6v6'
  },
  {
    id: 'journal',
    name: 'Journal',
    iconPath: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
  },
  {
    id: 'history',
    name: 'Historique',
    iconPath: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
  },
  {
    id: 'analytics',
    name: 'Analytics',
    iconPath: 'M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
  }
]

// Fonctions calculées
const getGreetingMessage = () => {
  const hour = new Date().getHours()
  const progress = journalStore.getTodayProgress?.overall || 0
  
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
    return `${timeGreeting} ! Journal complet aujourd'hui, félicitations !`
  }
}

// Fonctions d'actions
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

const addQuickMood = (mood) => {
  const today = journalStore.formatDate()
  journalStore.updateEntry(today, 'mood', {
    score: mood.score,
    emoji: mood.emoji,
    tags: [],
    notes: `Ajouté rapidement à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`
  })
  showQuickMood.value = false
}

const addQuickActivity = (activity) => {
  const today = journalStore.formatDate()
  journalStore.addActivity(today, {
    type: activity.type,
    duration: activity.defaultDuration,
    intensity: 'Modérée',
    calories: activity.defaultDuration * 5, // Estimation simple
    notes: 'Ajouté rapidement'
  })
  showQuickActivity.value = false
}

// Charger les données au démarrage
onMounted(() => {
  if (authStore.isAuthenticated) {
    journalStore.loadFromStorage(authStore.userId)
  }
})
</script>
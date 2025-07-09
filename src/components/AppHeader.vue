<!-- Header de l'application avec logo amélioré -->
<template>
  <header class="bg-theme-secondary border-b border-theme p-4 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto flex justify-between items-center">
      <div class="flex items-center space-x-6">
        <!-- Logo amélioré -->
        <div class="flex items-center space-x-3">
          <div class="relative">
            <!-- Icône du cœur avec gradient -->
            <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <!-- Petit indicateur de progression -->
            <div class="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full border-2 border-white"></div>
          </div>
          
          <!-- Titre avec gradient -->
          <div class="flex flex-col">
            <h1 class="text-xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
              Journal de Santé
            </h1>
            <p class="text-xs text-theme-muted">Votre bien-être quotidien</p>
          </div>
        </div>
        
        <!-- Navigation -->
        <nav class="hidden md:flex space-x-6">
          <button 
            @click="$emit('navigate', 'dashboard')"
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
            @click="$emit('navigate', 'journal')"
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
            @click="$emit('navigate', 'history')"
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
            @click="$emit('navigate', 'analytics')"
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
        <div v-if="todayProgress" class="hidden sm:flex items-center space-x-2 text-sm">
          <div class="w-16 h-2 bg-theme-card rounded-full overflow-hidden">
            <div 
              class="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500"
              :style="{ width: `${todayProgress}%` }"
            ></div>
          </div>
          <span class="text-theme-muted">{{ todayProgress }}% aujourd'hui</span>
        </div>

        <!-- Toggle thème -->
        <ThemeToggle />
        
        <!-- Profil utilisateur -->
        <div class="flex items-center space-x-3">
          <div class="hidden sm:block text-right">
            <div class="text-sm font-medium text-theme-primary">{{ userName }}</div>
            <div class="text-xs text-theme-muted">{{ connectionStatus }}</div>
          </div>
          
          <!-- Avatar -->
          <div class="relative">
            <img 
              v-if="userAvatar"
              :src="userAvatar" 
              :alt="userName"
              class="w-8 h-8 rounded-full border-2 border-emerald-200"
            />
            <div 
              v-else
              class="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-medium text-sm"
            >
              {{ userInitials }}
            </div>
            <!-- Indicateur de connexion -->
            <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          
          <!-- Menu utilisateur -->
          <button 
            @click="$emit('toggle-user-menu')"
            class="text-theme-secondary hover:text-theme-primary transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
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
        @click="$emit('navigate', view.id)"
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
</template>

<script setup>
import { computed, defineEmits } from 'vue'
import ThemeToggle from './ui/ThemeToggle.vue'

const props = defineProps({
  currentView: {
    type: String,
    default: 'dashboard'
  },
  userName: {
    type: String,
    default: 'Utilisateur'
  },
  userAvatar: {
    type: String,
    default: ''
  },
  connectionStatus: {
    type: String,
    default: 'Connecté'
  },
  todayProgress: {
    type: Number,
    default: 0
  }
})

defineEmits(['navigate', 'toggle-user-menu'])

const userInitials = computed(() => {
  return props.userName
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

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
</script>
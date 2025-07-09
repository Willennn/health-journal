<template>
  <div class="space-y-6">
    <!-- Header avec statistiques générales -->
    <div class="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold mb-2">🏆 Centre de récompenses</h2>
          <p class="opacity-90">Débloquez des badges en maintenant vos habitudes</p>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold">{{ journalStore.achievements.totalPoints }}</div>
          <div class="text-sm opacity-75">Points totaux</div>
        </div>
      </div>
    </div>

    <!-- Progression niveau -->
    <div class="card p-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-lg font-semibold text-theme-primary">Niveau {{ currentLevel }}</h3>
          <p class="text-sm text-theme-muted">{{ currentLevelName }}</p>
        </div>
        <div class="text-right">
          <div class="text-sm text-theme-muted">{{ pointsToNextLevel }} points pour le prochain niveau</div>
        </div>
      </div>
      
      <!-- Barre de progression -->
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
        <div 
          class="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
          :style="{ width: `${levelProgress}%` }"
        ></div>
      </div>
      <div class="text-xs text-theme-muted">
        {{ currentLevelPoints }}/{{ nextLevelPoints }} points
      </div>
    </div>

    <!-- Filtres -->
    <div class="flex flex-wrap gap-2 mb-6">
      <button
        v-for="filter in filters"
        :key="filter.value"
        @click="selectedFilter = filter.value"
        :class="[
          'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
          selectedFilter === filter.value
            ? 'bg-purple-500 text-white'
            : 'bg-theme-secondary text-theme-secondary hover:bg-purple-100 dark:hover:bg-purple-900/20'
        ]"
      >
        {{ filter.icon }} {{ filter.label }}
      </button>
    </div>

    <!-- Badges récents (si il y en a) -->
    <div v-if="recentBadges.length > 0" class="card p-6">
      <h3 class="text-lg font-semibold text-theme-primary mb-4 flex items-center">
        <span class="mr-2">🎉</span>
        Badges récemment obtenus
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          v-for="badge in recentBadges"
          :key="badge.id"
          class="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg border-2 border-yellow-200 dark:border-yellow-800"
        >
          <div class="text-3xl mb-2">{{ badge.icon }}</div>
          <div class="font-medium text-theme-primary text-sm">{{ badge.name }}</div>
          <div class="text-xs text-theme-muted mt-1">{{ badge.dateEarned }}</div>
        </div>
      </div>
    </div>

    <!-- Grille des badges -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="badge in filteredBadges"
        :key="badge.id"
        :class="[
          'card p-6 transition-all duration-300 cursor-pointer hover:shadow-lg',
          badge.earned 
            ? 'bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 border border-emerald-200 dark:border-emerald-800' 
            : 'opacity-75 hover:opacity-100'
        ]"
        @click="showBadgeDetail(badge)"
      >
        <!-- Header du badge -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-center space-x-3">
            <div 
              :class="[
                'text-4xl transition-all duration-300',
                badge.earned ? 'scale-110' : 'filter grayscale opacity-60'
              ]"
            >
              {{ badge.icon }}
            </div>
            <div>
              <h3 
                :class="[
                  'font-semibold',
                  badge.earned ? 'text-emerald-600 dark:text-emerald-400' : 'text-theme-secondary'
                ]"
              >
                {{ badge.name }}
              </h3>
              <p class="text-sm text-theme-muted">{{ badge.category }}</p>
            </div>
          </div>
          
          <!-- Points et statut -->
          <div class="text-right">
            <div 
              :class="[
                'text-lg font-bold',
                badge.earned ? 'text-emerald-600' : 'text-theme-muted'
              ]"
            >
              +{{ badge.points }}
            </div>
            <div class="text-xs text-theme-muted">points</div>
          </div>
        </div>

        <!-- Description -->
        <p class="text-sm text-theme-secondary mb-4">{{ badge.description }}</p>

        <!-- Progression ou date d'obtention -->
        <div v-if="badge.earned" class="flex items-center justify-between text-sm">
          <span class="text-emerald-600 dark:text-emerald-400 font-medium">
            ✓ Obtenu
          </span>
          <span class="text-theme-muted">{{ badge.dateEarned }}</span>
        </div>
        
        <div v-else-if="badge.progress !== undefined" class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-theme-muted">Progression</span>
            <span class="text-theme-primary font-medium">
              {{ badge.currentValue }}/{{ badge.targetValue }}
            </span>
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              class="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${Math.min(badge.progress, 100)}%` }"
            ></div>
          </div>
        </div>

        <div v-else class="text-sm text-theme-muted">
          Commencez votre parcours pour débloquer ce badge
        </div>
      </div>
    </div>

    <!-- Section suggestions -->
    <div v-if="suggestions.length > 0" class="card p-6">
      <h3 class="text-lg font-semibold text-theme-primary mb-4 flex items-center">
        <span class="mr-2">💡</span>
        Suggestions pour progresser
      </h3>
      <div class="space-y-3">
        <div
          v-for="suggestion in suggestions"
          :key="suggestion.id"
          class="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg"
        >
          <div class="text-2xl">{{ suggestion.icon }}</div>
          <div class="flex-1">
            <h4 class="font-medium text-theme-primary">{{ suggestion.title }}</h4>
            <p class="text-sm text-theme-muted mt-1">{{ suggestion.description }}</p>
            <div v-if="suggestion.reward" class="text-xs text-purple-600 dark:text-purple-400 mt-2">
              Récompense : {{ suggestion.reward }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal détail badge -->
    <div 
      v-if="selectedBadge" 
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click="selectedBadge = null"
    >
      <div 
        class="bg-theme-card rounded-xl p-6 max-w-md w-full"
        @click.stop
      >
        <div class="text-center mb-6">
          <div 
            :class="[
              'text-6xl mb-4 inline-block transition-all duration-300',
              selectedBadge.earned ? 'animate-bounce' : 'filter grayscale'
            ]"
          >
            {{ selectedBadge.icon }}
          </div>
          <h3 class="text-xl font-bold text-theme-primary mb-2">{{ selectedBadge.name }}</h3>
          <p class="text-theme-muted">{{ selectedBadge.description }}</p>
        </div>

        <div class="space-y-4">
          <div class="flex justify-between items-center p-3 bg-theme-secondary rounded-lg">
            <span class="text-theme-muted">Catégorie</span>
            <span class="text-theme-primary font-medium">{{ selectedBadge.category }}</span>
          </div>
          
          <div class="flex justify-between items-center p-3 bg-theme-secondary rounded-lg">
            <span class="text-theme-muted">Points</span>
            <span class="text-purple-600 font-bold">+{{ selectedBadge.points }}</span>
          </div>

          <div v-if="selectedBadge.earned" class="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
            <div class="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
              <span>✓</span>
              <span class="font-medium">Badge obtenu le {{ selectedBadge.dateEarned }}</span>
            </div>
          </div>

          <div v-else-if="selectedBadge.progress !== undefined" class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-theme-muted">Progression actuelle</span>
              <span class="text-theme-primary font-medium">
                {{ selectedBadge.currentValue }}/{{ selectedBadge.targetValue }}
              </span>
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
              <div 
                class="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                :style="{ width: `${Math.min(selectedBadge.progress, 100)}%` }"
              ></div>
            </div>
            <p class="text-xs text-theme-muted">
              {{ selectedBadge.hint || 'Continuez vos efforts pour débloquer ce badge !' }}
            </p>
          </div>
        </div>

        <button 
          @click="selectedBadge = null"
          class="w-full mt-6 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useJournalStore } from '@/stores/journal'

const journalStore = useJournalStore()
const selectedFilter = ref('all')
const selectedBadge = ref(null)

// Filtres disponibles
const filters = [
  { value: 'all', label: 'Tous', icon: '🎯' },
  { value: 'streaks', label: 'Régularité', icon: '🔥' },
  { value: 'wellness', label: 'Bien-être', icon: '💪' },
  { value: 'social', label: 'Social', icon: '🤝' },
  { value: 'achievements', label: 'Exploits', icon: '🏆' },
  { value: 'special', label: 'Spéciaux', icon: '⭐' }
]

// Système de niveaux
const levels = [
  { level: 1, name: "Débutant", minPoints: 0, maxPoints: 100 },
  { level: 2, name: "Apprenti", minPoints: 100, maxPoints: 250 },
  { level: 3, name: "Habitué", minPoints: 250, maxPoints: 500 },
  { level: 4, name: "Expert", minPoints: 500, maxPoints: 1000 },
  { level: 5, name: "Maître", minPoints: 1000, maxPoints: 2000 },
  { level: 6, name: "Légende", minPoints: 2000, maxPoints: 5000 },
  { level: 7, name: "Champion", minPoints: 5000, maxPoints: 10000 },
  { level: 8, name: "Grand Maître", minPoints: 10000, maxPoints: Infinity }
]

// Définition complète des badges
const badgeDefinitions = [
  // Badges de régularité
  {
    id: 'first_entry',
    name: 'Premier pas',
    description: 'Créez votre première entrée dans le journal',
    icon: '🌱',
    category: 'Régularité',
    points: 10,
    type: 'streaks'
  },
  {
    id: 'week_streak',
    name: 'Une semaine',
    description: 'Maintenez une série de 7 jours consécutifs',
    icon: '🔥',
    category: 'Régularité',
    points: 50,
    type: 'streaks'
  },
  {
    id: 'month_streak',
    name: 'Un mois complet',
    description: 'Maintenez une série de 30 jours consécutifs',
    icon: '📅',
    category: 'Régularité',
    points: 200,
    type: 'streaks'
  },
  {
    id: 'hundred_days',
    name: 'Centenaire',
    description: 'Atteignez 100 jours consécutifs',
    icon: '💯',
    category: 'Régularité',
    points: 500,
    type: 'streaks'
  },
  {
    id: 'year_streak',
    name: 'Une année entière',
    description: 'Maintenez une série de 365 jours',
    icon: '🏆',
    category: 'Régularité',
    points: 1000,
    type: 'streaks'
  },

  // Badges de bien-être
  {
    id: 'early_bird',
    name: 'Lève-tôt',
    description: 'Levez-vous avant 7h pendant 7 jours',
    icon: '🌅',
    category: 'Bien-être',
    points: 75,
    type: 'wellness'
  },
  {
    id: 'sleep_master',
    name: 'Maître du sommeil',
    description: 'Dormez 8h+ pendant 14 jours consécutifs',
    icon: '😴',
    category: 'Bien-être',
    points: 100,
    type: 'wellness'
  },
  {
    id: 'mood_booster',
    name: 'Optimiste',
    description: 'Maintenez une humeur ≥8 pendant 7 jours',
    icon: '😊',
    category: 'Bien-être',
    points: 75,
    type: 'wellness'
  },
  {
    id: 'athlete',
    name: 'Athlète',
    description: 'Faites 60+ minutes d\'activité pendant 7 jours',
    icon: '🏃',
    category: 'Bien-être',
    points: 150,
    type: 'wellness'
  },
  {
    id: 'zen_master',
    name: 'Maître zen',
    description: 'Méditez 10 jours dans le mois',
    icon: '🧘',
    category: 'Bien-être',
    points: 100,
    type: 'wellness'
  },

  // Badges d'accomplissements
  {
    id: 'completionist',
    name: 'Perfectionniste',
    description: 'Complétez 100% de vos données 30 jours',
    icon: '✅',
    category: 'Exploits',
    points: 200,
    type: 'achievements'
  },
  {
    id: 'data_lover',
    name: 'Analyste',
    description: 'Exportez vos données 5 fois',
    icon: '📊',
    category: 'Exploits',
    points: 50,
    type: 'achievements'
  },
  {
    id: 'goal_crusher',
    name: 'Briseur d\'objectifs',
    description: 'Atteignez tous vos objectifs 14 jours de suite',
    icon: '🎯',
    category: 'Exploits',
    points: 250,
    type: 'achievements'
  },

  // Badges spéciaux
  {
    id: 'night_owl',
    name: 'Oiseau de nuit',
    description: 'Couchez-vous après minuit 5 jours de suite',
    icon: '🦉',
    category: 'Spéciaux',
    points: 25,
    type: 'special'
  },
  {
    id: 'weather_warrior',
    name: 'Guerrier du temps',
    description: 'Restez actif malgré la météo',
    icon: '⛈️',
    category: 'Spéciaux',
    points: 100,
    type: 'special'
  },
  {
    id: 'weekend_warrior',
    name: 'Guerrier du week-end',
    description: 'Maintenez vos habitudes le week-end',
    icon: '⚡',
    category: 'Spéciaux',
    points: 75,
    type: 'special'
  }
]

// Calculs des niveaux
const currentLevel = computed(() => {
  const points = journalStore.achievements.totalPoints
  return levels.find(level => points >= level.minPoints && points < level.maxPoints)?.level || 1
})

const currentLevelName = computed(() => {
  return levels.find(level => level.level === currentLevel.value)?.name || 'Débutant'
})

const currentLevelPoints = computed(() => {
  const currentLevelData = levels.find(level => level.level === currentLevel.value)
  return journalStore.achievements.totalPoints - currentLevelData.minPoints
})

const nextLevelPoints = computed(() => {
  const currentLevelData = levels.find(level => level.level === currentLevel.value)
  const nextLevelData = levels.find(level => level.level === currentLevel.value + 1)
  return nextLevelData ? nextLevelData.minPoints - currentLevelData.minPoints : 0
})

const levelProgress = computed(() => {
  if (nextLevelPoints.value === 0) return 100
  return (currentLevelPoints.value / nextLevelPoints.value) * 100
})

const pointsToNextLevel = computed(() => {
  const nextLevelData = levels.find(level => level.level === currentLevel.value + 1)
  return nextLevelData ? nextLevelData.minPoints - journalStore.achievements.totalPoints : 0
})

// Badges avec progression calculée
const allBadges = computed(() => {
  return badgeDefinitions.map(badge => {
    const earned = journalStore.achievements.badges.includes(badge.id)
    const progress = calculateBadgeProgress(badge)
    
    return {
      ...badge,
      earned,
      dateEarned: earned ? getDateEarned(badge.id) : null,
      progress: progress.percentage,
      currentValue: progress.current,
      targetValue: progress.target,
      hint: progress.hint
    }
  })
})

// Badges filtrés
const filteredBadges = computed(() => {
  if (selectedFilter.value === 'all') return allBadges.value
  return allBadges.value.filter(badge => badge.type === selectedFilter.value)
})

// Badges récents (derniers 7 jours)
const recentBadges = computed(() => {
  return allBadges.value
    .filter(badge => badge.earned && badge.dateEarned)
    .filter(badge => {
      const earnedDate = new Date(badge.dateEarned)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return earnedDate >= weekAgo
    })
    .slice(0, 4)
})

// Suggestions intelligentes
const suggestions = computed(() => {
  const suggestions = []
  const entries = Object.values(journalStore.entries)
  const currentStreak = journalStore.getCurrentStreak
  
  // Suggestion basée sur la série actuelle
  if (currentStreak === 0) {
    suggestions.push({
      id: 'start_streak',
      title: 'Commencez votre série',
      description: 'Remplissez votre journal aujourd\'hui pour commencer une nouvelle série !',
      icon: '🌟',
      reward: '+10 points pour le premier jour'
    })
  } else if (currentStreak < 7) {
    suggestions.push({
      id: 'week_streak_progress',
      title: `Plus que ${7 - currentStreak} jours pour une semaine`,
      description: 'Continuez votre série pour débloquer le badge "Une semaine"',
      icon: '🔥',
      reward: '+50 points'
    })
  }

  // Suggestion basée sur l'activité
  const recentActivity = entries.slice(-7).reduce((total, entry) => {
    return total + (entry.activity?.reduce((sum, act) => sum + act.duration, 0) || 0)
  }, 0)
  
  if (recentActivity < 150) { // Moins de 150min en 7 jours
    suggestions.push({
      id: 'more_activity',
      title: 'Bougez plus !',
      description: 'Ajoutez 30 minutes d\'activité aujourd\'hui pour améliorer votre bien-être',
      icon: '🏃',
      reward: 'Progression vers le badge "Athlète"'
    })
  }

  // Suggestion basée sur l'humeur
  const recentMoods = entries.slice(-7)
    .map(entry => entry.mood?.score || 0)
    .filter(score => score > 0)
  
  if (recentMoods.length > 0 && recentMoods.reduce((a, b) => a + b) / recentMoods.length < 6) {
    suggestions.push({
      id: 'improve_mood',
      title: 'Prenez soin de votre moral',
      description: 'Essayez une activité relaxante ou sociale pour booster votre humeur',
      icon: '😊',
      reward: 'Progression vers le badge "Optimiste"'
    })
  }

  return suggestions.slice(0, 3) // Maximum 3 suggestions
})

// Fonctions utilitaires
function calculateBadgeProgress(badge) {
  const entries = Object.values(journalStore.entries)
  const currentStreak = journalStore.getCurrentStreak
  
  switch (badge.id) {
    case 'first_entry':
      return {
        percentage: entries.length > 0 ? 100 : 0,
        current: entries.length > 0 ? 1 : 0,
        target: 1,
        hint: 'Créez votre première entrée'
      }
    
    case 'week_streak':
      return {
        percentage: Math.min((currentStreak / 7) * 100, 100),
        current: Math.min(currentStreak, 7),
        target: 7,
        hint: `${Math.max(0, 7 - currentStreak)} jours restants`
      }
    
    case 'month_streak':
      return {
        percentage: Math.min((currentStreak / 30) * 100, 100),
        current: Math.min(currentStreak, 30),
        target: 30,
        hint: `${Math.max(0, 30 - currentStreak)} jours restants`
      }
    
    case 'hundred_days':
      return {
        percentage: Math.min((currentStreak / 100) * 100, 100),
        current: Math.min(currentStreak, 100),
        target: 100,
        hint: `${Math.max(0, 100 - currentStreak)} jours restants`
      }
    
    default:
      return {
        percentage: 0,
        current: 0,
        target: 1,
        hint: 'Continuez vos efforts !'
      }
  }
}

function getDateEarned(badgeId) {
  // Simulation - dans un vrai projet, ceci serait stocké
  return new Date().toLocaleDateString('fr-FR')
}

function showBadgeDetail(badge) {
  selectedBadge.value = badge
}

onMounted(() => {
  // Charger les données si nécessaire
  if (Object.keys(journalStore.entries).length === 0) {
    const authStore = JSON.parse(localStorage.getItem('health_journal_user') || '{}')
    if (authStore.id) {
      journalStore.loadFromStorage(authStore.id)
    }
  }
})
</script>
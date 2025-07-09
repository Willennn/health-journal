<template>
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-3xl font-bold text-theme-primary">Historique</h2>
        <p class="text-theme-secondary mt-2">Visualisez vos données de santé</p>
      </div>
      
      <!-- Filtres de vue -->
      <div class="flex items-center space-x-4">
        <div class="flex bg-theme-secondary p-1 rounded-lg">
          <button
            v-for="view in views"
            :key="view.id"
            @click="currentView = view.id"
            :class="[
              'px-4 py-2 rounded-md text-sm font-medium transition-all',
              currentView === view.id 
                ? 'bg-theme-primary text-theme-primary shadow-sm' 
                : 'text-theme-muted hover:text-theme-secondary'
            ]"
          >
            {{ view.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- Vue Calendrier -->
    <div v-if="currentView === 'calendar'" class="card p-6">
      <!-- Navigation du mois -->
      <div class="flex items-center justify-between mb-6">
        <button 
          @click="changeMonth(-1)"
          class="p-2 rounded-lg bg-theme-secondary hover:bg-theme-card transition-colors"
        >
          <svg class="w-5 h-5 text-theme-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <h3 class="text-xl font-semibold text-theme-primary">
          {{ formatMonthYear(currentMonth) }}
        </h3>
        
        <button 
          @click="changeMonth(1)"
          :disabled="isCurrentMonth"
          :class="[
            'p-2 rounded-lg transition-colors',
            isCurrentMonth ? 'bg-gray-200 cursor-not-allowed' : 'bg-theme-secondary hover:bg-theme-card'
          ]"
        >
          <svg class="w-5 h-5 text-theme-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- Grille du calendrier -->
      <div class="grid grid-cols-7 gap-1 mb-4">
        <!-- Jours de la semaine -->
        <div 
          v-for="day in dayNames" 
          :key="day"
          class="p-3 text-center text-sm font-medium text-theme-muted"
        >
          {{ day }}
        </div>
        
        <!-- Cases du calendrier -->
        <div 
          v-for="date in calendarDays" 
          :key="date.dateString"
          @click="selectDate(date)"
          :class="[
            'p-2 cursor-pointer rounded-lg transition-all min-h-[80px] border',
            getDateClass(date)
          ]"
        >
          <!-- Numéro du jour -->
          <div class="flex items-center justify-between mb-1">
            <span :class="[
              'text-sm font-medium',
              date.isCurrentMonth ? 'text-theme-primary' : 'text-theme-muted'
            ]">
              {{ date.day }}
            </span>
            
            <!-- Indicateur de données -->
            <div v-if="date.hasData" class="flex space-x-1">
              <div v-if="date.entry?.sleep?.bedTime" class="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div v-if="date.entry?.mood?.score > 0" class="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div v-if="date.entry?.activity?.length > 0" class="w-2 h-2 bg-green-500 rounded-full"></div>
              <div v-if="date.entry?.food?.length > 0" class="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </div>
          
          <!-- Score de progression -->
          <div v-if="date.hasData" class="text-center">
            <div class="text-xs text-theme-muted mb-1">{{ date.completionScore }}%</div>
            <div 
              :class="[
                'h-1 rounded-full',
                getProgressBarClass(date.completionScore)
              ]"
            ></div>
          </div>
        </div>
      </div>

      <!-- Légende -->
      <div class="border-t border-theme pt-4">
        <h4 class="text-sm font-medium text-theme-primary mb-3">Légende</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span class="text-theme-secondary">Sommeil</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span class="text-theme-secondary">Humeur</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-green-500 rounded-full"></div>
            <span class="text-theme-secondary">Activité</span>
          </div>
          <div class="flex items-center space-x-2">
            <div class="w-3 h-3 bg-red-500 rounded-full"></div>
            <span class="text-theme-secondary">Alimentation</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Vue Liste -->
    <div v-if="currentView === 'list'" class="space-y-4">
      <div 
        v-for="entry in recentEntries" 
        :key="entry.date"
        class="card p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <div>
            <h3 class="text-lg font-semibold text-theme-primary">
              {{ formatDateLong(entry.date) }}
            </h3>
            <p class="text-sm text-theme-muted">
              {{ getDaysAgo(entry.date) }}
            </p>
          </div>
          
          <!-- Score global -->
          <div class="text-center">
            <div class="text-2xl font-bold text-theme-primary">{{ entry.completionScore }}%</div>
            <div class="text-xs text-theme-muted">Complété</div>
          </div>
        </div>

        <!-- Résumé des données -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <!-- Sommeil -->
          <div class="text-center p-3 bg-theme-secondary rounded-lg">
            <div class="text-lg mb-1">😴</div>
            <div class="text-sm font-medium text-theme-primary">
              {{ getSleepSummary(entry.data) }}
            </div>
            <div class="text-xs text-theme-muted">Sommeil</div>
          </div>

          <!-- Humeur -->
          <div class="text-center p-3 bg-theme-secondary rounded-lg">
            <div class="text-lg mb-1">{{ entry.data.mood?.emoji || '😐' }}</div>
            <div class="text-sm font-medium text-theme-primary">
              {{ entry.data.mood?.score || 0 }}/10
            </div>
            <div class="text-xs text-theme-muted">Humeur</div>
          </div>

          <!-- Activité -->
          <div class="text-center p-3 bg-theme-secondary rounded-lg">
            <div class="text-lg mb-1">🏃</div>
            <div class="text-sm font-medium text-theme-primary">
              {{ getTotalActivityMinutes(entry.data) }}min
            </div>
            <div class="text-xs text-theme-muted">Activité</div>
          </div>

          <!-- Alimentation -->
          <div class="text-center p-3 bg-theme-secondary rounded-lg">
            <div class="text-lg mb-1">🍎</div>
            <div class="text-sm font-medium text-theme-primary">
              {{ entry.data.food?.length || 0 }} repas
            </div>
            <div class="text-xs text-theme-muted">Alimentation</div>
          </div>
        </div>

        <!-- Tags d'humeur -->
        <div v-if="entry.data.mood?.tags?.length > 0" class="mt-4">
          <div class="text-xs text-theme-muted mb-2">Ressentis :</div>
          <div class="flex flex-wrap gap-1">
            <span 
              v-for="tag in entry.data.mood.tags" 
              :key="tag"
              class="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-xs"
            >
              {{ tag }}
            </span>
          </div>
        </div>
      </div>

      <!-- Message si aucune donnée -->
      <div v-if="recentEntries.length === 0" class="text-center py-12">
        <div class="text-6xl mb-4">📊</div>
        <h3 class="text-lg font-medium text-theme-primary mb-2">Aucune donnée disponible</h3>
        <p class="text-theme-muted">Commencez à remplir votre journal pour voir votre historique</p>
      </div>
    </div>

    <!-- Vue Statistiques -->
    <div v-if="currentView === 'stats'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Streak actuel -->
      <div class="card p-6 text-center">
        <div class="text-4xl mb-4">🔥</div>
        <div class="text-3xl font-bold text-theme-primary mb-2">
          {{ journalStore.getCurrentStreak }}
        </div>
        <div class="text-sm text-theme-muted">Jours consécutifs</div>
        <div class="text-xs text-theme-secondary mt-1">
          Record : {{ journalStore.achievements.streaks.best }}
        </div>
      </div>

      <!-- Total d'entrées -->
      <div class="card p-6 text-center">
        <div class="text-4xl mb-4">📝</div>
        <div class="text-3xl font-bold text-theme-primary mb-2">
          {{ totalEntries }}
        </div>
        <div class="text-sm text-theme-muted">Jours enregistrés</div>
      </div>

      <!-- Humeur moyenne -->
      <div class="card p-6 text-center">
        <div class="text-4xl mb-4">😊</div>
        <div class="text-3xl font-bold text-theme-primary mb-2">
          {{ averageMood.toFixed(1) }}/10
        </div>
        <div class="text-sm text-theme-muted">Humeur moyenne</div>
      </div>

      <!-- Sommeil moyen -->
      <div class="card p-6 text-center">
        <div class="text-4xl mb-4">😴</div>
        <div class="text-3xl font-bold text-theme-primary mb-2">
          {{ averageSleep.toFixed(1) }}h
        </div>
        <div class="text-sm text-theme-muted">Sommeil moyen</div>
      </div>

      <!-- Activité totale -->
      <div class="card p-6 text-center">
        <div class="text-4xl mb-4">🏃</div>
        <div class="text-3xl font-bold text-theme-primary mb-2">
          {{ totalActivity }}min
        </div>
        <div class="text-sm text-theme-muted">Activité totale</div>
      </div>

      <!-- Points totaux -->
      <div class="card p-6 text-center">
        <div class="text-4xl mb-4">⭐</div>
        <div class="text-3xl font-bold text-theme-primary mb-2">
          {{ journalStore.achievements.totalPoints }}
        </div>
        <div class="text-sm text-theme-muted">Points obtenus</div>
      </div>
    </div>

    <!-- Modal détail de journée -->
    <div v-if="selectedDateDetail" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" @click="selectedDateDetail = null">
      <div class="bg-theme-card rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto" @click.stop>
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-semibold text-theme-primary">
            {{ formatDateLong(selectedDateDetail.date) }}
          </h3>
          <button @click="selectedDateDetail = null" class="text-theme-muted hover:text-theme-primary">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="selectedDateDetail.data" class="space-y-6">
          <!-- Sommeil -->
          <div v-if="selectedDateDetail.data.sleep?.bedTime" class="border-b border-theme pb-4">
            <h4 class="font-medium text-theme-primary mb-2 flex items-center">
              <span class="mr-2">😴</span> Sommeil
            </h4>
            <div class="text-sm text-theme-secondary space-y-1">
              <p>Coucher : {{ selectedDateDetail.data.sleep.bedTime }}</p>
              <p>Lever : {{ selectedDateDetail.data.sleep.wakeTime }}</p>
              <p>Qualité : {{ selectedDateDetail.data.sleep.quality }}/10</p>
              <p v-if="selectedDateDetail.data.sleep.notes">Notes : {{ selectedDateDetail.data.sleep.notes }}</p>
            </div>
          </div>

          <!-- Humeur -->
          <div v-if="selectedDateDetail.data.mood?.score > 0" class="border-b border-theme pb-4">
            <h4 class="font-medium text-theme-primary mb-2 flex items-center">
              <span class="mr-2">{{ selectedDateDetail.data.mood.emoji }}</span> Humeur
            </h4>
            <div class="text-sm text-theme-secondary space-y-1">
              <p>Score : {{ selectedDateDetail.data.mood.score }}/10</p>
              <div v-if="selectedDateDetail.data.mood.tags?.length > 0">
                <p>Ressentis :</p>
                <div class="flex flex-wrap gap-1 mt-1">
                  <span 
                    v-for="tag in selectedDateDetail.data.mood.tags" 
                    :key="tag"
                    class="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded text-xs"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>
              <p v-if="selectedDateDetail.data.mood.notes">Notes : {{ selectedDateDetail.data.mood.notes }}</p>
            </div>
          </div>

          <!-- Activité -->
          <div v-if="selectedDateDetail.data.activity?.length > 0" class="border-b border-theme pb-4">
            <h4 class="font-medium text-theme-primary mb-2 flex items-center">
              <span class="mr-2">🏃</span> Activité
            </h4>
            <div class="space-y-2">
              <div 
                v-for="activity in selectedDateDetail.data.activity" 
                :key="activity.id"
                class="text-sm bg-theme-secondary rounded p-2"
              >
                <div class="font-medium">{{ activity.type }}</div>
                <div class="text-theme-muted">
                  {{ activity.duration }}min • {{ activity.intensity }} • {{ activity.calories || 0 }} cal
                </div>
              </div>
            </div>
          </div>

          <!-- Alimentation -->
          <div v-if="selectedDateDetail.data.food?.length > 0">
            <h4 class="font-medium text-theme-primary mb-2 flex items-center">
              <span class="mr-2">🍎</span> Alimentation
            </h4>
            <div class="space-y-2">
              <div 
                v-for="food in selectedDateDetail.data.food" 
                :key="food.id"
                class="text-sm bg-theme-secondary rounded p-2"
              >
                <div class="font-medium">{{ food.meal }}</div>
                <div class="text-theme-muted">{{ food.description }}</div>
              </div>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8">
          <div class="text-4xl mb-4">📝</div>
          <p class="text-theme-muted">Aucune donnée enregistrée pour cette journée</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useJournalStore } from '@/stores/journal'

const journalStore = useJournalStore()

const currentView = ref('calendar')
const currentMonth = ref(new Date())
const selectedDateDetail = ref(null)

const views = [
  { id: 'calendar', name: 'Calendrier' },
  { id: 'list', name: 'Liste' },
  { id: 'stats', name: 'Statistiques' }
]

const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const isCurrentMonth = computed(() => {
  const now = new Date()
  return currentMonth.value.getFullYear() === now.getFullYear() && 
         currentMonth.value.getMonth() === now.getMonth()
})

const calendarDays = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  
  // Commencer au lundi de la semaine
  const dayOfWeek = (firstDay.getDay() + 6) % 7
  startDate.setDate(startDate.getDate() - dayOfWeek)
  
  const days = []
  const current = new Date(startDate)
  
  // Générer 42 jours (6 semaines)
  for (let i = 0; i < 42; i++) {
    const dateString = journalStore.formatDate(current)
    const entry = journalStore.entries[dateString]
    
    days.push({
      date: new Date(current),
      dateString,
      day: current.getDate(),
      isCurrentMonth: current.getMonth() === month,
      isToday: dateString === journalStore.formatDate(),
      hasData: !!entry,
      entry,
      completionScore: entry ? getCompletionScore(entry) : 0
    })
    
    current.setDate(current.getDate() + 1)
  }
  
  return days
})

const recentEntries = computed(() => {
  const entries = []
  const dates = Object.keys(journalStore.entries).sort().reverse()
  
  for (const date of dates.slice(0, 10)) {
    const entry = journalStore.entries[date]
    entries.push({
      date,
      data: entry,
      completionScore: getCompletionScore(entry)
    })
  }
  
  return entries
})

const totalEntries = computed(() => {
  return Object.keys(journalStore.entries).length
})

const averageMood = computed(() => {
  const moods = Object.values(journalStore.entries)
    .map(entry => entry.mood?.score || 0)
    .filter(score => score > 0)
  
  return moods.length > 0 ? moods.reduce((a, b) => a + b, 0) / moods.length : 0
})

const averageSleep = computed(() => {
  const sleepDurations = Object.values(journalStore.entries)
    .map(entry => journalStore.getSleepDuration(entry))
    .filter(duration => duration > 0)
  
  return sleepDurations.length > 0 ? sleepDurations.reduce((a, b) => a + b, 0) / sleepDurations.length : 0
})

const totalActivity = computed(() => {
  return Object.values(journalStore.entries)
    .reduce((total, entry) => total + journalStore.getTotalActivityMinutes(entry), 0)
})

const formatMonthYear = (date) => {
  return date.toLocaleDateString('fr-FR', { 
    month: 'long', 
    year: 'numeric' 
  })
}

const formatDateLong = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getDaysAgo = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  const diffTime = Math.abs(today - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return "Hier"
  return `Il y a ${diffDays} jours`
}

const changeMonth = (direction) => {
  const newMonth = new Date(currentMonth.value)
  newMonth.setMonth(newMonth.getMonth() + direction)
  currentMonth.value = newMonth
}

const selectDate = (date) => {
  if (date.hasData) {
    selectedDateDetail.value = {
      date: date.dateString,
      data: date.entry
    }
  }
}

const getDateClass = (date) => {
  let classes = []
  
  if (!date.isCurrentMonth) {
    classes.push('text-theme-muted bg-theme-secondary')
  } else {
    classes.push('border-theme hover:border-emerald-300')
  }
  
  if (date.isToday) {
    classes.push('ring-2 ring-emerald-500')
  }
  
  if (date.hasData) {
    classes.push('cursor-pointer hover:bg-theme-secondary')
  }
  
  return classes.join(' ')
}

const getProgressBarClass = (score) => {
  if (score >= 75) return 'bg-green-500'
  if (score >= 50) return 'bg-yellow-500'
  if (score >= 25) return 'bg-orange-500'
  return 'bg-red-500'
}

const getCompletionScore = (entry) => {
  let score = 0
  if (entry.sleep?.bedTime && entry.sleep?.wakeTime) score += 25
  if (entry.mood?.score > 0) score += 25
  if (entry.activity?.length > 0) score += 25
  if (entry.food?.length > 0) score += 25
  return score
}

const getSleepSummary = (entry) => {
  if (!entry.sleep?.bedTime || !entry.sleep?.wakeTime) return 'Non renseigné'
  const duration = journalStore.getSleepDuration(entry)
  return `${duration.toFixed(1)}h`
}

const getTotalActivityMinutes = (entry) => {
  return journalStore.getTotalActivityMinutes(entry)
}

onMounted(() => {
  // Charger les données si pas déjà fait
  if (Object.keys(journalStore.entries).length === 0) {
    const authStore = JSON.parse(localStorage.getItem('health_journal_user') || '{}')
    if (authStore.id) {
      journalStore.loadFromStorage(authStore.id)
    }
  }
})
</script>
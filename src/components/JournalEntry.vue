<template>
  <div class="max-w-4xl mx-auto">
    <!-- Header avec date -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h2 class="text-3xl font-bold text-theme-primary">Journal du jour</h2>
        <p class="text-theme-secondary mt-2">{{ formatDateLong(selectedDate) }}</p>
      </div>
      
      <!-- Sélecteur de date -->
      <div class="flex items-center space-x-4">
        <button 
          @click="changeDate(-1)"
          class="p-2 rounded-lg bg-theme-card hover:bg-theme-secondary transition-colors"
        >
          <svg class="w-5 h-5 text-theme-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <input 
          type="date" 
          v-model="selectedDate"
          class="bg-theme-card border border-theme rounded-lg px-3 py-2 text-theme-primary"
        />
        
        <button 
          @click="changeDate(1)"
          :disabled="isToday"
          :class="[
            'p-2 rounded-lg transition-colors',
            isToday ? 'bg-gray-200 cursor-not-allowed' : 'bg-theme-card hover:bg-theme-secondary'
          ]"
        >
          <svg class="w-5 h-5 text-theme-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Indicateur de sauvegarde -->
    <div v-if="saveStatus" class="mb-4 p-3 rounded-lg flex items-center space-x-2" :class="saveStatusClass">
      <svg v-if="saveStatus === 'saving'" class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      <svg v-else-if="saveStatus === 'saved'" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span class="text-sm">{{ saveStatusText }}</span>
    </div>

    <!-- Onglets -->
    <div class="flex space-x-1 mb-8 bg-theme-secondary p-1 rounded-lg">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'flex-1 px-4 py-3 rounded-md text-sm font-medium transition-all',
          activeTab === tab.id 
            ? 'bg-theme-primary text-theme-primary shadow-sm' 
            : 'text-theme-muted hover:text-theme-secondary'
        ]"
      >
        <span class="mr-2">{{ tab.icon }}</span>
        {{ tab.name }}
        <span v-if="getTabProgress(tab.id)" class="ml-2 w-2 h-2 bg-green-500 rounded-full inline-block"></span>
      </button>
    </div>

    <!-- Contenu des onglets -->
    <div class="animate-fade-in">
      <!-- Onglet Sommeil -->
      <div v-if="activeTab === 'sleep'" class="card p-8">
        <div class="max-w-2xl">
          <h3 class="text-2xl font-semibold text-theme-primary mb-6 flex items-center">
            <span class="mr-3">😴</span>
            Sommeil
          </h3>
          
          <div class="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-theme-secondary mb-2">
                Heure de coucher
              </label>
              <input
                type="time"
                v-model="localEntry.sleep.bedTime"
                @change="saveSleep"
                class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            
            <div>
              <label class="block text-sm font-medium text-theme-secondary mb-2">
                Heure de lever
              </label>
              <input
                type="time"
                v-model="localEntry.sleep.wakeTime"
                @change="saveSleep"
                class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div v-if="sleepDuration > 0" class="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div class="flex items-center text-blue-700 dark:text-blue-300">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="font-medium">Durée de sommeil: {{ sleepDuration.toFixed(1) }}h</span>
            </div>
          </div>
          
          <div class="mb-6">
            <label class="block text-sm font-medium text-theme-secondary mb-3">
              Qualité du sommeil (1-10)
            </label>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-theme-muted">1</span>
              <input
                type="range"
                min="1"
                max="10"
                v-model="localEntry.sleep.quality"
                @change="saveSleep"
                class="flex-1 h-2 bg-theme-secondary rounded-lg appearance-none cursor-pointer"
              />
              <span class="text-sm text-theme-muted">10</span>
              <div class="w-12 text-center">
                <span class="text-lg font-semibold text-theme-primary">{{ localEntry.sleep.quality }}</span>
              </div>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-theme-secondary mb-2">
              Notes sur le sommeil
            </label>
            <textarea
              v-model="localEntry.sleep.notes"
              @blur="saveSleep"
              placeholder="Comment avez-vous dormi ? Rêves, réveils nocturnes, etc."
              rows="3"
              class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Onglet Humeur -->
      <div v-if="activeTab === 'mood'" class="card p-8">
        <div class="max-w-2xl">
          <h3 class="text-2xl font-semibold text-theme-primary mb-6 flex items-center">
            <span class="mr-3">😊</span>
            Humeur
          </h3>
          
          <!-- Sélecteur d'humeur avec emojis -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-theme-secondary mb-4">
              Comment vous sentez-vous aujourd'hui ?
            </label>
            <div class="grid grid-cols-5 gap-3">
              <button
                v-for="mood in moodOptions"
                :key="mood.score"
                @click="selectMood(mood)"
                :class="[
                  'p-4 rounded-xl border-2 transition-all text-center',
                  localEntry.mood.score === mood.score
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                    : 'border-theme hover:border-emerald-300'
                ]"
              >
                <div class="text-3xl mb-2">{{ mood.emoji }}</div>
                <div class="text-xs text-theme-muted">{{ mood.label }}</div>
                <div class="text-sm font-medium text-theme-primary">{{ mood.score }}</div>
              </button>
            </div>
          </div>

          <!-- Tags d'humeur -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-theme-secondary mb-3">
              Ressentis (optionnel)
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="tag in moodTags"
                :key="tag"
                @click="toggleMoodTag(tag)"
                :class="[
                  'px-3 py-1 rounded-full text-sm transition-colors',
                  localEntry.mood.tags.includes(tag)
                    ? 'bg-emerald-500 text-white'
                    : 'bg-theme-secondary text-theme-secondary hover:bg-emerald-100 dark:hover:bg-emerald-900/30'
                ]"
              >
                {{ tag }}
              </button>
            </div>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-theme-secondary mb-2">
              Notes sur l'humeur
            </label>
            <textarea
              v-model="localEntry.mood.notes"
              @blur="saveMood"
              placeholder="Qu'est-ce qui influence votre humeur aujourd'hui ?"
              rows="3"
              class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Onglet Activité -->
      <div v-if="activeTab === 'activity'" class="card p-8">
        <div class="max-w-4xl">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-semibold text-theme-primary flex items-center">
              <span class="mr-3">🏃</span>
              Activité physique
            </h3>
            <button
              @click="showAddActivity = true"
              class="btn-primary"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Ajouter une activité
            </button>
          </div>

          <!-- Liste des activités -->
          <div v-if="localEntry.activity.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">🏃‍♂️</div>
            <h4 class="text-lg font-medium text-theme-primary mb-2">Aucune activité aujourd'hui</h4>
            <p class="text-theme-muted mb-4">Ajoutez votre première activité physique de la journée</p>
            <button @click="showAddActivity = true" class="btn-primary">
              Ajouter une activité
            </button>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="activity in localEntry.activity"
              :key="activity.id"
              class="bg-theme-secondary rounded-lg p-4 flex items-center justify-between"
            >
              <div class="flex items-center space-x-4">
                <div class="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <span class="text-xl">{{ getActivityEmoji(activity.type) }}</span>
                </div>
                <div>
                  <h4 class="font-medium text-theme-primary">{{ activity.type }}</h4>
                  <div class="text-sm text-theme-muted">
                    {{ activity.duration }}min • {{ activity.intensity }} • {{ activity.calories || 0 }} cal
                  </div>
                  <div v-if="activity.time" class="text-xs text-theme-muted">{{ activity.time }}</div>
                </div>
              </div>
              <button
                @click="removeActivity(activity.id)"
                class="text-red-500 hover:text-red-700 p-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <!-- Total de la journée -->
            <div class="bg-emerald-50 dark:bg-emerald-900/20 rounded-lg p-4 mt-6">
              <div class="flex items-center justify-between">
                <div>
                  <h4 class="font-medium text-emerald-700 dark:text-emerald-300">Total du jour</h4>
                  <p class="text-sm text-emerald-600 dark:text-emerald-400">
                    {{ totalActivityMinutes }}min d'activité • {{ totalCalories }} calories
                  </p>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {{ Math.round((totalActivityMinutes / journalStore.goals.activityMinutes) * 100) }}%
                  </div>
                  <div class="text-xs text-emerald-600 dark:text-emerald-400">
                    Objectif: {{ journalStore.goals.activityMinutes }}min
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Onglet Alimentation -->
      <div v-if="activeTab === 'food'" class="card p-8">
        <div class="max-w-4xl">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-2xl font-semibold text-theme-primary flex items-center">
              <span class="mr-3">🍎</span>
              Alimentation
            </h3>
            <button
              @click="showAddFood = true"
              class="btn-primary"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Ajouter un repas
            </button>
          </div>

          <!-- Liste des repas -->
          <div v-if="localEntry.food.length === 0" class="text-center py-12">
            <div class="text-6xl mb-4">🍽️</div>
            <h4 class="text-lg font-medium text-theme-primary mb-2">Aucun repas enregistré</h4>
            <p class="text-theme-muted mb-4">Commencez à noter ce que vous mangez aujourd'hui</p>
            <button @click="showAddFood = true" class="btn-primary">
              Ajouter un repas
            </button>
          </div>

          <div v-else class="space-y-4">
            <div
              v-for="food in localEntry.food"
              :key="food.id"
              class="bg-theme-secondary rounded-lg p-4"
            >
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <div class="flex items-center space-x-2 mb-2">
                    <span class="text-lg">{{ getMealEmoji(food.meal) }}</span>
                    <h4 class="font-medium text-theme-primary">{{ food.meal }}</h4>
                    <span v-if="food.time" class="text-sm text-theme-muted">{{ food.time }}</span>
                  </div>
                  <p class="text-theme-secondary">{{ food.description }}</p>
                </div>
                <button
                  @click="removeFood(food.id)"
                  class="text-red-500 hover:text-red-700 p-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Ajouter Activité -->
    <div v-if="showAddActivity" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showAddActivity = false">
      <div class="bg-theme-card rounded-xl p-6 max-w-md w-full mx-4" @click.stop>
        <h3 class="text-xl font-semibold text-theme-primary mb-6">Ajouter une activité</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-theme-secondary mb-2">Type d'activité</label>
            <select v-model="newActivity.type" class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary">
              <option value="Marche">🚶 Marche</option>
              <option value="Course">🏃 Course</option>
              <option value="Vélo">🚴 Vélo</option>
              <option value="Natation">🏊 Natation</option>
              <option value="Musculation">💪 Musculation</option>
              <option value="Yoga">🧘 Yoga</option>
              <option value="Danse">💃 Danse</option>
              <option value="Football">⚽ Football</option>
              <option value="Tennis">🎾 Tennis</option>
              <option value="Autre">🏃‍♂️ Autre</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-theme-secondary mb-2">Durée (minutes)</label>
            <input 
              type="number" 
              v-model="newActivity.duration" 
              min="1" 
              class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-theme-secondary mb-2">Intensité</label>
            <select v-model="newActivity.intensity" class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary">
              <option value="Légère">Légère</option>
              <option value="Modérée">Modérée</option>
              <option value="Intense">Intense</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-theme-secondary mb-2">Calories estimées</label>
            <input 
              type="number" 
              v-model="newActivity.calories" 
              min="0" 
              class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-theme-secondary mb-2">Notes (optionnel)</label>
            <textarea 
              v-model="newActivity.notes" 
              rows="2"
              class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary resize-none"
            ></textarea>
          </div>
        </div>

        <div class="flex space-x-3 mt-6">
          <button @click="showAddActivity = false" class="btn-ghost flex-1">Annuler</button>
          <button @click="addActivity" class="btn-primary flex-1">Ajouter</button>
        </div>
      </div>
    </div>

    <!-- Modal Ajouter Repas -->
    <div v-if="showAddFood" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showAddFood = false">
      <div class="bg-theme-card rounded-xl p-6 max-w-md w-full mx-4" @click.stop>
        <h3 class="text-xl font-semibold text-theme-primary mb-6">Ajouter un repas</h3>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-theme-secondary mb-2">Type de repas</label>
            <select v-model="newFood.meal" class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary">
              <option value="Petit-déjeuner">🌅 Petit-déjeuner</option>
              <option value="Déjeuner">🌞 Déjeuner</option>
              <option value="Dîner">🌙 Dîner</option>
              <option value="Collation">🍎 Collation</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-theme-secondary mb-2">Description</label>
            <textarea 
              v-model="newFood.description" 
              rows="3"
              placeholder="Qu'avez-vous mangé ? Décrivez votre repas..."
              class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary resize-none"
            ></textarea>
          </div>
        </div>

        <div class="flex space-x-3 mt-6">
          <button @click="showAddFood = false" class="btn-ghost flex-1">Annuler</button>
          <button @click="addFood" class="btn-primary flex-1">Ajouter</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useJournalStore } from '@/stores/journal'

const journalStore = useJournalStore()

const selectedDate = ref(journalStore.formatDate())
const activeTab = ref('sleep')
const showAddActivity = ref(false)
const showAddFood = ref(false)
const saveStatus = ref('')

// État local pour éviter les conflits
const localEntry = ref({
  sleep: { bedTime: null, wakeTime: null, quality: 5, notes: '' },
  mood: { score: 0, emoji: '', tags: [], notes: '' },
  activity: [],
  food: []
})

const tabs = [
  { id: 'sleep', name: 'Sommeil', icon: '😴' },
  { id: 'mood', name: 'Humeur', icon: '😊' },
  { id: 'activity', name: 'Activité', icon: '🏃' },
  { id: 'food', name: 'Alimentation', icon: '🍎' }
]

const moodOptions = [
  { score: 2, emoji: '😢', label: 'Très mal' },
  { score: 4, emoji: '😕', label: 'Mal' },
  { score: 6, emoji: '😐', label: 'Moyen' },
  { score: 8, emoji: '😊', label: 'Bien' },
  { score: 10, emoji: '😄', label: 'Excellent' }
]

const moodTags = [
  'Stressé', 'Détendu', 'Énergique', 'Fatigué', 'Motivé', 'Anxieux', 
  'Heureux', 'Triste', 'Concentré', 'Distrait', 'Calme', 'Agité'
]

const newActivity = ref({
  type: 'Marche',
  duration: 30,
  intensity: 'Modérée',
  calories: 150,
  notes: ''
})

const newFood = ref({
  meal: 'Petit-déjeuner',
  description: ''
})

const isToday = computed(() => {
  return selectedDate.value === journalStore.formatDate()
})

const sleepDuration = computed(() => {
  return journalStore.getSleepDuration(localEntry.value)
})

const totalActivityMinutes = computed(() => {
  return journalStore.getTotalActivityMinutes(localEntry.value)
})

const totalCalories = computed(() => {
  return localEntry.value.activity.reduce((total, activity) => total + (activity.calories || 0), 0)
})

const saveStatusClass = computed(() => {
  switch (saveStatus.value) {
    case 'saving':
      return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
    case 'saved':
      return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
    case 'error':
      return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
    default:
      return ''
  }
})

const saveStatusText = computed(() => {
  switch (saveStatus.value) {
    case 'saving':
      return 'Sauvegarde en cours...'
    case 'saved':
      return 'Données sauvegardées'
    case 'error':
      return 'Erreur de sauvegarde'
    default:
      return ''
  }
})

// Charger les données lors du changement de date
watch(selectedDate, (newDate) => {
  loadEntryForDate(newDate)
})

// Charger les données initiales
onMounted(() => {
  loadEntryForDate(selectedDate.value)
})

const loadEntryForDate = (date) => {
  const entry = journalStore.entries[date]
  if (entry) {
    localEntry.value = JSON.parse(JSON.stringify(entry))
  } else {
    localEntry.value = {
      sleep: { bedTime: null, wakeTime: null, quality: 5, notes: '' },
      mood: { score: 0, emoji: '', tags: [], notes: '' },
      activity: [],
      food: []
    }
  }
}

const showSaveStatus = (status) => {
  saveStatus.value = status
  setTimeout(() => {
    saveStatus.value = ''
  }, 2000)
}

const formatDateLong = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const changeDate = (days) => {
  const date = new Date(selectedDate.value)
  date.setDate(date.getDate() + days)
  selectedDate.value = journalStore.formatDate(date)
}

const getTabProgress = (tabId) => {
  const entry = localEntry.value
  switch (tabId) {
    case 'sleep':
      return entry.sleep.bedTime && entry.sleep.wakeTime
    case 'mood':
      return entry.mood.score > 0
    case 'activity':
      return entry.activity.length > 0
    case 'food':
      return entry.food.length > 0
    default:
      return false
  }
}

const saveSleep = () => {
  showSaveStatus('saving')
  try {
    journalStore.updateEntry(selectedDate.value, 'sleep', localEntry.value.sleep)
    showSaveStatus('saved')
  } catch (error) {
    console.error('Erreur sauvegarde sommeil:', error)
    showSaveStatus('error')
  }
}

const saveMood = () => {
  showSaveStatus('saving')
  try {
    journalStore.updateEntry(selectedDate.value, 'mood', localEntry.value.mood)
    showSaveStatus('saved')
  } catch (error) {
    console.error('Erreur sauvegarde humeur:', error)
    showSaveStatus('error')
  }
}

const selectMood = (mood) => {
  localEntry.value.mood.score = mood.score
  localEntry.value.mood.emoji = mood.emoji
  saveMood()
}

const toggleMoodTag = (tag) => {
  const tags = localEntry.value.mood.tags
  const index = tags.indexOf(tag)
  if (index > -1) {
    tags.splice(index, 1)
  } else {
    tags.push(tag)
  }
  saveMood()
}

const addActivity = () => {
  if (newActivity.value.duration > 0) {
    showSaveStatus('saving')
    try {
      const activity = {
        id: Date.now(),
        ...newActivity.value,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      }
      
      localEntry.value.activity.push(activity)
      journalStore.addActivity(selectedDate.value, newActivity.value)
      
      newActivity.value = {
        type: 'Marche',
        duration: 30,
        intensity: 'Modérée',
        calories: 150,
        notes: ''
      }
      showAddActivity.value = false
      showSaveStatus('saved')
    } catch (error) {
      console.error('Erreur ajout activité:', error)
      showSaveStatus('error')
    }
  }
}

const removeActivity = (activityId) => {
  showSaveStatus('saving')
  try {
    localEntry.value.activity = localEntry.value.activity.filter(a => a.id !== activityId)
    journalStore.removeActivity(selectedDate.value, activityId)
    showSaveStatus('saved')
  } catch (error) {
    console.error('Erreur suppression activité:', error)
    showSaveStatus('error')
  }
}

const addFood = () => {
  if (newFood.value.description.trim()) {
    showSaveStatus('saving')
    try {
      const food = {
        id: Date.now(),
        ...newFood.value,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      }
      
      localEntry.value.food.push(food)
      journalStore.addFood(selectedDate.value, newFood.value)
      
      newFood.value = {
        meal: 'Petit-déjeuner',
        description: ''
      }
      showAddFood.value = false
      showSaveStatus('saved')
    } catch (error) {
      console.error('Erreur ajout repas:', error)
      showSaveStatus('error')
    }
  }
}

const removeFood = (foodId) => {
  showSaveStatus('saving')
  try {
    localEntry.value.food = localEntry.value.food.filter(f => f.id !== foodId)
    journalStore.removeFood(selectedDate.value, foodId)
    showSaveStatus('saved')
  } catch (error) {
    console.error('Erreur suppression repas:', error)
    showSaveStatus('error')
  }
}

const getActivityEmoji = (type) => {
  const emojis = {
    'Marche': '🚶',
    'Course': '🏃',
    'Vélo': '🚴',
    'Natation': '🏊',
    'Musculation': '💪',
    'Yoga': '🧘',
    'Danse': '💃',
    'Football': '⚽',
    'Tennis': '🎾'
  }
  return emojis[type] || '🏃‍♂️'
}

const getMealEmoji = (meal) => {
  const emojis = {
    'Petit-déjeuner': '🌅',
    'Déjeuner': '🌞',
    'Dîner': '🌙',
    'Collation': '🍎'
  }
  return emojis[meal] || '🍽️'
}
</script>
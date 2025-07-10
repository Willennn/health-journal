<!-- Journal Entry - Version refactorisée -->
<template>
  <div class="max-w-4xl mx-auto">
    <!-- Sélecteur de date -->
    <DateSelector
      v-model:selectedDate="selectedDate"
    />

    <!-- Indicateur de sauvegarde -->
    <SaveStatus
      :status="saveStatus"
      :message="saveMessage"
      @clear="clearSaveStatus"
    />

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
      </button>
    </div>

    <!-- Contenu des onglets -->
    <div class="tab-content">
      <!-- Section Sommeil -->
      <SleepSection
        v-if="activeTab === 'sleep'"
        :sleepData="localEntry.sleep"
        @update="updateSleep"
        @save="saveSleep"
      />

      <!-- Section Humeur -->
      <MoodSection
        v-if="activeTab === 'mood'"
        :moodData="localEntry.mood"
        @update="updateMood"
        @save="saveMood"
      />

      <!-- Section Activité -->
      <ActivitySection
        v-if="activeTab === 'activity'"
        :activityData="localEntry.activity"
        @update="updateActivity"
        @add-activity="addActivity"
        @remove-activity="removeActivity"
      />

      <!-- Section Alimentation -->
      <FoodSection
        v-if="activeTab === 'food'"
        :foodData="localEntry.food"
        @update="updateFood"
        @add-food="addFood"
        @remove-food="removeFood"
      />
    </div>

    <!-- Bouton de sauvegarde globale -->
    <div class="mt-8 flex justify-center">
      <button
        v-if="hasUnsavedChanges"
        @click="saveAllChanges"
        class="btn-primary px-8 py-3 text-lg"
        :disabled="saveStatus === 'saving'"
      >
        {{ saveStatus === 'saving' ? 'Sauvegarde...' : 'Enregistrer toutes les modifications' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useJournalStore } from '@/stores/journal'
import DateSelector from './DateSelector.vue'
import SaveStatus from './SaveStatus.vue'
import SleepSection from './SleepSection.vue'
import MoodSection from './MoodSection.vue'
import ActivitySection from './ActivitySection.vue'
import FoodSection from './FoodSection.vue'

const journalStore = useJournalStore()

// État local
const selectedDate = ref(journalStore.formatDate())
const activeTab = ref('sleep')
const saveStatus = ref('')
const saveMessage = ref('')
const hasUnsavedChanges = ref(false)

// Données locales pour éviter les conflits
const localEntry = ref({
  sleep: { bedTime: null, wakeTime: null, quality: 5, notes: '' },
  mood: { score: 0, emoji: '', tags: [], notes: '' },
  activity: [],
  food: []
})

// Configuration des onglets
const tabs = [
  { id: 'sleep', name: 'Sommeil', icon: '😴' },
  { id: 'mood', name: 'Humeur', icon: '😊' },
  { id: 'activity', name: 'Activité', icon: '🏃' },
  { id: 'food', name: 'Alimentation', icon: '🍎' }
]

// Fonctions utilitaires
const showSaveStatus = (status, message = '') => {
  saveStatus.value = status
  saveMessage.value = message

  if (status === 'saved' || status === 'error') {
    setTimeout(() => {
      saveStatus.value = ''
      saveMessage.value = ''
    }, 3000)
  }
}

const clearSaveStatus = () => {
  saveStatus.value = ''
  saveMessage.value = ''
}

// Charger les données pour une date
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
  hasUnsavedChanges.value = false
}

// Fonctions de mise à jour pour chaque section
const updateSleep = (sleepData) => {
  localEntry.value.sleep = { ...sleepData }
  hasUnsavedChanges.value = true
}

const updateMood = (moodData) => {
  localEntry.value.mood = { ...moodData }
  hasUnsavedChanges.value = true
}

const updateActivity = (activityData) => {
  localEntry.value.activity = [...activityData]
  hasUnsavedChanges.value = true
}

const updateFood = (foodData) => {
  localEntry.value.food = [...foodData]
  hasUnsavedChanges.value = true
}

// Fonctions de sauvegarde pour chaque section
const saveSleep = async (sleepData) => {
  showSaveStatus('saving')
  try {
    journalStore.updateSleep(selectedDate.value, sleepData)
    localEntry.value.sleep = { ...sleepData }
    showSaveStatus('saved', 'Données de sommeil sauvegardées')
  } catch (error) {
    console.error('Erreur sauvegarde sommeil:', error)
    showSaveStatus('error', 'Erreur lors de la sauvegarde du sommeil')
  }
}

const saveMood = async (moodData) => {
  showSaveStatus('saving')
  try {
    journalStore.updateMood(selectedDate.value, moodData)
    localEntry.value.mood = { ...moodData }
    showSaveStatus('saved', 'Données d\'humeur sauvegardées')
  } catch (error) {
    console.error('Erreur sauvegarde humeur:', error)
    showSaveStatus('error', 'Erreur lors de la sauvegarde de l\'humeur')
  }
}

// Fonctions pour les activités
const addActivity = async (activity) => {
  showSaveStatus('saving')
  try {
    journalStore.addActivity(selectedDate.value, activity)
    localEntry.value.activity.push(activity)
    showSaveStatus('saved', 'Activité ajoutée')
  } catch (error) {
    console.error('Erreur ajout activité:', error)
    showSaveStatus('error', 'Erreur lors de l\'ajout de l\'activité')
  }
}

const removeActivity = async (activityId) => {
  showSaveStatus('saving')
  try {
    localEntry.value.activity = localEntry.value.activity.filter(a => a.id !== activityId)
    journalStore.removeActivity(selectedDate.value, activityId)
    showSaveStatus('saved', 'Activité supprimée')
  } catch (error) {
    console.error('Erreur suppression activité:', error)
    showSaveStatus('error', 'Erreur lors de la suppression de l\'activité')
  }
}

// Fonctions pour l'alimentation
const addFood = async (food) => {
  showSaveStatus('saving')
  try {
    journalStore.addFood(selectedDate.value, food)
    localEntry.value.food.push(food)
    showSaveStatus('saved', 'Repas ajouté')
  } catch (error) {
    console.error('Erreur ajout repas:', error)
    showSaveStatus('error', 'Erreur lors de l\'ajout du repas')
  }
}

const removeFood = async (foodId) => {
  showSaveStatus('saving')
  try {
    localEntry.value.food = localEntry.value.food.filter(f => f.id !== foodId)
    journalStore.removeFood(selectedDate.value, foodId)
    showSaveStatus('saved', 'Repas supprimé')
  } catch (error) {
    console.error('Erreur suppression repas:', error)
    showSaveStatus('error', 'Erreur lors de la suppression du repas')
  }
}

// Sauvegarde globale
const saveAllChanges = async () => {
  showSaveStatus('saving')
  try {
    // Sauvegarder toutes les sections
    journalStore.updateEntry(selectedDate.value, localEntry.value)
    hasUnsavedChanges.value = false
    showSaveStatus('saved', 'Toutes les modifications ont été sauvegardées')
  } catch (error) {
    console.error('Erreur sauvegarde globale:', error)
    showSaveStatus('error', 'Erreur lors de la sauvegarde')
  }
}

// Watcher pour le changement de date
watch(selectedDate, (newDate) => {
  loadEntryForDate(newDate)
})

// Charger les données initiales
onMounted(() => {
  loadEntryForDate(selectedDate.value)
})
</script>

<style scoped>
.tab-content {
  min-height: 400px;
}

/* Animation pour les onglets */
.tab-content > * {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

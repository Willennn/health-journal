<!-- Section Activité -->
<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-semibold text-theme-primary flex items-center">
        <span class="text-2xl mr-3">🏃</span>
        Activité physique
      </h3>
      <button
        @click="showAddActivity = true"
        class="btn-primary"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter une activité
      </button>
    </div>

    <!-- Résumé des activités -->
    <div v-if="localActivities.length > 0" class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-theme-secondary p-4 rounded-lg">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-theme-primary font-medium">{{ totalActivityMinutes }} minutes</span>
        </div>
      </div>
      <div class="bg-theme-secondary p-4 rounded-lg">
        <div class="flex items-center space-x-2">
          <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span class="text-theme-primary font-medium">{{ totalCalories }} calories</span>
        </div>
      </div>
    </div>

    <!-- Liste des activités -->
    <div v-if="localActivities.length > 0" class="space-y-3">
      <div
        v-for="activity in localActivities"
        :key="activity.id"
        class="flex items-center justify-between p-4 bg-theme-secondary rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <span class="text-2xl">{{ getActivityEmoji(activity.type) }}</span>
          <div>
            <div class="font-medium text-theme-primary">{{ activity.type }}</div>
            <div class="text-sm text-theme-muted">
              {{ activity.duration }}min • {{ activity.intensity }} • {{ activity.calories || 0 }} cal
            </div>
          </div>
        </div>
        <button
          @click="removeActivity(activity.id)"
          class="text-red-500 hover:text-red-700 transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Message si aucune activité -->
    <div v-else class="text-center py-8">
      <div class="text-6xl mb-4">🏃‍♂️</div>
      <h4 class="text-lg font-medium text-theme-primary mb-2">Aucune activité enregistrée</h4>
      <p class="text-theme-muted">Ajoutez votre première activité de la journée</p>
    </div>

    <!-- Modal d'ajout d'activité -->
    <div v-if="showAddActivity" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-theme-primary p-6 rounded-lg w-full max-w-md mx-4">
        <h4 class="text-lg font-semibold text-theme-primary mb-4">Ajouter une activité</h4>
        
        <div class="space-y-4">
          <!-- Type d'activité -->
          <div>
            <label class="block text-sm font-medium text-theme-secondary mb-2">Type d'activité</label>
            <select
              v-model="newActivity.type"
              class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary"
            >
              <option value="Marche">🚶 Marche</option>
              <option value="Course">🏃 Course</option>
              <option value="Vélo">🚴 Vélo</option>
              <option value="Natation">🏊 Natation</option>
              <option value="Musculation">💪 Musculation</option>
              <option value="Yoga">🧘 Yoga</option>
              <option value="Danse">💃 Danse</option>
              <option value="Football">⚽ Football</option>
              <option value="Tennis">🎾 Tennis</option>
            </select>
          </div>

          <!-- Durée -->
          <div>
            <label class="block text-sm font-medium text-theme-secondary mb-2">Durée (minutes)</label>
            <input
              type="number"
              v-model="newActivity.duration"
              min="1"
              max="300"
              class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary"
            />
          </div>

          <!-- Intensité -->
          <div>
            <label class="block text-sm font-medium text-theme-secondary mb-2">Intensité</label>
            <select
              v-model="newActivity.intensity"
              class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary"
            >
              <option value="Légère">Légère</option>
              <option value="Modérée">Modérée</option>
              <option value="Intense">Intense</option>
            </select>
          </div>

          <!-- Calories (optionnel) -->
          <div>
            <label class="block text-sm font-medium text-theme-secondary mb-2">Calories brûlées (optionnel)</label>
            <input
              type="number"
              v-model="newActivity.calories"
              min="0"
              max="2000"
              placeholder="Estimation automatique si vide"
              class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary"
            />
          </div>

          <!-- Notes -->
          <div>
            <label class="block text-sm font-medium text-theme-secondary mb-2">Notes (optionnel)</label>
            <textarea
              v-model="newActivity.notes"
              placeholder="Comment s'est passée cette activité ?"
              class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary resize-none"
              rows="3"
            ></textarea>
          </div>
        </div>

        <div class="flex space-x-3 mt-6">
          <button @click="showAddActivity = false" class="btn-ghost flex-1">Annuler</button>
          <button @click="addActivity" class="btn-primary flex-1">Enregistrer l'activité</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineEmits } from 'vue'

const props = defineProps({
  activityData: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update', 'save', 'add-activity', 'remove-activity'])

const localActivities = ref([...props.activityData])
const showAddActivity = ref(false)

const newActivity = ref({
  type: 'Marche',
  duration: 30,
  intensity: 'Modérée',
  calories: null,
  notes: ''
})

const totalActivityMinutes = computed(() => {
  return localActivities.value.reduce((total, activity) => total + (activity.duration || 0), 0)
})

const totalCalories = computed(() => {
  return localActivities.value.reduce((total, activity) => total + (activity.calories || 0), 0)
})

// Estimer les calories selon le type d'activité et la durée
const estimateCalories = (type, duration, intensity) => {
  const baseCalories = {
    'Marche': 4,
    'Course': 10,
    'Vélo': 8,
    'Natation': 12,
    'Musculation': 6,
    'Yoga': 3,
    'Danse': 5,
    'Football': 9,
    'Tennis': 7
  }
  
  const intensityMultiplier = {
    'Légère': 0.8,
    'Modérée': 1.0,
    'Intense': 1.3
  }
  
  const base = baseCalories[type] || 5
  const multiplier = intensityMultiplier[intensity] || 1.0
  
  return Math.round(base * duration * multiplier)
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

const addActivity = () => {
  if (newActivity.value.duration > 0) {
    // Estimer les calories si non renseignées
    if (!newActivity.value.calories) {
      newActivity.value.calories = estimateCalories(
        newActivity.value.type,
        newActivity.value.duration,
        newActivity.value.intensity
      )
    }

    const activity = {
      id: Date.now(),
      ...newActivity.value,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
    
    localActivities.value.push(activity)
    emit('add-activity', activity)
    
    // Reset form
    newActivity.value = {
      type: 'Marche',
      duration: 30,
      intensity: 'Modérée',
      calories: null,
      notes: ''
    }
    
    showAddActivity.value = false
  }
}

const removeActivity = (activityId) => {
  localActivities.value = localActivities.value.filter(a => a.id !== activityId)
  emit('remove-activity', activityId)
}

// Mettre à jour les données locales quand les props changent
watch(() => props.activityData, (newData) => {
  localActivities.value = [...newData]
}, { deep: true })
</script>
<!-- Section Alimentation -->
<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-semibold text-theme-primary flex items-center">
        <span class="text-2xl mr-3">🍎</span>
        Alimentation
      </h3>
      <button
        @click="showAddFood = true"
        class="btn-primary"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Ajouter un repas
      </button>
    </div>

    <!-- Liste des repas -->
    <div v-if="localFoods.length > 0" class="space-y-3">
      <div
        v-for="food in localFoods"
        :key="food.id"
        class="flex items-start justify-between p-4 bg-theme-secondary rounded-lg"
      >
        <div class="flex items-start space-x-3">
          <span class="text-2xl">{{ getMealEmoji(food.meal) }}</span>
          <div class="flex-1">
            <div class="font-medium text-theme-primary">{{ food.meal }}</div>
            <div class="text-sm text-theme-muted mb-1">{{ food.time }}</div>
            <div class="text-theme-primary">{{ food.description }}</div>
          </div>
        </div>
        <button
          @click="removeFood(food.id)"
          class="text-red-500 hover:text-red-700 transition-colors ml-4 flex-shrink-0"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Message si aucun repas -->
    <div v-else class="text-center py-8">
      <div class="text-6xl mb-4">🍽️</div>
      <h4 class="text-lg font-medium text-theme-primary mb-2">Aucun repas enregistré</h4>
      <p class="text-theme-muted">Ajoutez vos repas pour suivre votre alimentation</p>
    </div>

    <!-- Modal d'ajout de repas -->
    <div v-if="showAddFood" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-theme-primary p-6 rounded-lg w-full max-w-md mx-4">
        <h4 class="text-lg font-semibold text-theme-primary mb-4">Ajouter un repas</h4>
        
        <div class="space-y-4">
          <!-- Type de repas -->
          <div>
            <label class="block text-sm font-medium text-theme-secondary mb-2">Type de repas</label>
            <select
              v-model="newFood.meal"
              class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary"
            >
              <option value="Petit-déjeuner">🌅 Petit-déjeuner</option>
              <option value="Collation matinale">☕ Collation matinale</option>
              <option value="Déjeuner">🌞 Déjeuner</option>
              <option value="Collation">🍎 Collation</option>
              <option value="Dîner">🌙 Dîner</option>
              <option value="Collation nocturne">🌃 Collation nocturne</option>
            </select>
          </div>

          <!-- Description du repas -->
          <div>
            <label class="block text-sm font-medium text-theme-secondary mb-2">Description du repas</label>
            <textarea
              v-model="newFood.description"
              placeholder="Décrivez votre repas..."
              class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary resize-none"
              rows="4"
            ></textarea>
          </div>

          <!-- Notes nutritionnelles (optionnel) -->
          <div>
            <label class="block text-sm font-medium text-theme-secondary mb-2">Notes (optionnel)</label>
            <textarea
              v-model="newFood.notes"
              placeholder="Notes sur la qualité, les sensations, etc."
              class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary resize-none"
              rows="2"
            ></textarea>
          </div>

          <!-- Évaluation de la qualité (optionnel) -->
          <div>
            <label class="block text-sm font-medium text-theme-secondary mb-3">
              Qualité nutritionnelle (optionnel)
            </label>
            <div class="flex items-center space-x-4">
              <span class="text-sm text-theme-muted">Mauvaise</span>
              <input
                type="range"
                v-model="newFood.quality"
                min="1"
                max="5"
                class="flex-1 h-2 bg-theme-secondary rounded-lg appearance-none cursor-pointer"
              />
              <span class="text-sm text-theme-muted">Excellente</span>
              <div v-if="newFood.quality" class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {{ newFood.quality }}
              </div>
            </div>
          </div>
        </div>

        <div class="flex space-x-3 mt-6">
          <button @click="showAddFood = false" class="btn-ghost flex-1">Annuler</button>
          <button @click="addFood" class="btn-primary flex-1">Enregistrer le repas</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue'

const props = defineProps({
  foodData: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update', 'save', 'add-food', 'remove-food'])

const localFoods = ref([...props.foodData])
const showAddFood = ref(false)

const newFood = ref({
  meal: 'Petit-déjeuner',
  description: '',
  notes: '',
  quality: null
})

const getMealEmoji = (meal) => {
  const emojis = {
    'Petit-déjeuner': '🌅',
    'Collation matinale': '☕',
    'Déjeuner': '🌞',
    'Collation': '🍎',
    'Dîner': '🌙',
    'Collation nocturne': '🌃'
  }
  return emojis[meal] || '🍽️'
}

const addFood = () => {
  if (newFood.value.description.trim()) {
    const food = {
      id: Date.now(),
      ...newFood.value,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
    
    localFoods.value.push(food)
    emit('add-food', food)
    
    // Reset form
    newFood.value = {
      meal: 'Petit-déjeuner',
      description: '',
      notes: '',
      quality: null
    }
    
    showAddFood.value = false
  }
}

const removeFood = (foodId) => {
  localFoods.value = localFoods.value.filter(f => f.id !== foodId)
  emit('remove-food', foodId)
}

// Mettre à jour les données locales quand les props changent
watch(() => props.foodData, (newData) => {
  localFoods.value = [...newData]
}, { deep: true })
</script>
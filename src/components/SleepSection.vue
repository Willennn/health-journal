<!-- Section Sommeil -->
<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-semibold text-theme-primary flex items-center">
        <span class="text-2xl mr-3">😴</span>
        Sommeil
      </h3>
      <button
        v-if="hasChanges"
        @click="saveChanges"
        class="btn-primary px-4 py-2 text-sm"
        :disabled="isSaving"
      >
        {{ isSaving ? 'Sauvegarde...' : 'Enregistrer' }}
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Heure de coucher -->
      <div>
        <label class="block text-sm font-medium text-theme-secondary mb-2">
          Heure de coucher
        </label>
        <input
          type="time"
          v-model="localSleep.bedTime"
          @change="markAsChanged"
          class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary"
        />
      </div>

      <!-- Heure de lever -->
      <div>
        <label class="block text-sm font-medium text-theme-secondary mb-2">
          Heure de lever
        </label>
        <input
          type="time"
          v-model="localSleep.wakeTime"
          @change="markAsChanged"
          class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary"
        />
      </div>
    </div>

    <!-- Durée de sommeil calculée -->
    <div v-if="sleepDuration > 0" class="mt-4 p-4 bg-theme-secondary rounded-lg">
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-theme-primary font-medium">
          Durée de sommeil: {{ sleepDuration.toFixed(1) }}h
        </span>
      </div>
    </div>

    <!-- Qualité du sommeil -->
    <div class="mt-6">
      <label class="block text-sm font-medium text-theme-secondary mb-3">
        Qualité du sommeil (1-10)
      </label>
      <div class="flex items-center space-x-4">
        <span class="text-sm text-theme-muted">1</span>
        <input
          type="range"
          v-model="localSleep.quality"
          @input="markAsChanged"
          min="1"
          max="10"
          class="flex-1 h-2 bg-theme-secondary rounded-lg appearance-none cursor-pointer"
        />
        <span class="text-sm text-theme-muted">10</span>
        <div class="w-12 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">
          {{ localSleep.quality }}
        </div>
      </div>
    </div>

    <!-- Notes sur le sommeil -->
    <div class="mt-6">
      <label class="block text-sm font-medium text-theme-secondary mb-2">
        Notes sur le sommeil
      </label>
      <textarea
        v-model="localSleep.notes"
        @input="markAsChanged"
        placeholder="Comment avez-vous dormi ? Rêves, réveils nocturnes, etc."
        class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary resize-none"
        rows="3"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineEmits } from 'vue'

const props = defineProps({
  sleepData: {
    type: Object,
    default: () => ({ bedTime: null, wakeTime: null, quality: 5, notes: '' })
  }
})

const emit = defineEmits(['update', 'save'])

const localSleep = ref({ ...props.sleepData })
const hasChanges = ref(false)
const isSaving = ref(false)

// Calculer la durée de sommeil
const sleepDuration = computed(() => {
  if (!localSleep.value.bedTime || !localSleep.value.wakeTime) return 0
  
  const bedTime = new Date(`2000-01-01 ${localSleep.value.bedTime}`)
  let wakeTime = new Date(`2000-01-01 ${localSleep.value.wakeTime}`)
  
  // Si l'heure de lever est avant l'heure de coucher, c'est le jour suivant
  if (wakeTime < bedTime) {
    wakeTime.setDate(wakeTime.getDate() + 1)
  }
  
  return (wakeTime - bedTime) / (1000 * 60 * 60) // en heures
})

// Marquer comme modifié
const markAsChanged = () => {
  hasChanges.value = true
  emit('update', localSleep.value)
}

// Sauvegarder les changements
const saveChanges = async () => {
  isSaving.value = true
  try {
    emit('save', localSleep.value)
    hasChanges.value = false
  } catch (error) {
    console.error('Erreur sauvegarde sommeil:', error)
  } finally {
    isSaving.value = false
  }
}

// Mettre à jour les données locales quand les props changent
watch(() => props.sleepData, (newData) => {
  localSleep.value = { ...newData }
  hasChanges.value = false
}, { deep: true })
</script>
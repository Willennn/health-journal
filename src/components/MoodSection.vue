<!-- Section Humeur -->
<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-xl font-semibold text-theme-primary flex items-center">
        <span class="text-2xl mr-3">😊</span>
        Humeur
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

    <!-- Sélection de l'humeur -->
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
            'p-4 rounded-lg border-2 transition-all text-center',
            localMood.score === mood.score
              ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
              : 'border-transparent hover:border-emerald-300 bg-theme-secondary'
          ]"
        >
          <div class="text-3xl mb-2">{{ mood.emoji }}</div>
          <div class="text-xs text-theme-muted">{{ mood.label }}</div>
        </button>
      </div>
    </div>

    <!-- Tags d'humeur -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-theme-secondary mb-3">
        Précisez votre état (optionnel)
      </label>
      <div class="flex flex-wrap gap-2">
        <button
          v-for="tag in moodTags"
          :key="tag"
          @click="toggleTag(tag)"
          :class="[
            'px-3 py-2 rounded-full text-sm transition-all',
            localMood.tags.includes(tag)
              ? 'bg-emerald-500 text-white'
              : 'bg-theme-secondary text-theme-muted hover:bg-theme-card'
          ]"
        >
          {{ tag }}
        </button>
      </div>
    </div>

    <!-- Score actuel -->
    <div v-if="localMood.score > 0" class="mb-6 p-4 bg-theme-secondary rounded-lg">
      <div class="flex items-center justify-between">
        <span class="text-theme-primary font-medium">Score d'humeur:</span>
        <div class="flex items-center space-x-2">
          <span class="text-2xl">{{ selectedMoodEmoji }}</span>
          <span class="text-lg font-bold text-emerald-500">{{ localMood.score }}/10</span>
        </div>
      </div>
    </div>

    <!-- Notes sur l'humeur -->
    <div>
      <label class="block text-sm font-medium text-theme-secondary mb-2">
        Notes sur votre humeur
      </label>
      <textarea
        v-model="localMood.notes"
        @input="markAsChanged"
        placeholder="Qu'est-ce qui influence votre humeur aujourd'hui ?"
        class="w-full bg-theme-secondary border border-theme rounded-lg px-4 py-3 text-theme-primary resize-none"
        rows="3"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineEmits } from 'vue'

const props = defineProps({
  moodData: {
    type: Object,
    default: () => ({ score: 0, emoji: '', tags: [], notes: '' })
  }
})

const emit = defineEmits(['update', 'save'])

const localMood = ref({ ...props.moodData })
const hasChanges = ref(false)
const isSaving = ref(false)

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

const selectedMoodEmoji = computed(() => {
  const mood = moodOptions.find(m => m.score === localMood.value.score)
  return mood ? mood.emoji : '😐'
})

// Marquer comme modifié
const markAsChanged = () => {
  hasChanges.value = true
  emit('update', localMood.value)
}

// Sélectionner une humeur
const selectMood = (mood) => {
  localMood.value.score = mood.score
  localMood.value.emoji = mood.emoji
  markAsChanged()
}

// Basculer un tag
const toggleTag = (tag) => {
  const index = localMood.value.tags.indexOf(tag)
  if (index > -1) {
    localMood.value.tags.splice(index, 1)
  } else {
    localMood.value.tags.push(tag)
  }
  markAsChanged()
}

// Sauvegarder les changements
const saveChanges = async () => {
  isSaving.value = true
  try {
    emit('save', localMood.value)
    hasChanges.value = false
  } catch (error) {
    console.error('Erreur sauvegarde humeur:', error)
  } finally {
    isSaving.value = false
  }
}

// Mettre à jour les données locales quand les props changent
watch(() => props.moodData, (newData) => {
  localMood.value = { ...newData }
  hasChanges.value = false
}, { deep: true })
</script>
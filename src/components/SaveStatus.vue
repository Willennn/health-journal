<!-- Indicateur de statut de sauvegarde -->
<template>
  <transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 transform -translate-y-2"
    enter-to-class="opacity-100 transform translate-y-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 transform translate-y-0"
    leave-to-class="opacity-0 transform -translate-y-2"
  >
    <div v-if="status" class="mb-4 p-3 rounded-lg flex items-center space-x-2" :class="statusClass">
      <!-- Icône de chargement -->
      <svg 
        v-if="status === 'saving'" 
        class="w-4 h-4 animate-spin" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
        />
      </svg>
      
      <!-- Icône de succès -->
      <svg 
        v-else-if="status === 'saved'" 
        class="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M5 13l4 4L19 7" 
        />
      </svg>
      
      <!-- Icône d'erreur -->
      <svg 
        v-else-if="status === 'error'" 
        class="w-4 h-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
        />
      </svg>
      
      <!-- Message -->
      <span class="text-sm font-medium">{{ statusText }}</span>
      
      <!-- Bouton de fermeture pour les erreurs -->
      <button
        v-if="status === 'error'"
        @click="$emit('clear')"
        class="ml-auto text-current opacity-70 hover:opacity-100 transition-opacity"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  </transition>
</template>

<script setup>
import { computed, defineEmits } from 'vue'

const props = defineProps({
  status: {
    type: String,
    validator: value => ['', 'saving', 'saved', 'error'].includes(value),
    default: ''
  },
  message: {
    type: String,
    default: ''
  }
})

defineEmits(['clear'])

const statusClass = computed(() => {
  switch (props.status) {
    case 'saving':
      return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
    case 'saved':
      return 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
    case 'error':
      return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
    default:
      return ''
  }
})

const statusText = computed(() => {
  if (props.message) {
    return props.message
  }
  
  switch (props.status) {
    case 'saving':
      return 'Sauvegarde en cours...'
    case 'saved':
      return 'Données sauvegardées avec succès'
    case 'error':
      return 'Erreur lors de la sauvegarde'
    default:
      return ''
  }
})
</script>
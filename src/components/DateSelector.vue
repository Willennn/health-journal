<!-- Sélecteur de date avec navigation -->
<template>
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
        title="Jour précédent"
      >
        <svg class="w-5 h-5 text-theme-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <input 
        type="date" 
        :value="selectedDate"
        @change="onDateChange"
        class="bg-theme-card border border-theme rounded-lg px-3 py-2 text-theme-primary cursor-pointer hover:bg-theme-secondary transition-colors"
      />
      
      <button 
        @click="changeDate(1)"
        :disabled="isToday"
        :class="[
          'p-2 rounded-lg transition-colors',
          isToday 
            ? 'bg-gray-200 dark:bg-gray-700 cursor-not-allowed opacity-50' 
            : 'bg-theme-card hover:bg-theme-secondary'
        ]"
        :title="isToday ? 'Impossible d\'aller dans le futur' : 'Jour suivant'"
      >
        <svg class="w-5 h-5 text-theme-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <!-- Bouton "Aujourd'hui" si on n'est pas sur aujourd'hui -->
      <button
        v-if="!isToday"
        @click="goToToday"
        class="px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-sm font-medium"
      >
        Aujourd'hui
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, defineEmits } from 'vue'

const props = defineProps({
  selectedDate: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:selectedDate'])

const isToday = computed(() => {
  const today = new Date().toISOString().split('T')[0]
  return props.selectedDate === today
})

const formatDateLong = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const changeDate = (days) => {
  const date = new Date(props.selectedDate)
  date.setDate(date.getDate() + days)
  const newDate = date.toISOString().split('T')[0]
  emit('update:selectedDate', newDate)
}

const onDateChange = (event) => {
  emit('update:selectedDate', event.target.value)
}

const goToToday = () => {
  const today = new Date().toISOString().split('T')[0]
  emit('update:selectedDate', today)
}
</script>
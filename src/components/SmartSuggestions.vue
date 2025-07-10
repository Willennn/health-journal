<template>
  <div class="space-y-6">
    <!-- Header avec IA -->
    <div class="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 rounded-xl p-6 text-white">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold mb-2 flex items-center">
            <span class="mr-3">🤖</span>
            Assistant IA Personnel
          </h2>
          <p class="opacity-90">Suggestions intelligentes basées sur vos données de santé</p>
        </div>
        <div class="text-center">
          <div class="text-3xl font-bold">{{ totalSuggestions }}</div>
          <div class="text-sm opacity-75">Conseils actifs</div>
        </div>
      </div>
    </div>

    <!-- Résumé de santé actuel -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-theme-primary mb-4 flex items-center">
        <span class="mr-2">📊</span>
        Votre état de santé actuel
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="text-center p-4 rounded-lg" :class="healthScore.overall >= 80 ? 'bg-emerald-50 dark:bg-emerald-900/20' : healthScore.overall >= 60 ? 'bg-yellow-50 dark:bg-yellow-900/20' : 'bg-red-50 dark:bg-red-900/20'">
          <div class="text-2xl mb-2">{{ healthScore.overall >= 80 ? '🌟' : healthScore.overall >= 60 ? '⚡' : '⚠️' }}</div>
          <div class="text-xl font-bold" :class="healthScore.overall >= 80 ? 'text-emerald-600' : healthScore.overall >= 60 ? 'text-yellow-600' : 'text-red-600'">
            {{ healthScore.overall }}%
          </div>
          <div class="text-sm text-theme-muted">Score global</div>
        </div>

        <div class="text-center p-4 rounded-lg bg-theme-secondary">
          <div class="text-2xl mb-2">😴</div>
          <div class="text-xl font-bold text-theme-primary">{{ healthScore.sleep }}%</div>
          <div class="text-sm text-theme-muted">Sommeil</div>
        </div>

        <div class="text-center p-4 rounded-lg bg-theme-secondary">
          <div class="text-2xl mb-2">😊</div>
          <div class="text-xl font-bold text-theme-primary">{{ healthScore.mood }}%</div>
          <div class="text-sm text-theme-muted">Humeur</div>
        </div>

        <div class="text-center p-4 rounded-lg bg-theme-secondary">
          <div class="text-2xl mb-2">🏃</div>
          <div class="text-xl font-bold text-theme-primary">{{ healthScore.activity }}%</div>
          <div class="text-sm text-theme-muted">Activité</div>
        </div>
      </div>

      <div class="text-center">
        <p class="text-theme-muted">{{ healthSummary }}</p>
      </div>
    </div>

    <!-- Suggestions prioritaires -->
    <div v-if="prioritySuggestions.length > 0" class="card p-6">
      <h3 class="text-lg font-semibold text-theme-primary mb-4 flex items-center">
        <span class="mr-2">🚨</span>
        Suggestions prioritaires
      </h3>
      <div class="space-y-4">
        <div
          v-for="suggestion in prioritySuggestions"
          :key="suggestion.id"
          class="p-4 border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-lg"
        >
          <div class="flex items-start space-x-3">
            <div class="text-3xl">{{ suggestion.icon }}</div>
            <div class="flex-1">
              <h4 class="font-semibold text-red-700 dark:text-red-300">{{ suggestion.title }}</h4>
              <p class="text-sm text-red-600 dark:text-red-400 mt-1">{{ suggestion.description }}</p>
              <div class="flex items-center space-x-2 mt-3">
                <span class="text-xs px-2 py-1 bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200 rounded">
                  {{ suggestion.category }}
                </span>
                <span class="text-xs text-red-600 dark:text-red-400">
                  Impact: {{ suggestion.impact }}
                </span>
              </div>
              <div class="mt-3 space-x-2">
                <button
                  v-for="action in suggestion.actions"
                  :key="action.id"
                  @click="applySuggestion(suggestion, action)"
                  class="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                >
                  {{ action.label }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Filtres de suggestions -->
    <div class="flex flex-wrap gap-2">
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

    <!-- Suggestions par catégorie -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div
        v-for="suggestion in filteredSuggestions"
        :key="suggestion.id"
        class="card p-6 hover:shadow-lg transition-shadow"
      >
        <!-- Header de la suggestion -->
        <div class="flex items-start justify-between mb-4">
          <div class="flex items-start space-x-3">
            <div class="text-3xl">{{ suggestion.icon }}</div>
            <div>
              <h4 class="font-semibold text-theme-primary">{{ suggestion.title }}</h4>
              <p class="text-sm text-theme-muted">{{ suggestion.category }}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span
              :class="[
                'text-xs px-2 py-1 rounded',
                suggestion.priority === 'high' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                suggestion.priority === 'medium' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300' :
                'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              ]"
            >
              {{ suggestion.priority === 'high' ? 'Urgent' : suggestion.priority === 'medium' ? 'Important' : 'Conseil' }}
            </span>
          </div>
        </div>

        <!-- Description -->
        <p class="text-sm text-theme-secondary mb-4">{{ suggestion.description }}</p>

        <!-- Données qui ont motivé la suggestion -->
        <div v-if="suggestion.data" class="mb-4 p-3 bg-theme-secondary rounded-lg">
          <div class="text-xs text-theme-muted mb-2">Basé sur vos données :</div>
          <div class="text-sm text-theme-primary">{{ suggestion.data }}</div>
        </div>

        <!-- Actions disponibles -->
        <div class="space-y-2">
          <div
            v-for="action in suggestion.actions"
            :key="action.id"
            class="flex items-center justify-between p-2 bg-theme-secondary rounded"
          >
            <span class="text-sm text-theme-primary">{{ action.label }}</span>
            <button
              @click="applySuggestion(suggestion, action)"
              class="px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 transition-colors"
            >
              {{ action.buttonText }}
            </button>
          </div>
        </div>

        <!-- Impact estimé -->
        <div class="mt-4 text-center">
          <div class="text-xs text-theme-muted">Impact estimé sur votre bien-être</div>
          <div class="flex justify-center mt-1">
            <div class="flex space-x-1">
              <div
                v-for="i in 5"
                :key="i"
                :class="[
                  'w-2 h-2 rounded-full',
                  i <= suggestion.impactLevel ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
                ]"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Progression des objectifs -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-theme-primary mb-4 flex items-center">
        <span class="mr-2">🎯</span>
        Progression vers vos objectifs
      </h3>

      <div class="space-y-4">
        <div
          v-for="goal in goalProgress"
          :key="goal.id"
          class="p-4 bg-theme-secondary rounded-lg"
        >
          <div class="flex justify-between items-center mb-2">
            <div class="flex items-center space-x-2">
              <span class="text-xl">{{ goal.icon }}</span>
              <span class="font-medium text-theme-primary">{{ goal.name }}</span>
            </div>
            <span class="text-sm font-bold text-theme-primary">{{ goal.progress }}%</span>
          </div>

          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
            <div
              class="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
              :style="{ width: `${goal.progress}%` }"
            ></div>
          </div>

          <div class="text-xs text-theme-muted">{{ goal.description }}</div>

          <div v-if="goal.suggestion" class="mt-2 text-xs text-purple-600 dark:text-purple-400">
            💡 {{ goal.suggestion }}
          </div>
        </div>
      </div>
    </div>

    <!-- Tendances détectées -->
    <div v-if="trends.length > 0" class="card p-6">
      <h3 class="text-lg font-semibold text-theme-primary mb-4 flex items-center">
        <span class="mr-2">📈</span>
        Tendances détectées
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="trend in trends"
          :key="trend.id"
          class="p-4 border border-theme rounded-lg"
        >
          <div class="flex items-center space-x-2 mb-2">
            <span class="text-xl">{{ trend.icon }}</span>
            <span class="font-medium text-theme-primary">{{ trend.title }}</span>
            <span
              :class="[
                'text-xs px-2 py-1 rounded',
                trend.direction === 'up' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' :
                trend.direction === 'down' ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' :
                'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300'
              ]"
            >
              {{ trend.direction === 'up' ? '↗️ En hausse' : trend.direction === 'down' ? '↘️ En baisse' : '→ Stable' }}
            </span>
          </div>
          <p class="text-sm text-theme-secondary">{{ trend.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useJournalStore } from '@/stores/journal'

const journalStore = useJournalStore()
const selectedFilter = ref('all')

// Filtres disponibles
const filters = [
  { value: 'all', label: 'Toutes', icon: '🎯' },
  { value: 'sleep', label: 'Sommeil', icon: '😴' },
  { value: 'mood', label: 'Humeur', icon: '😊' },
  { value: 'activity', label: 'Activité', icon: '🏃' },
  { value: 'nutrition', label: 'Nutrition', icon: '🍎' },
  { value: 'habits', label: 'Habitudes', icon: '🔄' }
]

// Calcul du score de santé
const healthScore = computed(() => {
  const entries = Object.values(journalStore.entries).slice(-7) // Derniers 7 jours
  if (entries.length === 0) return { overall: 0, sleep: 0, mood: 0, activity: 0 }

  // Score sommeil
  const sleepScores = entries
    .filter(entry => entry.sleep?.bedTime && entry.sleep?.wakeTime)
    .map(entry => {
      const duration = journalStore.getSleepDuration(entry)
      const quality = entry.sleep.quality || 5
      return duration >= 7 && duration <= 9 ? quality * 10 : quality * 8
    })
  const sleep = sleepScores.length > 0 ? sleepScores.reduce((a, b) => a + b, 0) / sleepScores.length : 0

  // Score humeur
  const moodScores = entries
    .filter(entry => entry.mood?.score > 0)
    .map(entry => entry.mood.score * 10)
  const mood = moodScores.length > 0 ? moodScores.reduce((a, b) => a + b, 0) / moodScores.length : 0

  // Score activité
  const activityScores = entries.map(entry => {
    const minutes = journalStore.getTotalActivityMinutes(entry)
    return Math.min((minutes / 30) * 100, 100) // 30 min = 100%
  })
  const activity = activityScores.length > 0 ? activityScores.reduce((a, b) => a + b, 0) / activityScores.length : 0

  const overall = Math.round((sleep + mood + activity) / 3)

  return {
    overall: Math.round(overall),
    sleep: Math.round(sleep),
    mood: Math.round(mood),
    activity: Math.round(activity)
  }
})

// Résumé de santé
const healthSummary = computed(() => {
  const score = healthScore.value.overall
  if (score >= 80) return "Excellent ! Vous maintenez un mode de vie très sain."
  if (score >= 60) return "Bien ! Quelques améliorations pourraient optimiser votre bien-être."
  if (score >= 40) return "Moyen. Il y a des domaines importants à améliorer."
  return "Attention ! Votre bien-être nécessite une attention particulière."
})

// Génération des suggestions intelligentes
const allSuggestions = computed(() => {
  const suggestions = []
  const entries = Object.values(journalStore.entries).slice(-7)
  const currentStreak = journalStore.getCurrentStreak

  // Suggestions sommeil
  const sleepData = entries.filter(e => e.sleep?.bedTime && e.sleep?.wakeTime)
  if (sleepData.length > 0) {
    const avgSleep = sleepData.reduce((sum, e) => sum + journalStore.getSleepDuration(e), 0) / sleepData.length
    const avgQuality = sleepData.reduce((sum, e) => sum + (e.sleep.quality || 5), 0) / sleepData.length

    if (avgSleep < 7) {
      suggestions.push({
        id: 'sleep_duration',
        title: 'Augmentez votre temps de sommeil',
        category: 'Sommeil',
        description: `Vous dormez en moyenne ${avgSleep.toFixed(1)}h par nuit. L'idéal est de 7-9h.`,
        data: `Moyenne actuelle: ${avgSleep.toFixed(1)}h/nuit sur 7 jours`,
        priority: 'high',
        icon: '😴',
        impact: 'Élevé',
        impactLevel: 4,
        type: 'sleep',
        actions: [
          { id: 'earlier_bedtime', label: 'Me coucher 30min plus tôt', buttonText: 'Programmer' },
          { id: 'sleep_reminder', label: 'Activer rappel coucher', buttonText: 'Activer' }
        ]
      })
    }

    if (avgQuality < 6) {
      suggestions.push({
        id: 'sleep_quality',
        title: 'Améliorez la qualité de votre sommeil',
        category: 'Sommeil',
        description: 'Votre qualité de sommeil pourrait être optimisée.',
        data: `Qualité moyenne: ${avgQuality.toFixed(1)}/10`,
        priority: 'medium',
        icon: '🌙',
        impact: 'Moyen',
        impactLevel: 3,
        type: 'sleep',
        actions: [
          { id: 'sleep_hygiene', label: 'Guide hygiène du sommeil', buttonText: 'Consulter' },
          { id: 'relaxation', label: 'Techniques de relaxation', buttonText: 'Apprendre' }
        ]
      })
    }
  }

  // Suggestions activité
  const totalActivity = entries.reduce((sum, e) => sum + journalStore.getTotalActivityMinutes(e), 0)
  const avgActivity = totalActivity / 7

  if (avgActivity < 30) {
    suggestions.push({
      id: 'increase_activity',
      title: 'Augmentez votre activité physique',
      category: 'Activité',
      description: 'L\'OMS recommande au moins 30 minutes d\'activité par jour.',
      data: `Moyenne actuelle: ${avgActivity.toFixed(0)} min/jour`,
      priority: avgActivity < 15 ? 'high' : 'medium',
      icon: '🏃',
      impact: 'Élevé',
      impactLevel: 4,
      type: 'activity',
      actions: [
        { id: 'start_walking', label: 'Commencer par 15min de marche', buttonText: 'Planifier' },
        { id: 'activity_reminder', label: 'Rappel activité quotidien', buttonText: 'Activer' }
      ]
    })
  }

  // Suggestions humeur
  const moodData = entries.filter(e => e.mood?.score > 0)
  if (moodData.length > 0) {
    const avgMood = moodData.reduce((sum, e) => sum + e.mood.score, 0) / moodData.length

    if (avgMood < 6) {
      suggestions.push({
        id: 'improve_mood',
        title: 'Boostez votre moral',
        category: 'Humeur',
        description: 'Votre humeur générale pourrait être améliorée.',
        data: `Humeur moyenne: ${avgMood.toFixed(1)}/10`,
        priority: avgMood < 4 ? 'high' : 'medium',
        icon: '😊',
        impact: 'Élevé',
        impactLevel: 4,
        type: 'mood',
        actions: [
          { id: 'gratitude', label: 'Journal de gratitude', buttonText: 'Commencer' },
          { id: 'social_contact', label: 'Planifier activité sociale', buttonText: 'Organiser' }
        ]
      })
    }
  }

  // Suggestions habitudes
  if (currentStreak === 0) {
    suggestions.push({
      id: 'restart_habit',
      title: 'Redémarrez votre routine',
      category: 'Habitudes',
      description: 'Vous avez interrompu votre série. C\'est le moment de recommencer !',
      data: 'Série actuelle: 0 jour',
      priority: 'medium',
      icon: '🔄',
      impact: 'Moyen',
      impactLevel: 3,
      type: 'habits',
      actions: [
        { id: 'simple_start', label: 'Commencer simple aujourd\'hui', buttonText: 'Démarrer' },
        { id: 'motivation', label: 'Conseils motivation', buttonText: 'Lire' }
      ]
    })
  }

  // Suggestion nutrition si peu de données
  const nutritionData = entries.filter(e => e.food && e.food.length > 0)
  if (nutritionData.length < 3) {
    suggestions.push({
      id: 'track_nutrition',
      title: 'Suivez votre alimentation',
      category: 'Nutrition',
      description: 'Le suivi nutritionnel vous aidera à identifier les patterns alimentaires.',
      data: `Données nutrition: ${nutritionData.length}/7 jours`,
      priority: 'low',
      icon: '🍎',
      impact: 'Moyen',
      impactLevel: 3,
      type: 'nutrition',
      actions: [
        { id: 'start_food_tracking', label: 'Commencer le suivi alimentaire', buttonText: 'Démarrer' },
        { id: 'nutrition_tips', label: 'Conseils nutrition', buttonText: 'Consulter' }
      ]
    })
  }

  return suggestions.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
})

// Suggestions prioritaires
const prioritySuggestions = computed(() => {
  return allSuggestions.value.filter(s => s.priority === 'high')
})

// Suggestions filtrées
const filteredSuggestions = computed(() => {
  const suggestions = allSuggestions.value.filter(s => s.priority !== 'high')
  if (selectedFilter.value === 'all') return suggestions
  return suggestions.filter(s => s.type === selectedFilter.value)
})

// Total des suggestions
const totalSuggestions = computed(() => {
  return allSuggestions.value.length
})

// Progression des objectifs
const goalProgress = computed(() => {
  //const entries = Object.values(journalStore.entries).slice(-7)

  return [
    {
      id: 'sleep_goal',
      name: 'Objectif sommeil',
      icon: '😴',
      progress: Math.min((healthScore.value.sleep / 80) * 100, 100),
      description: `Dormir ${journalStore.goals.sleepHours}h par nuit`,
      suggestion: healthScore.value.sleep < 60 ? 'Essayez de vous coucher 30min plus tôt' : null
    },
    {
      id: 'activity_goal',
      name: 'Objectif activité',
      icon: '🏃',
      progress: Math.min((healthScore.value.activity / 80) * 100, 100),
      description: `${journalStore.goals.activityMinutes} minutes d'activité par jour`,
      suggestion: healthScore.value.activity < 60 ? 'Ajoutez 15min de marche quotidienne' : null
    },
    {
      id: 'mood_goal',
      name: 'Objectif bien-être',
      icon: '😊',
      progress: Math.min((healthScore.value.mood / 80) * 100, 100),
      description: `Maintenir une humeur ≥ ${journalStore.goals.dailyMoodTarget}`,
      suggestion: healthScore.value.mood < 60 ? 'Pratiquez 5min de méditation quotidienne' : null
    },
    {
      id: 'consistency_goal',
      name: 'Régularité',
      icon: '🔥',
      progress: Math.min((journalStore.getCurrentStreak / 30) * 100, 100),
      description: 'Maintenir une série de 30 jours',
      suggestion: journalStore.getCurrentStreak < 7 ? 'Focus sur une semaine complète' : null
    }
  ]
})

// Tendances détectées
const trends = computed(() => {
  const entries = Object.values(journalStore.entries).slice(-14) // 2 semaines
  if (entries.length < 7) return []

  const trends = []
  const firstWeek = entries.slice(0, 7)
  const secondWeek = entries.slice(-7)

  // Tendance sommeil
  const firstWeekSleep = firstWeek
    .filter(e => e.sleep?.bedTime && e.sleep?.wakeTime)
    .reduce((sum, e) => sum + journalStore.getSleepDuration(e), 0) / 7
  const secondWeekSleep = secondWeek
    .filter(e => e.sleep?.bedTime && e.sleep?.wakeTime)
    .reduce((sum, e) => sum + journalStore.getSleepDuration(e), 0) / 7

  if (Math.abs(secondWeekSleep - firstWeekSleep) > 0.5) {
    trends.push({
      id: 'sleep_trend',
      title: 'Durée de sommeil',
      icon: '😴',
      direction: secondWeekSleep > firstWeekSleep ? 'up' : 'down',
      description: `${secondWeekSleep > firstWeekSleep ? 'Amélioration' : 'Diminution'} de ${Math.abs(secondWeekSleep - firstWeekSleep).toFixed(1)}h cette semaine`
    })
  }

  // Tendance humeur
  const firstWeekMood = firstWeek
    .filter(e => e.mood?.score > 0)
    .reduce((sum, e) => sum + e.mood.score, 0) / firstWeek.filter(e => e.mood?.score > 0).length || 0
  const secondWeekMood = secondWeek
    .filter(e => e.mood?.score > 0)
    .reduce((sum, e) => sum + e.mood.score, 0) / secondWeek.filter(e => e.mood?.score > 0).length || 0

  if (Math.abs(secondWeekMood - firstWeekMood) > 1) {
    trends.push({
      id: 'mood_trend',
      title: 'Humeur générale',
      icon: '😊',
      direction: secondWeekMood > firstWeekMood ? 'up' : 'down',
      description: `${secondWeekMood > firstWeekMood ? 'Amélioration' : 'Baisse'} de ${Math.abs(secondWeekMood - firstWeekMood).toFixed(1)} points cette semaine`
    })
  }

  return trends
})

// Actions sur les suggestions
function applySuggestion(suggestion, action) {
  console.log('Applying suggestion:', suggestion.title, 'Action:', action.label)

  switch (action.id) {
    case 'earlier_bedtime':
      // Logique pour ajuster l'heure de coucher
      alert('Rappel programmé pour vous coucher plus tôt !')
      break
    case 'sleep_reminder':
      // Activer le rappel de coucher
      alert('Rappel de coucher activé !')
      break
    case 'start_walking':
      // Ajouter une activité de marche
      alert('Activité de marche ajoutée à votre routine !')
      break
    case 'activity_reminder':
      // Activer le rappel d'activité
      alert('Rappel d\'activité quotidien activé !')
      break
    case 'gratitude':
      // Démarrer journal de gratitude
      alert('Journal de gratitude ajouté à vos habitudes !')
      break
    case 'social_contact':
      // Planifier activité sociale
      alert('N\'oubliez pas de planifier une activité sociale cette semaine !')
      break
    case 'simple_start':
      // Redémarrer simplement
      alert('Parfait ! Commencez par remplir votre journal aujourd\'hui.')
      break
    case 'start_food_tracking':
      // Démarrer suivi alimentaire
      alert('Suivi alimentaire activé ! Ajoutez vos repas dès aujourd\'hui.')
      break
    case 'sleep_hygiene':
      // Guide hygiène du sommeil
      showSleepGuide()
      break
    case 'relaxation':
      // Techniques de relaxation
      showRelaxationTechniques()
      break
    case 'nutrition_tips':
      // Conseils nutrition
      showNutritionTips()
      break
    case 'motivation':
      // Conseils motivation
      showMotivationTips()
      break
    default:
      alert('Action en cours de développement !')
  }
}

function showSleepGuide() {
  alert(`Guide d'hygiène du sommeil :

1. 🕘 Couchez-vous et levez-vous à heures fixes
2. 📱 Évitez les écrans 1h avant le coucher
3. 🌡️ Maintenez une température fraîche (18-20°C)
4. ☕ Évitez la caféine après 14h
5. 🧘 Créez une routine relaxante avant le coucher
6. 🛏️ Réservez le lit au sommeil uniquement
7. 🌞 Exposez-vous à la lumière naturelle le matin`)
}

function showRelaxationTechniques() {
  alert(`Techniques de relaxation pour mieux dormir :

🫁 Respiration 4-7-8 :
- Inspirez 4 secondes
- Retenez 7 secondes
- Expirez 8 secondes
- Répétez 4 fois

🧘 Méditation guidée :
- 10 minutes avant le coucher
- Concentrez-vous sur votre respiration
- Laissez passer les pensées sans vous y attacher

💪 Relaxation musculaire progressive :
- Contractez puis relâchez chaque groupe musculaire
- Commencez par les pieds, remontez jusqu'à la tête`)
}

function showNutritionTips() {
  alert(`Conseils nutrition pour votre bien-être :

🥗 Équilibre des repas :
- 1/2 assiette de légumes
- 1/4 de protéines
- 1/4 de féculents complets

💧 Hydratation :
- 1,5 à 2L d'eau par jour
- Un verre au réveil
- Avant chaque repas

⏰ Rythme des repas :
- 3 repas réguliers
- 1-2 collations si besoin
- Dîner léger 3h avant le coucher

🍎 Privilégiez :
- Fruits et légumes de saison
- Céréales complètes
- Poissons gras 2x/semaine`)
}

function showMotivationTips() {
  alert(`Conseils pour rester motivé :

🎯 Fixez des objectifs SMART :
- Spécifiques, Mesurables, Atteignables
- Commencez petit (5 min/jour)

🏆 Célébrez les petites victoires :
- Chaque jour compte
- Récompensez-vous (sans excès)

👥 Trouvez du soutien :
- Partagez vos objectifs
- Rejoignez une communauté

📝 Tenez un journal :
- Notez vos progrès
- Identifiez ce qui fonctionne

🔄 Soyez flexible :
- Acceptez les rechutes
- Recommencez sans culpabiliser`)
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

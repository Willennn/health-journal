<template>
  <div class="space-y-6">
    <!-- En-tête avec période sélectionnée -->
    <div class="card p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h2 class="text-2xl font-bold text-theme-primary mb-2">📊 Analytics</h2>
          <p class="text-theme-muted">Analyse détaillée de vos données de santé</p>
        </div>
        
        <!-- Sélecteur de période -->
        <div class="flex space-x-2">
          <button
            v-for="period in periods"
            :key="period.value"
            @click="selectedPeriod = period.value"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="selectedPeriod === period.value 
              ? 'bg-emerald-500 text-white' 
              : 'bg-theme-card text-theme-muted hover:text-theme-primary'"
          >
            {{ period.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Métriques rapides -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Humeur moyenne -->
      <div class="card p-6 text-center">
        <div class="text-3xl mb-2">😊</div>
        <div class="text-2xl font-bold text-theme-primary mb-1">
          {{ analytics.averageMood.toFixed(1) }}
        </div>
        <div class="text-sm text-theme-muted">Humeur moyenne</div>
        <div class="text-xs" :class="analytics.moodTrend > 0 ? 'text-emerald-500' : analytics.moodTrend < 0 ? 'text-red-500' : 'text-theme-muted'">
          {{ analytics.moodTrend > 0 ? '↗️' : analytics.moodTrend < 0 ? '↘️' : '→' }}
          {{ Math.abs(analytics.moodTrend).toFixed(1) }}
        </div>
      </div>

      <!-- Sommeil moyen -->
      <div class="card p-6 text-center">
        <div class="text-3xl mb-2">😴</div>
        <div class="text-2xl font-bold text-theme-primary mb-1">
          {{ analytics.averageSleep.toFixed(1) }}h
        </div>
        <div class="text-sm text-theme-muted">Sommeil moyen</div>
        <div class="text-xs" :class="analytics.sleepTrend > 0 ? 'text-emerald-500' : analytics.sleepTrend < 0 ? 'text-red-500' : 'text-theme-muted'">
          {{ analytics.sleepTrend > 0 ? '↗️' : analytics.sleepTrend < 0 ? '↘️' : '→' }}
          {{ Math.abs(analytics.sleepTrend * 60).toFixed(0) }}min
        </div>
      </div>

      <!-- Activité totale -->
      <div class="card p-6 text-center">
        <div class="text-3xl mb-2">⚡</div>
        <div class="text-2xl font-bold text-theme-primary mb-1">
          {{ analytics.totalActivity }}
        </div>
        <div class="text-sm text-theme-muted">Minutes d'activité</div>
        <div class="text-xs text-theme-muted">
          {{ filteredEntries.length > 0 ? (analytics.totalActivity / filteredEntries.length).toFixed(0) : 0 }}min/jour
        </div>
      </div>

      <!-- Séries -->
      <div class="card p-6 text-center">
        <div class="text-3xl mb-2">🔥</div>
        <div class="text-2xl font-bold text-theme-primary mb-1">
          {{ journalStore.getCurrentStreak }}
        </div>
        <div class="text-sm text-theme-muted">Série actuelle</div>
        <div class="text-xs text-theme-muted">
          Record: {{ journalStore.achievements.streaks.best }}
        </div>
      </div>
    </div>

    <!-- Graphiques principaux -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Évolution de l'humeur -->
      <div class="card p-6">
        <h3 class="text-xl font-semibold text-theme-primary mb-4">Évolution de l'humeur</h3>
        <div class="h-64">
          <Line
            v-if="chartData.mood.labels.length > 0"
            :data="chartData.mood"
            :options="chartOptions.line"
          />
          <div v-else class="flex items-center justify-center h-full text-theme-muted">
            Pas assez de données
          </div>
        </div>
      </div>

      <!-- Évolution du sommeil -->
      <div class="card p-6">
        <h3 class="text-xl font-semibold text-theme-primary mb-4">Qualité du sommeil</h3>
        <div class="h-64">
          <Line
            v-if="chartData.sleep.labels.length > 0"
            :data="chartData.sleep"
            :options="chartOptions.line"
          />
          <div v-else class="flex items-center justify-center h-full text-theme-muted">
            Pas assez de données
          </div>
        </div>
      </div>
    </div>

    <!-- Graphiques secondaires -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Répartition des activités -->
      <div class="card p-6">
        <h3 class="text-xl font-semibold text-theme-primary mb-4">Répartition des activités</h3>
        <div class="h-64">
          <Doughnut
            v-if="chartData.activities.labels.length > 0"
            :data="chartData.activities"
            :options="chartOptions.doughnut"
          />
          <div v-else class="flex items-center justify-center h-full text-theme-muted">
            Aucune activité enregistrée
          </div>
        </div>
      </div>

      <!-- Heatmap de progression -->
      <div class="card p-6">
        <h3 class="text-xl font-semibold text-theme-primary mb-4">Progression quotidienne</h3>
        <div class="h-64">
          <Bar
            v-if="chartData.progress.labels.length > 0"
            :data="chartData.progress"
            :options="chartOptions.bar"
          />
          <div v-else class="flex items-center justify-center h-full text-theme-muted">
            Pas assez de données
          </div>
        </div>
      </div>
    </div>

    <!-- Corrélations -->
    <div class="card p-6">
      <h3 class="text-xl font-semibold text-theme-primary mb-4">Corrélations détectées</h3>
      <div v-if="correlations.length > 0" class="space-y-4">
        <div
          v-for="correlation in correlations"
          :key="correlation.id"
          class="p-4 rounded-lg"
          :class="correlation.strength > 0.3 ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-yellow-50 dark:bg-yellow-900/20'"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3">
              <div class="text-2xl">{{ correlation.icon }}</div>
              <div>
                <div class="font-medium text-theme-primary">{{ correlation.title }}</div>
                <div class="text-sm text-theme-muted">{{ correlation.description }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-lg font-bold" :class="correlation.strength > 0.3 ? 'text-emerald-600' : 'text-yellow-600'">
                {{ (correlation.strength * 100).toFixed(0) }}%
              </div>
              <div class="text-xs text-theme-muted">Force</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8 text-theme-muted">
        Pas assez de données pour détecter des corrélations
      </div>
    </div>

    <!-- Export -->
    <div class="card p-6">
      <h3 class="text-xl font-semibold text-theme-primary mb-4">Export des données</h3>
      <div class="flex flex-wrap gap-4">
        <button
          @click="exportToPDF"
          class="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <span>📄</span>
          <span>Export PDF</span>
        </button>
        <button
          @click="exportToCSV"
          class="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <span>📊</span>
          <span>Export CSV</span>
        </button>
        <button
          @click="exportToJSON"
          class="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <span>⚙️</span>
          <span>Export JSON</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useJournalStore } from '@/stores/journal'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js'
import { Line, Doughnut, Bar } from 'vue-chartjs'

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
)

const journalStore = useJournalStore()
const selectedPeriod = ref('30')

const periods = [
  { value: '7', label: '7 jours' },
  { value: '30', label: '30 jours' },
  { value: '90', label: '3 mois' },
  { value: 'all', label: 'Tout' }
]

// Données filtrées selon la période
const filteredEntries = computed(() => {
  const entries = Object.entries(journalStore.entries)
  if (selectedPeriod.value === 'all') return entries

  const days = parseInt(selectedPeriod.value)
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - days)

  return entries.filter(([dateString]) => {
    const entryDate = new Date(dateString)
    return entryDate >= cutoffDate
  })
})

// Analytics calculées
const analytics = computed(() => {
  const entries = filteredEntries.value

  if (entries.length === 0) {
    return {
      averageMood: 0,
      averageSleep: 0,
      totalActivity: 0,
      moodTrend: 0,
      sleepTrend: 0
    }
  }

  // Humeur moyenne
  const moodScores = entries
    .map(([, entry]) => entry.mood?.score)
    .filter(score => score > 0)
  const averageMood = moodScores.length > 0 
    ? moodScores.reduce((a, b) => a + b, 0) / moodScores.length 
    : 0

  // Sommeil moyen
  const sleepDurations = entries
    .map(([, entry]) => journalStore.getSleepDuration(entry))
    .filter(duration => duration > 0)
  const averageSleep = sleepDurations.length > 0
    ? sleepDurations.reduce((a, b) => a + b, 0) / sleepDurations.length
    : 0

  // Activité totale
  const totalActivity = entries.reduce((total, [, entry]) => {
    return total + journalStore.getTotalActivityMinutes(entry)
  }, 0)

  // Tendances (comparaison première moitié vs deuxième moitié)
  const halfPoint = Math.floor(entries.length / 2)
  const firstHalf = entries.slice(0, halfPoint)
  const secondHalf = entries.slice(halfPoint)

  const firstHalfMood = firstHalf
    .map(([, entry]) => entry.mood?.score)
    .filter(score => score > 0)
  const secondHalfMood = secondHalf
    .map(([, entry]) => entry.mood?.score)
    .filter(score => score > 0)

  const moodTrend = firstHalfMood.length > 0 && secondHalfMood.length > 0
    ? (secondHalfMood.reduce((a, b) => a + b, 0) / secondHalfMood.length) - 
      (firstHalfMood.reduce((a, b) => a + b, 0) / firstHalfMood.length)
    : 0

  const firstHalfSleep = firstHalf
    .map(([, entry]) => journalStore.getSleepDuration(entry))
    .filter(duration => duration > 0)
  const secondHalfSleep = secondHalf
    .map(([, entry]) => journalStore.getSleepDuration(entry))
    .filter(duration => duration > 0)

  const sleepTrend = firstHalfSleep.length > 0 && secondHalfSleep.length > 0
    ? (secondHalfSleep.reduce((a, b) => a + b, 0) / secondHalfSleep.length) - 
      (firstHalfSleep.reduce((a, b) => a + b, 0) / firstHalfSleep.length)
    : 0

  return {
    averageMood,
    averageSleep,
    totalActivity,
    moodTrend,
    sleepTrend
  }
})

// Données pour les graphiques
const chartData = computed(() => {
  const entries = filteredEntries.value
  const sortedEntries = entries.sort(([a], [b]) => new Date(a) - new Date(b))

  // Données pour le graphique d'humeur
  const moodData = sortedEntries
    .filter(([, entry]) => entry.mood?.score > 0)
    .map(([date, entry]) => ({
      date: new Date(date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
      value: entry.mood.score
    }))

  // Données pour le graphique de sommeil
  const sleepData = sortedEntries
    .filter(([, entry]) => entry.sleep?.bedTime && entry.sleep?.wakeTime)
    .map(([date, entry]) => ({
      date: new Date(date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
      value: journalStore.getSleepDuration(entry)
    }))

  // Répartition des activités
  const activityStats = {}
  sortedEntries.forEach(([, entry]) => {
    if (entry.activity) {
      entry.activity.forEach(activity => {
        activityStats[activity.type] = (activityStats[activity.type] || 0) + activity.duration
      })
    }
  })

  // Données de progression quotidienne
  const progressData = sortedEntries.map(([date, entry]) => {
    let score = 0
    if (entry.sleep?.bedTime && entry.sleep?.wakeTime) score += 25
    if (entry.mood?.score > 0) score += 25
    if (entry.activity?.length > 0) score += 25
    if (entry.food?.length > 0) score += 25
    
    return {
      date: new Date(date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
      value: score
    }
  })

  return {
    mood: {
      labels: moodData.map(d => d.date),
      datasets: [{
        label: 'Humeur',
        data: moodData.map(d => d.value),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4
      }]
    },
    sleep: {
      labels: sleepData.map(d => d.date),
      datasets: [{
        label: 'Heures de sommeil',
        data: sleepData.map(d => d.value),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }]
    },
    activities: {
      labels: Object.keys(activityStats),
      datasets: [{
        data: Object.values(activityStats),
        backgroundColor: [
          'rgba(34, 197, 94, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
          'rgba(168, 85, 247, 0.8)',
          'rgba(236, 72, 153, 0.8)'
        ]
      }]
    },
    progress: {
      labels: progressData.map(d => d.date),
      datasets: [{
        label: 'Progression (%)',
        data: progressData.map(d => d.value),
        backgroundColor: progressData.map(d => {
          if (d.value >= 75) return 'rgba(34, 197, 94, 0.8)'
          if (d.value >= 50) return 'rgba(245, 158, 11, 0.8)'
          if (d.value >= 25) return 'rgba(249, 115, 22, 0.8)'
          return 'rgba(239, 68, 68, 0.8)'
        })
      }]
    }
  }
})

// Options pour les graphiques
const chartOptions = {
  line: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        }
      }
    }
  },
  doughnut: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  },
  bar: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.1)'
        }
      }
    }
  }
}

// Corrélations automatiques
const correlations = computed(() => {
  const entries = filteredEntries.value
  if (entries.length < 7) return []

  const correlations = []

  // Corrélation sommeil-humeur
  const sleepMoodData = entries
    .filter(([, entry]) => entry.mood?.score > 0 && entry.sleep?.bedTime && entry.sleep?.wakeTime)
    .map(([, entry]) => ({
      sleep: journalStore.getSleepDuration(entry),
      mood: entry.mood.score
    }))

  if (sleepMoodData.length >= 5) {
    const correlation = calculateCorrelation(
      sleepMoodData.map(d => d.sleep),
      sleepMoodData.map(d => d.mood)
    )
    
    if (Math.abs(correlation) > 0.2) {
      correlations.push({
        id: 'sleep-mood',
        title: 'Sommeil et Humeur',
        description: correlation > 0 
          ? 'Plus vous dormez, meilleure est votre humeur'
          : 'Un sommeil excessif semble affecter négativement votre humeur',
        strength: Math.abs(correlation),
        icon: '😴'
      })
    }
  }

  // Corrélation activité-humeur
  const activityMoodData = entries
    .filter(([, entry]) => entry.mood?.score > 0)
    .map(([, entry]) => ({
      activity: journalStore.getTotalActivityMinutes(entry),
      mood: entry.mood.score
    }))

  if (activityMoodData.length >= 5) {
    const correlation = calculateCorrelation(
      activityMoodData.map(d => d.activity),
      activityMoodData.map(d => d.mood)
    )
    
    if (Math.abs(correlation) > 0.2) {
      correlations.push({
        id: 'activity-mood',
        title: 'Activité et Humeur',
        description: correlation > 0 
          ? 'Plus vous êtes actif, meilleure est votre humeur'
          : 'L\'activité intense semble parfois affecter négativement votre humeur',
        strength: Math.abs(correlation),
        icon: '⚡'
      })
    }
  }

  // Corrélation activité-sommeil
  const activitySleepData = entries
    .filter(([, entry]) => entry.sleep?.bedTime && entry.sleep?.wakeTime)
    .map(([, entry]) => ({
      activity: journalStore.getTotalActivityMinutes(entry),
      sleep: journalStore.getSleepDuration(entry)
    }))

  if (activitySleepData.length >= 5) {
    const correlation = calculateCorrelation(
      activitySleepData.map(d => d.activity),
      activitySleepData.map(d => d.sleep)
    )
    
    if (Math.abs(correlation) > 0.2) {
      correlations.push({
        id: 'activity-sleep',
        title: 'Activité et Sommeil',
        description: correlation > 0 
          ? 'Plus vous êtes actif, plus vous dormez'
          : 'L\'activité intense semble réduire votre temps de sommeil',
        strength: Math.abs(correlation),
        icon: '🏃'
      })
    }
  }

  return correlations.sort((a, b) => b.strength - a.strength)
})

// Fonction de calcul de corrélation
function calculateCorrelation(x, y) {
  const n = x.length
  if (n === 0) return 0

  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)
  const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0)

  const numerator = n * sumXY - sumX * sumY
  const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY))

  return denominator === 0 ? 0 : numerator / denominator
}

// Fonctions d'export
const exportToPDF = () => {
  // Création d'un rapport PDF simple
  const reportData = {
    period: selectedPeriod.value,
    analytics: analytics.value,
    correlations: correlations.value,
    entries: filteredEntries.value.length
  }

  const content = `
RAPPORT D'ANALYSE - JOURNAL DE SANTÉ
==========================================

Période analysée: ${periods.find(p => p.value === selectedPeriod.value)?.label}
Nombre d'entrées: ${reportData.entries}

MÉTRIQUES PRINCIPALES
--------------------
• Humeur moyenne: ${reportData.analytics.averageMood.toFixed(1)}/10
• Sommeil moyen: ${reportData.analytics.averageSleep.toFixed(1)}h
• Activité totale: ${reportData.analytics.totalActivity} minutes
• Série actuelle: ${journalStore.getCurrentStreak} jours

CORRÉLATIONS DÉTECTÉES
---------------------
${reportData.correlations.map(c => `• ${c.title}: ${c.description} (${(c.strength * 100).toFixed(0)}%)`).join('\n')}

Rapport généré le ${new Date().toLocaleDateString('fr-FR')}
`

  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `rapport-sante-${new Date().toISOString().split('T')[0]}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

const exportToCSV = () => {
  const entries = filteredEntries.value
  const csvContent = [
    'Date,Humeur,Sommeil_Heures,Activite_Minutes,Progression_Pourcent',
    ...entries.map(([date, entry]) => {
      const mood = entry.mood?.score || ''
      const sleep = entry.sleep?.bedTime && entry.sleep?.wakeTime 
        ? journalStore.getSleepDuration(entry).toFixed(1) 
        : ''
      const activity = journalStore.getTotalActivityMinutes(entry)
      
      let progress = 0
      if (entry.sleep?.bedTime && entry.sleep?.wakeTime) progress += 25
      if (entry.mood?.score > 0) progress += 25
      if (entry.activity?.length > 0) progress += 25
      if (entry.food?.length > 0) progress += 25

      return `${date},${mood},${sleep},${activity},${progress}`
    })
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `donnees-sante-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const exportToJSON = () => {
  const exportData = {
    exportDate: new Date().toISOString(),
    period: selectedPeriod.value,
    analytics: analytics.value,
    correlations: correlations.value,
    entries: Object.fromEntries(filteredEntries.value)
  }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `donnees-sante-complete-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
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
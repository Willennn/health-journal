<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="card p-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-bold text-theme-primary mb-2">🔔 Notifications & Rappels</h2>
          <p class="text-theme-muted">Configurez vos rappels pour maintenir vos habitudes</p>
        </div>
        <div class="flex items-center space-x-2">
          <span class="text-sm text-theme-muted">Notifications</span>
          <button
            @click="toggleGlobalNotifications"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              settings.enabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
            ]"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                settings.enabled ? 'translate-x-6' : 'translate-x-1'
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Notifications en attente -->
    <div v-if="pendingNotifications.length > 0" class="card p-6">
      <h3 class="text-lg font-semibold text-theme-primary mb-4 flex items-center">
        <span class="mr-2">📬</span>
        Notifications en attente ({{ pendingNotifications.length }})
      </h3>
      <div class="space-y-3">
        <div
          v-for="notification in pendingNotifications"
          :key="notification.id"
          class="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
        >
          <div class="text-2xl">{{ notification.icon }}</div>
          <div class="flex-1">
            <h4 class="font-medium text-theme-primary">{{ notification.title }}</h4>
            <p class="text-sm text-theme-muted mt-1">{{ notification.message }}</p>
            <div class="text-xs text-theme-muted mt-2">
              {{ formatTime(notification.scheduledTime) }}
            </div>
          </div>
          <div class="flex space-x-2">
            <button
              @click="completeNotification(notification.id)"
              class="px-3 py-1 bg-emerald-500 text-white text-xs rounded hover:bg-emerald-600 transition-colors"
            >
              ✓ Fait
            </button>
            <button
              @click="dismissNotification(notification.id)"
              class="px-3 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600 transition-colors"
            >
              Ignorer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Configuration des rappels -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-theme-primary mb-6">⏰ Configuration des rappels</h3>
      
      <div class="space-y-6">
        <!-- Rappel journal quotidien -->
        <div class="p-4 border border-theme rounded-lg">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="text-2xl">📝</div>
              <div>
                <h4 class="font-medium text-theme-primary">Rappel journal quotidien</h4>
                <p class="text-sm text-theme-muted">Rappelez-moi de remplir mon journal</p>
              </div>
            </div>
            <button
              @click="toggleReminder('daily')"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                settings.reminders.daily.enabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  settings.reminders.daily.enabled ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
          
          <div v-if="settings.reminders.daily.enabled" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-theme-primary mb-2">Heure</label>
                <input
                  v-model="settings.reminders.daily.time"
                  type="time"
                  class="w-full px-3 py-2 border border-theme rounded-lg bg-theme-card text-theme-primary"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-theme-primary mb-2">Fréquence</label>
                <select
                  v-model="settings.reminders.daily.frequency"
                  class="w-full px-3 py-2 border border-theme rounded-lg bg-theme-card text-theme-primary"
                >
                  <option value="daily">Tous les jours</option>
                  <option value="weekdays">Jours de semaine</option>
                  <option value="weekends">Week-ends</option>
                </select>
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-theme-primary mb-2">Message personnalisé</label>
              <input
                v-model="settings.reminders.daily.message"
                type="text"
                placeholder="Ex: N'oubliez pas de remplir votre journal !"
                class="w-full px-3 py-2 border border-theme rounded-lg bg-theme-card text-theme-primary"
              >
            </div>
          </div>
        </div>

        <!-- Rappel activité physique -->
        <div class="p-4 border border-theme rounded-lg">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="text-2xl">🏃</div>
              <div>
                <h4 class="font-medium text-theme-primary">Rappel activité physique</h4>
                <p class="text-sm text-theme-muted">Rappelez-moi de faire de l'exercice</p>
              </div>
            </div>
            <button
              @click="toggleReminder('activity')"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                settings.reminders.activity.enabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  settings.reminders.activity.enabled ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
          
          <div v-if="settings.reminders.activity.enabled" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-theme-primary mb-2">Heure</label>
                <input
                  v-model="settings.reminders.activity.time"
                  type="time"
                  class="w-full px-3 py-2 border border-theme rounded-lg bg-theme-card text-theme-primary"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-theme-primary mb-2">Objectif (minutes)</label>
                <input
                  v-model.number="settings.reminders.activity.target"
                  type="number"
                  min="5"
                  max="180"
                  class="w-full px-3 py-2 border border-theme rounded-lg bg-theme-card text-theme-primary"
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Rappel coucher -->
        <div class="p-4 border border-theme rounded-lg">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="text-2xl">😴</div>
              <div>
                <h4 class="font-medium text-theme-primary">Rappel coucher</h4>
                <p class="text-sm text-theme-muted">Rappelez-moi d'aller me coucher</p>
              </div>
            </div>
            <button
              @click="toggleReminder('bedtime')"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                settings.reminders.bedtime.enabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  settings.reminders.bedtime.enabled ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
          
          <div v-if="settings.reminders.bedtime.enabled" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-theme-primary mb-2">Heure de coucher</label>
                <input
                  v-model="settings.reminders.bedtime.time"
                  type="time"
                  class="w-full px-3 py-2 border border-theme rounded-lg bg-theme-card text-theme-primary"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-theme-primary mb-2">Rappel avant (min)</label>
                <select
                  v-model="settings.reminders.bedtime.beforeMinutes"
                  class="w-full px-3 py-2 border border-theme rounded-lg bg-theme-card text-theme-primary"
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="60">1 heure</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Rappel hydratation -->
        <div class="p-4 border border-theme rounded-lg">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center space-x-3">
              <div class="text-2xl">💧</div>
              <div>
                <h4 class="font-medium text-theme-primary">Rappel hydratation</h4>
                <p class="text-sm text-theme-muted">Rappelez-moi de boire de l'eau</p>
              </div>
            </div>
            <button
              @click="toggleReminder('hydration')"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                settings.reminders.hydration.enabled ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  settings.reminders.hydration.enabled ? 'translate-x-6' : 'translate-x-1'
                ]"
              />
            </button>
          </div>
          
          <div v-if="settings.reminders.hydration.enabled" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-theme-primary mb-2">Intervalle</label>
                <select
                  v-model="settings.reminders.hydration.interval"
                  class="w-full px-3 py-2 border border-theme rounded-lg bg-theme-card text-theme-primary"
                >
                  <option value="30">30 minutes</option>
                  <option value="60">1 heure</option>
                  <option value="120">2 heures</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-theme-primary mb-2">Heures actives</label>
                <div class="flex space-x-2">
                  <input
                    v-model="settings.reminders.hydration.startTime"
                    type="time"
                    class="flex-1 px-2 py-2 border border-theme rounded bg-theme-card text-theme-primary text-sm"
                  >
                  <span class="text-theme-muted self-center">à</span>
                  <input
                    v-model="settings.reminders.hydration.endTime"
                    type="time"
                    class="flex-1 px-2 py-2 border border-theme rounded bg-theme-card text-theme-primary text-sm"
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Historique des notifications -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-theme-primary mb-4">📊 Statistiques des rappels</h3>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div class="text-center p-4 bg-theme-secondary rounded-lg">
          <div class="text-2xl font-bold text-emerald-600">{{ stats.totalSent }}</div>
          <div class="text-sm text-theme-muted">Envoyées</div>
        </div>
        <div class="text-center p-4 bg-theme-secondary rounded-lg">
          <div class="text-2xl font-bold text-blue-600">{{ stats.completed }}</div>
          <div class="text-sm text-theme-muted">Complétées</div>
        </div>
        <div class="text-center p-4 bg-theme-secondary rounded-lg">
          <div class="text-2xl font-bold text-orange-600">{{ stats.dismissed }}</div>
          <div class="text-sm text-theme-muted">Ignorées</div>
        </div>
        <div class="text-center p-4 bg-theme-secondary rounded-lg">
          <div class="text-2xl font-bold text-purple-600">{{ stats.successRate }}%</div>
          <div class="text-sm text-theme-muted">Taux de succès</div>
        </div>
      </div>

      <!-- Graphique simple des performances -->
      <div class="space-y-2">
        <div class="flex justify-between text-sm text-theme-muted">
          <span>Performance cette semaine</span>
          <span>{{ stats.weeklyPerformance.length }} rappels</span>
        </div>
        <div class="flex space-x-1 h-6">
          <div
            v-for="(day, index) in stats.weeklyPerformance"
            :key="index"
            :class="[
              'flex-1 rounded-sm',
              day.completed ? 'bg-emerald-500' : day.sent ? 'bg-orange-300' : 'bg-gray-200 dark:bg-gray-700'
            ]"
            :title="`${day.date}: ${day.completed ? 'Complété' : day.sent ? 'Envoyé' : 'Aucun'}`"
          ></div>
        </div>
        <div class="flex justify-between text-xs text-theme-muted">
          <span>Lun</span>
          <span>Mar</span>
          <span>Mer</span>
          <span>Jeu</span>
          <span>Ven</span>
          <span>Sam</span>
          <span>Dim</span>
        </div>
      </div>
    </div>

    <!-- Suggestions intelligentes -->
    <div v-if="suggestions.length > 0" class="card p-6">
      <h3 class="text-lg font-semibold text-theme-primary mb-4 flex items-center">
        <span class="mr-2">🤖</span>
        Suggestions intelligentes
      </h3>
      <div class="space-y-3">
        <div
          v-for="suggestion in suggestions"
          :key="suggestion.id"
          class="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg"
        >
          <div class="text-2xl">{{ suggestion.icon }}</div>
          <div class="flex-1">
            <h4 class="font-medium text-theme-primary">{{ suggestion.title }}</h4>
            <p class="text-sm text-theme-muted mt-1">{{ suggestion.description }}</p>
            <button
              v-if="suggestion.action"
              @click="applySuggestion(suggestion)"
              class="mt-2 px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 transition-colors"
            >
              {{ suggestion.actionText }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions rapides -->
    <div class="card p-6">
      <h3 class="text-lg font-semibold text-theme-primary mb-4">⚡ Actions rapides</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          @click="sendTestNotification"
          class="flex flex-col items-center p-4 border border-theme rounded-lg hover:bg-theme-secondary transition-colors"
        >
          <div class="text-2xl mb-2">🧪</div>
          <div class="text-sm font-medium text-theme-primary">Test notification</div>
        </button>
        
        <button
          @click="requestNotificationPermission"
          class="flex flex-col items-center p-4 border border-theme rounded-lg hover:bg-theme-secondary transition-colors"
        >
          <div class="text-2xl mb-2">🔔</div>
          <div class="text-sm font-medium text-theme-primary">Autoriser notifications</div>
        </button>
        
        <button
          @click="exportSettings"
          class="flex flex-col items-center p-4 border border-theme rounded-lg hover:bg-theme-secondary transition-colors"
        >
          <div class="text-2xl mb-2">📥</div>
          <div class="text-sm font-medium text-theme-primary">Exporter config</div>
        </button>
        
        <button
          @click="resetAllReminders"
          class="flex flex-col items-center p-4 border border-theme rounded-lg hover:bg-theme-secondary transition-colors text-red-600"
        >
          <div class="text-2xl mb-2">🔄</div>
          <div class="text-sm font-medium">Reset complet</div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useJournalStore } from '@/stores/journal'

const journalStore = useJournalStore()

// État des paramètres de notification
const settings = ref({
  enabled: true,
  reminders: {
    daily: {
      enabled: true,
      time: '20:00',
      frequency: 'daily',
      message: 'Il est temps de remplir votre journal de santé !'
    },
    activity: {
      enabled: false,
      time: '18:00',
      target: 30
    },
    bedtime: {
      enabled: false,
      time: '22:00',
      beforeMinutes: 30
    },
    hydration: {
      enabled: false,
      interval: 60,
      startTime: '08:00',
      endTime: '22:00'
    }
  }
})

// Notifications en attente
const pendingNotifications = ref([])

// Statistiques
const stats = ref({
  totalSent: 42,
  completed: 28,
  dismissed: 14,
  successRate: 67,
  weeklyPerformance: [
    { date: 'Lun', sent: true, completed: true },
    { date: 'Mar', sent: true, completed: false },
    { date: 'Mer', sent: true, completed: true },
    { date: 'Jeu', sent: false, completed: false },
    { date: 'Ven', sent: true, completed: true },
    { date: 'Sam', sent: true, completed: true },
    { date: 'Dim', sent: true, completed: false }
  ]
})

// Suggestions intelligentes
const suggestions = computed(() => {
  const suggestions = []
  const currentHour = new Date().getHours()
  
  // Suggestion basée sur l'heure
  if (currentHour >= 22 && !settings.value.reminders.bedtime.enabled) {
    suggestions.push({
      id: 'enable_bedtime',
      title: 'Activez le rappel de coucher',
      description: 'Il est tard ! Un rappel de coucher peut vous aider à maintenir un rythme de sommeil régulier.',
      icon: '😴',
      action: 'enable_bedtime',
      actionText: 'Activer'
    })
  }
  
  // Suggestion basée sur les statistiques
  if (stats.value.successRate < 50) {
    suggestions.push({
      id: 'adjust_frequency',
      title: 'Réduisez la fréquence des rappels',
      description: 'Votre taux de succès est faible. Essayez de réduire le nombre de rappels pour éviter la fatigue.',
      icon: '📉',
      action: 'reduce_frequency',
      actionText: 'Optimiser'
    })
  }
  
  // Suggestion basée sur l'usage
  if (!settings.value.reminders.hydration.enabled) {
    suggestions.push({
      id: 'enable_hydration',
      title: 'Pensez à l\'hydratation',
      description: 'Les rappels d\'hydratation peuvent considérablement améliorer votre bien-être quotidien.',
      icon: '💧',
      action: 'enable_hydration',
      actionText: 'Essayer'
    })
  }
  
  return suggestions
})

// Intervalles pour les notifications
let notificationInterval = null

// Méthodes
function toggleGlobalNotifications() {
  settings.value.enabled = !settings.value.enabled
  if (settings.value.enabled) {
    requestNotificationPermission()
    scheduleNotifications()
  } else {
    clearAllIntervals()
  }
  saveSettings()
}

function toggleReminder(type) {
  settings.value.reminders[type].enabled = !settings.value.reminders[type].enabled
  if (settings.value.enabled && settings.value.reminders[type].enabled) {
    scheduleNotifications()
  }
  saveSettings()
}

function requestNotificationPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notifications autorisées')
      } else {
        console.log('Notifications refusées')
        settings.value.enabled = false
      }
    })
  }
}

function sendTestNotification() {
  if (!settings.value.enabled) {
    alert('Veuillez d\'abord activer les notifications')
    return
  }
  
  createNotification({
    title: '🧪 Test de notification',
    message: 'Votre système de notifications fonctionne parfaitement !',
    icon: '🎉',
    type: 'test'
  })
}

function createNotification(options) {
  const notification = {
    id: Date.now().toString(),
    title: options.title,
    message: options.message,
    icon: options.icon,
    type: options.type,
    scheduledTime: new Date(),
    ...options
  }
  
  pendingNotifications.value.unshift(notification)
  
  // Notification navigateur si autorisée
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(notification.title, {
      body: notification.message,
      icon: '/favicon.ico'
    })
  }
  
  // Auto-suppression après 5 minutes
  setTimeout(() => {
    dismissNotification(notification.id)
  }, 5 * 60 * 1000)
}

function completeNotification(id) {
  const index = pendingNotifications.value.findIndex(n => n.id === id)
  if (index !== -1) {
    pendingNotifications.value.splice(index, 1)
    stats.value.completed++
    updateStats()
  }
}

function dismissNotification(id) {
  const index = pendingNotifications.value.findIndex(n => n.id === id)
  if (index !== -1) {
    pendingNotifications.value.splice(index, 1)
    stats.value.dismissed++
    updateStats()
  }
}

function scheduleNotifications() {
  clearAllIntervals()
  
  if (!settings.value.enabled) return
  
  // Programmation du rappel quotidien
  if (settings.value.reminders.daily.enabled) {
    scheduleDaily()
  }
  
  // Programmation du rappel d'hydratation
  if (settings.value.reminders.hydration.enabled) {
    scheduleHydration()
  }
  
  // Programmation du rappel de coucher
  if (settings.value.reminders.bedtime.enabled) {
    scheduleBedtime()
  }
  
  // Programmation du rappel d'activité
  if (settings.value.reminders.activity.enabled) {
    scheduleActivity()
  }
}

function scheduleDaily() {
  const [hour, minute] = settings.value.reminders.daily.time.split(':').map(Number)
  const now = new Date()
  const scheduledTime = new Date()
  scheduledTime.setHours(hour, minute, 0, 0)
  
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1)
  }
  
  const timeUntil = scheduledTime.getTime() - now.getTime()
  
  setTimeout(() => {
    createNotification({
      title: '📝 Rappel journal',
      message: settings.value.reminders.daily.message,
      icon: '📝',
      type: 'daily'
    })
    // Reprogrammer pour le lendemain
    scheduleDaily()
  }, timeUntil)
}

function scheduleHydration() {
  const interval = settings.value.reminders.hydration.interval * 60 * 1000
  
  notificationInterval = setInterval(() => {
    const now = new Date()
    const currentTime = now.getHours() * 60 + now.getMinutes()
    const [startHour, startMin] = settings.value.reminders.hydration.startTime.split(':').map(Number)
    const [endHour, endMin] = settings.value.reminders.hydration.endTime.split(':').map(Number)
    const startTime = startHour * 60 + startMin
    const endTime = endHour * 60 + endMin
    
    if (currentTime >= startTime && currentTime <= endTime) {
      createNotification({
        title: '💧 Rappel hydratation',
        message: 'Il est temps de boire un verre d\'eau !',
        icon: '💧',
        type: 'hydration'
      })
    }
  }, interval)
}

function scheduleBedtime() {
  const [hour, minute] = settings.value.reminders.bedtime.time.split(':').map(Number)
  const beforeMinutes = settings.value.reminders.bedtime.beforeMinutes
  
  const scheduledTime = new Date()
  scheduledTime.setHours(hour, minute - beforeMinutes, 0, 0)
  
  const now = new Date()
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1)
  }
  
  const timeUntil = scheduledTime.getTime() - now.getTime()
  
  setTimeout(() => {
    createNotification({
      title: '😴 Rappel coucher',
      message: `Il sera temps de vous coucher dans ${beforeMinutes} minutes !`,
      icon: '😴',
      type: 'bedtime'
    })
    // Reprogrammer pour le lendemain
    scheduleBedtime()
  }, timeUntil)
}

function scheduleActivity() {
  const [hour, minute] = settings.value.reminders.activity.time.split(':').map(Number)
  const now = new Date()
  const scheduledTime = new Date()
  scheduledTime.setHours(hour, minute, 0, 0)
  
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1)
  }
  
  const timeUntil = scheduledTime.getTime() - now.getTime()
  
  setTimeout(() => {
    createNotification({
      title: '🏃 Rappel activité',
      message: `Prêt pour ${settings.value.reminders.activity.target} minutes d'activité ?`,
      icon: '🏃',
      type: 'activity'
    })
    // Reprogrammer pour le lendemain
    scheduleActivity()
  }, timeUntil)
}

function clearAllIntervals() {
  if (notificationInterval) {
    clearInterval(notificationInterval)
    notificationInterval = null
  }
}

function applySuggestion(suggestion) {
  switch (suggestion.action) {
    case 'enable_bedtime':
      settings.value.reminders.bedtime.enabled = true
      break
    case 'enable_hydration':
      settings.value.reminders.hydration.enabled = true
      break
    case 'reduce_frequency':
      // Logique pour réduire la fréquence
      break
  }
  scheduleNotifications()
  saveSettings()
}

function exportSettings() {
  const settingsData = JSON.stringify(settings.value, null, 2)
  const blob = new Blob([settingsData], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `notifications-config-${new Date().toISOString().split('T')[0]}.json`
  a.click()
  URL.revokeObjectURL(url)
}

function resetAllReminders() {
  if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les rappels ?')) {
    settings.value.reminders = {
      daily: { enabled: false, time: '20:00', frequency: 'daily', message: '' },
      activity: { enabled: false, time: '18:00', target: 30 },
      bedtime: { enabled: false, time: '22:00', beforeMinutes: 30 },
      hydration: { enabled: false, interval: 60, startTime: '08:00', endTime: '22:00' }
    }
    pendingNotifications.value = []
    clearAllIntervals()
    saveSettings()
  }
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

function updateStats() {
  stats.value.successRate = Math.round(
    (stats.value.completed / (stats.value.completed + stats.value.dismissed)) * 100
  )
  localStorage.setItem('notification_stats', JSON.stringify(stats.value))
}

function saveSettings() {
  localStorage.setItem('notification_settings', JSON.stringify(settings.value))
}

function loadSettings() {
  const saved = localStorage.getItem('notification_settings')
  if (saved) {
    settings.value = { ...settings.value, ...JSON.parse(saved) }
  }
  
  const savedStats = localStorage.getItem('notification_stats')
  if (savedStats) {
    stats.value = { ...stats.value, ...JSON.parse(savedStats) }
  }
}

onMounted(() => {
  loadSettings()
  if (settings.value.enabled) {
    requestNotificationPermission()
    scheduleNotifications()
  }
})

onUnmounted(() => {
  clearAllIntervals()
})
</script>
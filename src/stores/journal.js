import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useJournalStore = defineStore('journal', () => {
  const entries = ref({})
  const goals = ref({
    sleepHours: 8,
    activityMinutes: 30,
    dailyMoodTarget: 7
  })
  const achievements = ref({
    badges: [],
    streaks: { current: 0, best: 0 },
    totalPoints: 0
  })

  // Fonctions utilitaires
  function formatDate(date = new Date()) {
    return date.toISOString().split('T')[0]
  }

  function createEmptyEntry() {
    return {
      sleep: { bedTime: null, wakeTime: null, quality: 5, notes: '' },
      mood: { score: 0, emoji: '', tags: [], notes: '' },
      activity: [],
      food: []
    }
  }

  function isEntryComplete(entry) {
    if (!entry) return false
    return (
      entry.sleep?.bedTime &&
      entry.sleep?.wakeTime &&
      entry.mood?.score > 0 &&
      entry.activity?.length > 0
    )
  }

  function calculateProgress(entry) {
    if (!entry) return 0

    let score = 0
    if (entry.sleep?.bedTime && entry.sleep?.wakeTime) score += 25
    if (entry.mood?.score > 0) score += 25
    if (entry.activity?.length > 0) score += 25
    if (entry.food?.length > 0) score += 25

    return score
  }

  // Getters calculés
  const getTodayEntry = computed(() => {
    const today = formatDate()
    return entries.value[today] || createEmptyEntry()
  })

  const getWeekEntries = computed(() => {
    const result = []
    const today = new Date()

    // Obtenir le lundi de cette semaine
    const mondayOfWeek = new Date(today)
    const dayOfWeek = today.getDay() // 0 = dimanche, 1 = lundi, etc.
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1
    mondayOfWeek.setDate(today.getDate() - daysToSubtract)

    // Générer les 7 jours de la semaine à partir du lundi
    for (let i = 0; i < 7; i++) {
      const date = new Date(mondayOfWeek)
      date.setDate(mondayOfWeek.getDate() + i)
      const dateStr = formatDate(date)
      const entry = entries.value[dateStr]

      // Noms des jours en français (commence par lundi)
      const dayNames = ['lun', 'mar', 'mer', 'jeu', 'ven', 'sam', 'dim']

      result.push({
        date: dateStr,
        data: entry,
        dayName: dayNames[i],
        dayNumber: date.getDate().toString().padStart(2, '0'),
        progress: entry ? calculateProgress(entry) : 0,
        isToday: dateStr === formatDate()
      })
    }

    return result
  })

  const getCurrentStreak = computed(() => {
    const dates = Object.keys(entries.value).sort().reverse()
    let streak = 0
    let currentDate = new Date()

    for (const dateStr of dates) {
      const entryDate = new Date(dateStr)
      const daysDiff = Math.floor((currentDate - entryDate) / (1000 * 60 * 60 * 24))

      if (daysDiff === streak && isEntryComplete(entries.value[dateStr])) {
        streak++
        currentDate = entryDate
      } else {
        break
      }
    }

    return streak
  })

  const getTodayProgress = computed(() => {
    const today = getTodayEntry.value
    if (!today) return { overall: 0, sleep: 0, mood: 0, activity: 0, food: 0 }

    const sleep = (today.sleep?.bedTime && today.sleep?.wakeTime) ? 25 : 0
    const mood = today.mood?.score > 0 ? 25 : 0
    const activity = today.activity?.length > 0 ? 25 : 0
    const food = today.food?.length > 0 ? 25 : 0

    return {
      overall: sleep + mood + activity + food,
      sleep,
      mood,
      activity,
      food
    }
  })

  // Actions principales
  function updateEntry(date, section, data) {
    const dateStr = typeof date === 'string' ? date : formatDate(date)

    if (!entries.value[dateStr]) {
      entries.value[dateStr] = createEmptyEntry()
    }

    if (section === 'sleep') {
      entries.value[dateStr].sleep = { ...entries.value[dateStr].sleep, ...data }
    } else if (section === 'mood') {
      entries.value[dateStr].mood = { ...entries.value[dateStr].mood, ...data }
    } else if (section === 'activity') {
      if (Array.isArray(data)) {
        entries.value[dateStr].activity = data
      } else {
        entries.value[dateStr].activity.push(data)
      }
    } else if (section === 'food') {
      if (Array.isArray(data)) {
        entries.value[dateStr].food = data
      } else {
        entries.value[dateStr].food.push(data)
      }
    }

    saveToStorage()
    updateAchievements()
  }

  // Nouvelles méthodes pour les composants refactorisés
  function updateSleep(date, sleepData) {
    updateEntry(date, 'sleep', sleepData)
  }

  function updateMood(date, moodData) {
    updateEntry(date, 'mood', moodData)
  }

  function addActivity(date, activity) {
    const dateStr = typeof date === 'string' ? date : formatDate(date)

    if (!entries.value[dateStr]) {
      entries.value[dateStr] = createEmptyEntry()
    }

    const activityWithId = {
      id: Date.now(),
      type: activity.type || 'Autre',
      duration: activity.duration || 0,
      intensity: activity.intensity || 'Modérée',
      calories: activity.calories || estimateCalories(activity.type, activity.duration, activity.intensity),
      notes: activity.notes || '',
      time: activity.time || new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }

    entries.value[dateStr].activity.push(activityWithId)
    saveToStorage()
    updateAchievements()
  }

  function addFood(date, foodItem) {
    const dateStr = typeof date === 'string' ? date : formatDate(date)

    if (!entries.value[dateStr]) {
      entries.value[dateStr] = createEmptyEntry()
    }

    const foodWithId = {
      id: Date.now(),
      meal: foodItem.meal || 'Collation',
      description: foodItem.description || '',
      notes: foodItem.notes || '',
      quality: foodItem.quality || null,
      time: foodItem.time || new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }

    entries.value[dateStr].food.push(foodWithId)
    saveToStorage()
  }

  function removeActivity(date, activityId) {
    const dateStr = typeof date === 'string' ? date : formatDate(date)

    if (entries.value[dateStr]) {
      entries.value[dateStr].activity = entries.value[dateStr].activity.filter(
        activity => activity.id !== activityId
      )
      saveToStorage()
    }
  }

  function removeFood(date, foodId) {
    const dateStr = typeof date === 'string' ? date : formatDate(date)

    if (entries.value[dateStr]) {
      entries.value[dateStr].food = entries.value[dateStr].food.filter(
        food => food.id !== foodId
      )
      saveToStorage()
    }
  }

  // Fonctions utilitaires pour les calculs
  function estimateCalories(type, duration, intensity) {
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

  function getSleepDuration(entry) {
    if (!entry?.sleep?.bedTime || !entry?.sleep?.wakeTime) return 0

    const bedTime = new Date(`2000-01-01 ${entry.sleep.bedTime}`)
    let wakeTime = new Date(`2000-01-01 ${entry.sleep.wakeTime}`)

    if (wakeTime < bedTime) {
      wakeTime.setDate(wakeTime.getDate() + 1)
    }

    return (wakeTime - bedTime) / (1000 * 60 * 60)
  }

  function getTotalActivityMinutes(entry) {
    if (!entry?.activity) return 0
    return entry.activity.reduce((total, activity) => total + (activity.duration || 0), 0)
  }

  function updateGoals(newGoals) {
    goals.value = { ...goals.value, ...newGoals }
    saveToStorage()
  }

  function updateAchievements() {
    const currentStreak = getCurrentStreak.value

    if (currentStreak > achievements.value.streaks.best) {
      achievements.value.streaks.best = currentStreak
    }
    achievements.value.streaks.current = currentStreak

    checkForNewBadges(currentStreak)
    updatePoints()
    saveToStorage()
  }

  function checkForNewBadges(streak) {
    const badges = achievements.value.badges

    if (streak >= 1 && !badges.includes('first_entry')) {
      badges.push('first_entry')
    }
    if (streak >= 7 && !badges.includes('week_streak')) {
      badges.push('week_streak')
    }
    if (streak >= 30 && !badges.includes('month_streak')) {
      badges.push('month_streak')
    }
    if (streak >= 100 && !badges.includes('hundred_days')) {
      badges.push('hundred_days')
    }
  }

  function updatePoints() {
    const completeEntries = Object.values(entries.value).filter(isEntryComplete).length

    achievements.value.totalPoints = (completeEntries * 10) + (achievements.value.streaks.current * 5)
  }

  function saveToStorage() {
    const authStore = JSON.parse(localStorage.getItem('health_journal_user') || '{}')
    const userId = authStore.id || 'guest'

    const existingData = JSON.parse(localStorage.getItem('health_journal_data') || '{}')

    if (!existingData.users) {
      existingData.users = {}
    }

    existingData.users[userId] = {
      profile: {
        goals: goals.value,
        achievements: achievements.value
      },
      entries: entries.value
    }

    localStorage.setItem('health_journal_data', JSON.stringify(existingData))
  }

  function loadFromStorage(userId) {
    const data = JSON.parse(localStorage.getItem('health_journal_data') || '{}')

    if (data.users && data.users[userId]) {
      const userData = data.users[userId]
      entries.value = userData.entries || {}
      goals.value = { ...goals.value, ...(userData.profile?.goals || {}) }
      achievements.value = { ...achievements.value, ...(userData.profile?.achievements || {}) }
    } else {
      entries.value = {}
      goals.value = {
        sleepHours: 8,
        activityMinutes: 30,
        dailyMoodTarget: 7
      }
      achievements.value = {
        badges: [],
        streaks: { current: 0, best: 0 },
        totalPoints: 0
      }
    }
  }

  function clearAllData() {
    entries.value = {}
    achievements.value = {
      badges: [],
      streaks: { current: 0, best: 0 },
      totalPoints: 0
    }
    saveToStorage()
  }

  return {
    entries,
    goals,
    achievements,
    getTodayEntry,
    getWeekEntries,
    getCurrentStreak,
    getTodayProgress,
    updateEntry,
    updateSleep,
    updateMood,
    addActivity,
    addFood,
    removeActivity,
    removeFood,
    updateGoals,
    getSleepDuration,
    getTotalActivityMinutes,
    loadFromStorage,
    clearAllData,
    formatDate
  }
})

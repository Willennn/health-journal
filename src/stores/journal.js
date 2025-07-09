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

  const formatDate = (date = new Date()) => {
    return date.toISOString().split('T')[0]
  }

  const getTodayEntry = computed(() => {
    const today = formatDate()
    return entries.value[today] || createEmptyEntry()
  })

  const getWeekEntries = computed(() => {
    const result = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = formatDate(date)
      
      result.push({
        date: dateStr,
        entry: entries.value[dateStr] || createEmptyEntry(),
        dayName: date.toLocaleDateString('fr-FR', { weekday: 'short' })
      })
    }
    
    return result
  })

  const getCurrentStreak = computed(() => {
    let streak = 0
    const today = new Date()
    
    for (let i = 0; i < 365; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = formatDate(date)
      
      if (entries.value[dateStr] && isEntryComplete(entries.value[dateStr])) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  })

  const getTodayProgress = computed(() => {
    const today = getTodayEntry.value
    const progress = {
      sleep: false,
      mood: false,
      activity: false,
      food: false,
      overall: 0
    }

    if (today.sleep.bedTime && today.sleep.wakeTime) {
      progress.sleep = true
    }
    
    if (today.mood.score > 0) {
      progress.mood = true
    }
    
    if (today.activity.length > 0) {
      progress.activity = true
    }
    
    if (today.food.length > 0) {
      progress.food = true
    }

    const completed = Object.values(progress).filter(p => p === true).length
    progress.overall = Math.round((completed / 4) * 100)

    return progress
  })

  function createEmptyEntry() {
    return {
      sleep: {
        bedTime: null,
        wakeTime: null,
        quality: 0,
        notes: ''
      },
      mood: {
        score: 0,
        emoji: '',
        tags: [],
        notes: ''
      },
      activity: [],
      food: []
    }
  }

  function isEntryComplete(entry) {
    return entry.sleep.bedTime && 
           entry.sleep.wakeTime && 
           entry.mood.score > 0 &&
           entry.activity.length > 0
  }

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
      calories: activity.calories || 0,
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
      photo: foodItem.photo || null,
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
    const totalEntries = Object.keys(entries.value).length
    const completeEntries = Object.values(entries.value).filter(isEntryComplete).length
    
    achievements.value.totalPoints = (completeEntries * 10) + (achievements.value.streaks.current * 5)
  }

  function getSleepDuration(entry) {
    if (!entry.sleep.bedTime || !entry.sleep.wakeTime) return 0
    
    const bedTime = new Date(`2000-01-01 ${entry.sleep.bedTime}`)
    let wakeTime = new Date(`2000-01-01 ${entry.sleep.wakeTime}`)
    
    if (wakeTime < bedTime) {
      wakeTime.setDate(wakeTime.getDate() + 1)
    }
    
    return (wakeTime - bedTime) / (1000 * 60 * 60)
  }

  function getTotalActivityMinutes(entry) {
    return entry.activity.reduce((total, activity) => total + (activity.duration || 0), 0)
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
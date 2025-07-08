import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(true)

  const toggleTheme = () => {
    isDark.value = !isDark.value
    console.log('🎨 Thème changé:', isDark.value ? 'sombre' : 'clair')
  }

  const setTheme = (dark) => {
    isDark.value = dark
  }

  const initializeTheme = () => {
    // Vérifier s'il y a une préférence sauvegardée
    const savedTheme = localStorage.getItem('health_journal_theme')
    
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
      console.log('🎨 Thème restauré depuis localStorage:', savedTheme)
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
      console.log('🎨 Thème détecté depuis le système:', prefersDark ? 'sombre' : 'clair')
    }
    
    applyTheme()
  }

  const applyTheme = () => {
    const html = document.documentElement
    
    if (isDark.value) {
      html.classList.add('dark')
      html.classList.remove('light')
    } else {
      html.classList.add('light')
      html.classList.remove('dark')
    }
  }


  watch(isDark, (newValue) => {
    applyTheme()
    // Sauvegarder la préférence
    localStorage.setItem('health_journal_theme', newValue ? 'dark' : 'light')
  }, { immediate: true })


  if (typeof window !== 'undefined') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      const savedTheme = localStorage.getItem('health_journal_theme')
      if (!savedTheme) {
        isDark.value = e.matches
      }
    })
  }


  initializeTheme()

  return {
    isDark,
    toggleTheme,
    setTheme,
    initializeTheme
  }
})
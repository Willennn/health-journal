<template>
  <button
    @click="toggleTheme"
    class="relative inline-flex h-10 w-10 items-center justify-center rounded-lg border-2 transition-all duration-300 hover:scale-105 group"
    :class="themeClasses"
    :title="isDark ? 'Passer au thème clair' : 'Passer au thème sombre'"
  >
    <svg
      v-if="!isDark"
      class="h-5 w-5 transition-transform duration-300 group-hover:rotate-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
    
    <svg
      v-else
      class="h-5 w-5 transition-transform duration-300 group-hover:rotate-12"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
    
    <div
      class="absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-20"
      :class="glowClass"
    ></div>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const { isDark, toggleTheme } = themeStore

const themeClasses = computed(() => {
  if (isDark.value) {
    return 'border-slate-600 bg-slate-800 text-slate-200 hover:border-emerald-400 hover:text-emerald-400'
  } else {
    return 'border-slate-300 bg-white text-slate-600 hover:border-violet-400 hover:text-violet-600'
  }
})

const glowClass = computed(() => {
  return isDark.value ? 'bg-emerald-400' : 'bg-violet-400'
})
</script>
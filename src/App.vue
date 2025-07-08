<template>
  <div id="app" class="min-h-screen bg-gray-100 p-8">
    <!-- Test des classes Tailwind -->
    <div class="max-w-4xl mx-auto space-y-6">
      
      <!-- Titre -->
      <h1 class="text-4xl font-bold text-center text-gray-800 mb-8">
        🎉 Test Tailwind CSS
      </h1>

      <!-- Cartes de test -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <!-- Carte 1 - Couleurs de base -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h2 class="text-xl font-semibold text-gray-800 mb-3">Couleurs de base</h2>
          <div class="space-y-2">
            <div class="bg-red-500 text-white p-2 rounded">Rouge</div>
            <div class="bg-blue-500 text-white p-2 rounded">Bleu</div>
            <div class="bg-green-500 text-white p-2 rounded">Vert</div>
          </div>
        </div>

        <!-- Carte 2 - Boutons -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h2 class="text-xl font-semibold text-gray-800 mb-3">Boutons</h2>
          <div class="space-y-2">
            <button class="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition-colors">
              Bouton Purple
            </button>
            <button class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded transition-colors">
              Bouton Emerald
            </button>
          </div>
        </div>

        <!-- Carte 3 - Layout -->
        <div class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
          <h2 class="text-xl font-semibold text-gray-800 mb-3">Layout</h2>
          <div class="flex justify-between items-center bg-gray-100 p-3 rounded">
            <span class="text-sm text-gray-600">Flexbox</span>
            <span class="bg-yellow-400 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
              Test
            </span>
          </div>
        </div>

      </div>

      <!-- Test responsive -->
      <div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-4">Test Responsive</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div class="bg-gradient-to-r from-pink-500 to-violet-500 text-white p-4 rounded-lg text-center">
            Mobile+
          </div>
          <div class="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-lg text-center hidden sm:block">
            SM+
          </div>
          <div class="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-lg text-center hidden md:block">
            MD+
          </div>
          <div class="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg text-center hidden lg:block">
            LG+
          </div>
        </div>
      </div>

      <!-- Test classe custom -->
      <div class="test-tailwind">
        Test de la classe custom @apply
      </div>


    </div>
  </div>
</template>

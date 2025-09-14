<template>
  <div class="controls flex justify-center space-x-6 mt-6">
    <!-- Take Photo Button -->
    <div class="control-button-container">
      <button
        @click="takePhoto"
        class="control-button bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white rounded-full w-28 h-28 flex items-center justify-center shadow-2xl transform hover:scale-110 active:scale-95 transition-all duration-300 relative overflow-hidden group border-4 border-white/20"
        :disabled="isCountingDown || !isCameraActive"
        :class="{
          'opacity-50 cursor-not-allowed': isCountingDown || !isCameraActive,
          'animate-pulse': isCountingDown
        }"
      >
        <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <div v-if="isCountingDown" class="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full animate-ping"></div>
      </button>
      <p class="text-center text-white text-sm font-medium mt-3 opacity-90">Take Photo</p>
    </div>

    <!-- Filter Toggle Button -->
    <div class="control-button-container">
      <button
        @click="toggleFilters"
        class="control-button bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full w-24 h-24 flex items-center justify-center shadow-2xl transform hover:scale-110 active:scale-95 transition-all duration-300 relative overflow-hidden group border-4 border-white/20"
      >
        <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      </button>
      <p class="text-center text-white text-sm font-medium mt-3 opacity-90">Filters</p>
    </div>

    <!-- Gallery Button -->
    <div class="control-button-container">
      <button
        @click="$emit('view-gallery')"
        class="control-button bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full w-24 h-24 flex items-center justify-center shadow-2xl transform hover:scale-110 active:scale-95 transition-all duration-300 relative overflow-hidden group border-4 border-white/20"
        :disabled="photos.length === 0"
        :class="{'opacity-50 cursor-not-allowed': photos.length === 0}"
      >
        <div class="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        <div v-if="photos.length > 0" class="absolute -top-1 -right-1 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center border-2 border-white">
          <span class="text-xs font-bold text-white">{{ photos.length }}</span>
        </div>
      </button>
      <p class="text-center text-white text-sm font-medium mt-3 opacity-90">Gallery</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PhotoControls',
  emits: ['view-gallery', 'show-filters'],
  computed: {
    isCountingDown() {
      return this.$store.state.isCountingDown
    },
    isCameraActive() {
      return this.$store.state.isCameraActive
    },
    photos() {
      return this.$store.state.photos
    }
  },
  methods: {
    takePhoto() {
      this.$store.dispatch('takePhoto')
    },
    toggleFilters() {
      this.$emit('show-filters')
    }
  }
}
</script>
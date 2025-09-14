<template>
  <div class="filters-container bg-gradient-to-br from-white/25 to-white/15 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/30">
    <div class="flex items-center justify-center mb-6">
      <div class="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full mr-4 shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-9 0V1m10 3V1m0 3l1 1v16a2 2 0 01-2 2H6a2 2 0 01-2-2V5l1-1z" />
        </svg>
      </div>
      <h3 class="text-white text-2xl font-bold drop-shadow-lg">Choose Your Filter</h3>
    </div>

    <div class="filters-grid grid grid-cols-2 md:grid-cols-4 gap-6">
      <div
        v-for="filter in filters"
        :key="filter.name"
        @click="setFilter(filter.name)"
        class="filter-option cursor-pointer rounded-2xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl group relative border-2 border-transparent"
        :class="{
          'ring-4 ring-yellow-400 ring-opacity-90 shadow-yellow-400/50 border-yellow-400/50': currentFilter === filter.name,
          'hover:ring-2 hover:ring-white hover:ring-opacity-60 hover:border-white/30': currentFilter !== filter.name
        }"
      >
        <!-- Selection indicator -->
        <div v-if="currentFilter === filter.name" class="absolute top-3 right-3 z-20">
          <div class="bg-yellow-400 rounded-full p-1.5 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <!-- Filter preview with better background -->
        <div class="filter-preview h-28 w-full relative overflow-hidden" :class="filter.class">
          <div class="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/30"></div>
          <!-- Sample image overlay -->
          <div class="absolute inset-0 bg-cover bg-center opacity-40" :style="{ backgroundImage: 'url(https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face)' }"></div>
        </div>

        <!-- Filter name with better styling -->
        <div class="filter-name text-center py-4 text-white font-semibold bg-gradient-to-t from-black/90 to-black/50 backdrop-blur-sm relative">
          <span class="relative z-10 text-sm">{{ filter.label }}</span>
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>
    </div>

    <!-- Close button -->
    <button
      @click="$emit('close-filters')"
      class="absolute top-6 right-6 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all duration-200 hover:scale-110"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'PhotoFilters',
  data() {
    return {
      filters: [
        { name: 'normal', label: 'Normal', class: 'filter-normal' },
        { name: 'sepia', label: 'Sepia', class: 'filter-sepia bg-cover', style: 'background-image: url("https://picsum.photos/200/300")' },
        { name: 'grayscale', label: 'Hitam Putih', class: 'filter-grayscale bg-cover', style: 'background-image: url("https://picsum.photos/200/300")' },
        { name: 'invert', label: 'Invert', class: 'filter-invert bg-cover', style: 'background-image: url("https://picsum.photos/200/300")' }
      ]
    }
  },
  computed: {
    currentFilter() {
      return this.$store.state.currentFilter
    }
  },
  methods: {
    setFilter(filterName) {
      this.$store.commit('SET_FILTER', filterName)
    }
  }
}
</script>

<style scoped>
.filter-normal {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.filter-sepia {
  filter: sepia(1);
}

.filter-grayscale {
  filter: grayscale(1);
}

.filter-invert {
  filter: invert(1);
}
</style>
<template>
  <div class="photo-booth-container min-h-screen py-6 px-4">
    <div class="max-w-5xl mx-auto">
      <header class="text-center mb-10">
        <h1 class="text-5xl font-bold text-white mb-3 drop-shadow-lg">Photo Booth</h1>
        <p class="text-white text-opacity-90 text-lg">Ambil foto dengan berbagai filter menarik</p>
      </header>

      <main class="space-y-8">
        <!-- Camera Component -->
        <Camera ref="camera" @take-photo="handleTakePhoto" />

        <!-- Controls Component -->
        <Controls
          @view-gallery="showGallery = true"
          @show-filters="showFilters = !showFilters"
        />

        <!-- Filters Panel -->
        <transition
          enter-active-class="transition-all duration-500 ease-out"
          enter-from-class="transform opacity-0 -translate-y-6 scale-95"
          enter-to-class="transform opacity-100 translate-y-0 scale-100"
          leave-active-class="transition-all duration-300 ease-in"
          leave-from-class="transform opacity-100 translate-y-0 scale-100"
          leave-to-class="transform opacity-0 -translate-y-6 scale-95"
        >
          <PhotoFilters v-if="showFilters" @close-filters="showFilters = false" />
        </transition>

        <!-- Gallery Modal -->
        <transition
          enter-active-class="transition-opacity duration-500 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity duration-300 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <PhotoGallery
            v-if="showGallery"
            @close-gallery="showGallery = false"
          />
        </transition>
      </main>
    </div>
  </div>
</template>

<script>
import Camera from './components/Camera.vue'
import Controls from './components/Controls.vue'
import PhotoFilters from './components/PhotoFilters.vue'
import PhotoGallery from './components/PhotoGallery.vue'

export default {
  name: 'App',
  components: {
    Camera,
    Controls,
    PhotoFilters,
    PhotoGallery
  },
  data() {
    return {
      showFilters: false,
    }
  },
  computed: {
    showGallery: {
      get() {
        return this.$store.state.showGallery
      },
      set(value) {
        this.$store.commit('SET_SHOW_GALLERY', value)
      }
    }
  },
  methods: {
    async handleTakePhoto() {
      try {
        // Dispatch the takePhoto action which handles countdown and capture
        await this.$store.dispatch('takePhoto');

        // Trigger flash effect after photo is captured
        const cameraComponent = this.$refs.camera;
        if (cameraComponent) {
          cameraComponent.triggerFlash();
        }
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  }
}
</script>

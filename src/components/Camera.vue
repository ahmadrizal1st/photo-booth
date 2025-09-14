<template>
  <div class="relative">
    <!-- Countdown overlay -->
    <div v-if="isCountingDown" class="countdown-overlay fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80">
      <div class="countdown-container">
        <div class="countdown-circle animate-pulse">
          <span class="countdown-number text-8xl font-bold text-white">{{ countdownValue }}</span>
        </div>
        <p class="countdown-text text-white text-xl mt-4">Get ready!</p>
      </div>
    </div>

    <!-- Camera frame -->
    <div class="camera-frame overflow-hidden mx-auto bg-black rounded-3xl shadow-2xl border-4 border-white/30 relative">
      <!-- Camera viewfinder overlay -->
      <div class="absolute inset-0 pointer-events-none z-10">
        <div class="absolute top-6 left-6 right-6 h-1.5 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full"></div>
        <div class="absolute bottom-6 left-6 right-6 h-1.5 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full"></div>
        <div class="absolute left-6 top-6 bottom-6 w-1.5 bg-gradient-to-b from-transparent via-white/60 to-transparent rounded-full"></div>
        <div class="absolute right-6 top-6 bottom-6 w-1.5 bg-gradient-to-b from-transparent via-white/60 to-transparent rounded-full"></div>

        <!-- Corner brackets -->
        <div class="absolute top-3 left-3 w-10 h-10 border-l-4 border-t-4 border-white/70 rounded-tl-lg"></div>
        <div class="absolute top-3 right-3 w-10 h-10 border-r-4 border-t-4 border-white/70 rounded-tr-lg"></div>
        <div class="absolute bottom-3 left-3 w-10 h-10 border-l-4 border-b-4 border-white/70 rounded-bl-lg"></div>
        <div class="absolute bottom-3 right-3 w-10 h-10 border-r-4 border-b-4 border-white/70 rounded-br-lg"></div>
      </div>

      <video
        ref="video"
        autoplay
        playsinline
        class="w-full h-full transform scale-x-[-1] rounded-2xl"
        :class="filterClass"
      ></video>

      <!-- Camera controls overlay -->
      <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-10">
        <div class="flex justify-center items-center space-x-8">
          <!-- Flip camera button -->
          <button
            @click="flipCamera"
            class="bg-white/20 hover:bg-white/40 text-white rounded-full p-4 transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-white/20 hover:border-white/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          <!-- Capture button -->
          <button
            @click="$emit('take-photo')"
            :disabled="isCountingDown"
            class="bg-white text-black rounded-full p-7 shadow-2xl hover:bg-gray-100 transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed relative border-4 border-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <!-- Ripple effect -->
            <div class="absolute inset-0 rounded-full border-4 border-white/40 animate-ping"></div>
          </button>

          <!-- Gallery button -->
          <button
            @click="$emit('open-gallery')"
            class="bg-white/20 hover:bg-white/40 text-white rounded-full p-4 transition-all duration-300 hover:scale-110 backdrop-blur-sm relative border border-white/20 hover:border-white/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <!-- Photo count badge -->
            <div v-if="photoCount > 0" class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center border-2 border-white font-bold">
              {{ photoCount }}
            </div>
          </button>
        </div>

        <!-- Camera status -->
        <div class="text-center mt-6">
          <div class="inline-flex items-center space-x-3 bg-black/60 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            <div class="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span class="text-white/90 text-sm font-semibold">Camera Active</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Flash effect -->
    <div
      v-if="showFlash"
      class="flash-effect fixed inset-0 bg-white opacity-0 z-40"
      :class="{'animate-flash': showFlash}"
    ></div>

    <!-- Status indicator -->
    <div v-if="!isCameraActive" class="status-indicator absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
      Camera initializing...
    </div>
  </div>
</template>

<script>
import Webcam from 'webcam-easy'

export default {
  name: 'PhotoCamera',
  data() {
    return {
      webcam: null,
      showFlash: false
    }
  },
  computed: {
    isCountingDown() {
      return this.$store.state.isCountingDown
    },
    countdownValue() {
      return this.$store.state.countdownValue
    },
    currentFilter() {
      return this.$store.state.currentFilter
    },
    filterClass() {
      return {
        'filter-normal': this.currentFilter === 'normal',
        'filter-sepia': this.currentFilter === 'sepia',
        'filter-grayscale': this.currentFilter === 'grayscale',
        'filter-invert': this.currentFilter === 'invert',
      }
    },
    photoCount() {
      return this.$store.state.photos.length
    },
    isCameraActive() {
      return this.$store.state.isCameraActive
    }
  },
  mounted() {
    this.initCamera()
  },
  beforeUnmount() {
    if (this.webcam) {
      this.webcam.stop()
    }
  },
  methods: {
    initCamera() {
      const videoElement = this.$refs.video
      const canvasElement = document.createElement('canvas')
      
      this.webcam = new Webcam(videoElement, 'user', canvasElement)
      
      this.webcam.start()
        .then(() => {
          this.$store.commit('SET_CAMERA_STATUS', true)
          console.log("Webcam started")
        })
        .catch(err => {
          console.error("Error starting webcam:", err)
        })
    },
    
    triggerFlash() {
      this.showFlash = true
      setTimeout(() => {
        this.showFlash = false
      }, 500)
    },
    flipCamera() {
      if (this.webcam) {
        this.webcam.flip()
      }
    }
  }
}
</script>

<style scoped>
.filter-sepia {
  filter: sepia(1);
}

.filter-grayscale {
  filter: grayscale(1);
}

.filter-invert {
  filter: invert(1);
}

/* Countdown styles */
.countdown-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: bounceIn 0.5s ease-out;
}

.countdown-circle {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ff6b6b, #feca57);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 50px rgba(255, 107, 107, 0.5);
}

.countdown-number {
  font-size: 6rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.countdown-text {
  font-size: 1.25rem;
  font-weight: 600;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

@keyframes bounceIn {
  0% {
    transform: scale(0.3);
    opacity: 0;
  }
  50% {
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Camera frame styles */
.camera-frame {
  position: relative;
  max-width: 800px;
  aspect-ratio: 4/3;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.camera-overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.corner-decoration {
  position: absolute;
  width: 40px;
  height: 40px;
  border: 4px solid #ff6b6b;
}

.top-left {
  top: 10px;
  left: 10px;
  border-right: none;
  border-bottom: none;
  border-top-left-radius: 20px;
}

.top-right {
  top: 10px;
  right: 10px;
  border-left: none;
  border-bottom: none;
  border-top-right-radius: 20px;
}

.bottom-left {
  bottom: 10px;
  left: 10px;
  border-right: none;
  border-top: none;
  border-bottom-left-radius: 20px;
}

.bottom-right {
  bottom: 10px;
  right: 10px;
  border-left: none;
  border-top: none;
  border-bottom-right-radius: 20px;
}

/* Flash effect */
.animate-flash {
  animation: flash 0.5s ease-out;
}

@keyframes flash {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

/* Status indicator */
.status-indicator {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

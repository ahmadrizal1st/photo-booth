<template>
  <div class="relative">
    <!-- Countdown overlay -->
    <div
      v-if="isCountingDown"
      class="countdown-overlay fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-80"
    >
      <div class="countdown-container">
        <div class="countdown-circle animate-pulse">
          <span class="countdown-number text-8xl font-bold text-white">{{
            countdownValue
          }}</span>
        </div>
        <p class="countdown-text text-white text-xl mt-4">Get ready!</p>
      </div>
    </div>

    <!-- Camera frame -->
    <div
      class="camera-frame overflow-hidden mx-auto bg-black rounded-3xl shadow-2xl border-4 border-white/30 relative"
    >
      <!-- Camera viewfinder overlay -->
      <div class="absolute inset-0 pointer-events-none z-10">
        <div
          class="absolute top-6 left-6 right-6 h-1.5 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full"
        ></div>
        <div
          class="absolute bottom-6 left-6 right-6 h-1.5 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full"
        ></div>
        <div
          class="absolute left-6 top-6 bottom-6 w-1.5 bg-gradient-to-b from-transparent via-white/60 to-transparent rounded-full"
        ></div>
        <div
          class="absolute right-6 top-6 bottom-6 w-1.5 bg-gradient-to-b from-transparent via-white/60 to-transparent rounded-full"
        ></div>

        <!-- Corner brackets -->
        <div
          class="absolute top-3 left-3 w-10 h-10 border-l-4 border-t-4 border-white/70 rounded-tl-lg"
        ></div>
        <div
          class="absolute top-3 right-3 w-10 h-10 border-r-4 border-t-4 border-white/70 rounded-tr-lg"
        ></div>
        <div
          class="absolute bottom-3 left-3 w-10 h-10 border-l-4 border-b-4 border-white/70 rounded-bl-lg"
        ></div>
        <div
          class="absolute bottom-3 right-3 w-10 h-10 border-r-4 border-b-4 border-white/70 rounded-br-lg"
        ></div>
      </div>

      <video
        ref="video"
        autoplay
        playsinline
        class="w-full h-full transform scale-x-[-1] rounded-2xl"
        :class="filterClass"
      ></video>

      <!-- Status indicator -->
      <div
        v-if="!isCameraActive"
        class="status-indicator absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm"
      >
        Camera initializing...
      </div>
    </div>
  </div>
</template>

<script>
import Webcam from "webcam-easy";

export default {
  name: "PhotoCamera",
  data() {
    return {
      webcam: null,
      showFlash: false,
    };
  },
  computed: {
    isCountingDown() {
      return this.$store.state.isCountingDown;
    },
    countdownValue() {
      return this.$store.state.countdownValue;
    },
    currentFilter() {
      return this.$store.state.currentFilter;
    },
    filterClass() {
      return {
        "filter-normal": this.currentFilter === "normal",
        "filter-sepia": this.currentFilter === "sepia",
        "filter-grayscale": this.currentFilter === "grayscale",
        "filter-invert": this.currentFilter === "invert",
      };
    },
    photoCount() {
      return this.$store.state.photos.length;
    },
    isCameraActive() {
      return this.$store.state.isCameraActive;
    },
  },
  mounted() {
    this.initCamera();
  },
  beforeUnmount() {
    if (this.webcam) {
      this.webcam.stop();
    }
  },
  methods: {
    initCamera() {
      const videoElement = this.$refs.video;
      const canvasElement = document.createElement("canvas");

      this.webcam = new Webcam(videoElement, "user", canvasElement);

      this.webcam
        .start()
        .then(() => {
          this.$store.commit("SET_CAMERA_STATUS", true);
          console.log("Webcam started");
        })
        .catch((err) => {
          console.error("Error starting webcam:", err);
        });
    },

    triggerFlash() {
      this.showFlash = true;
      setTimeout(() => {
        this.showFlash = false;
      }, 500);
    },
    flipCamera() {
      if (this.webcam) {
        this.webcam.flip();
      }
    },
  },
};
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

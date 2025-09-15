<template>
  <div
    class="gallery-container fixed inset-0 bg-gradient-to-br from-black/95 to-gray-900/95 z-50 overflow-y-auto backdrop-blur-sm p-5"
  >
    <div class="max-w-7xl mx-auto p-6 pt-2">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div class="flex items-center">
          <div
            class="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-full mr-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
              />
            </svg>
          </div>
          <div>
            <h2 class="text-3xl font-bold text-white">Your Photo Gallery</h2>
            <p class="text-gray-300 text-sm mt-1">
              {{ photos.length }} photos captured
            </p>
          </div>
        </div>
        <button
          @click="$emit('close-gallery')"
          class="text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all duration-200 hover:scale-110"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Empty state -->
      <div v-if="photos.length === 0" class="text-center py-20">
        <div
          class="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-3xl p-12 max-w-md mx-auto backdrop-blur-sm border border-white/10"
        >
          <div
            class="bg-gradient-to-r from-purple-500 to-pink-500 p-4 rounded-full w-fit mx-auto mb-6"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-12 w-12 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h3 class="text-white text-xl font-semibold mb-2">No Photos Yet</h3>
          <p class="text-gray-400">Start taking photos to see them here!</p>
        </div>
      </div>

      <!-- Photo grid -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        <div
          v-for="(photo, index) in photos"
          :key="photo.id"
          class="gallery-item group relative rounded-3xl overflow-hidden shadow-2xl bg-white transform transition-all duration-500 hover:scale-105 hover:shadow-3xl hover:-rotate-1"
          :style="{ animationDelay: `${index * 100}ms` }"
        >
          <!-- Photo image -->
          <div class="relative overflow-hidden">
            <img
              :src="photo.data"
              :alt="'Photo with ' + photo.filter + ' filter'"
              class="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
              :class="getFilterClass(photo.filter)"
            />
            <!-- Overlay on hover -->
            <div
              class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            ></div>
            <!-- Hover shine effect -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
            ></div>
          </div>

          <!-- Photo info and actions -->
          <div
            class="p-5 bg-gradient-to-t from-gray-900/95 to-gray-800/95 backdrop-blur-sm"
          >
            <div class="flex justify-between items-center mb-4">
              <span
                class="text-white text-sm font-semibold capitalize bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-1.5 rounded-full shadow-lg"
              >
                {{ photo.filter }} filter
              </span>
              <span class="text-gray-300 text-xs font-medium">{{
                formatDate(photo.timestamp)
              }}</span>
            </div>

            <!-- Action buttons -->
            <div class="flex justify-between items-center gap-3">
              <button
                @click="downloadPhoto(photo)"
                class="flex items-center space-x-2 text-blue-300 hover:text-blue-100 transition-all duration-200 bg-blue-500/20 hover:bg-blue-500/40 px-4 py-2.5 rounded-xl hover:scale-105 shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                <span class="text-sm font-medium">Download</span>
              </button>

              <button
                @click="deletePhoto(photo.id)"
                class="flex items-center space-x-2 text-red-300 hover:text-red-100 transition-all duration-200 bg-red-500/20 hover:bg-red-500/40 px-4 py-2.5 rounded-xl hover:scale-105 shadow-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span class="text-sm font-medium">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PhotoGallery",
  emits: ["close-gallery"],
  computed: {
    photos() {
      return this.$store.state.photos;
    },
  },
  methods: {
    getFilterClass(filter) {
      return {
        "filter-normal": filter === "normal",
        "filter-sepia": filter === "sepia",
        "filter-grayscale": filter === "grayscale",
        "filter-invert": filter === "invert",
      };
    },
    downloadPhoto(photo) {
      const link = document.createElement("a");
      link.href = photo.data;
      link.download = `photo-booth-${photo.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    deletePhoto(photoId) {
      if (confirm("Are you sure you want to delete this photo?")) {
        this.$store.commit("DELETE_PHOTO", photoId);
      }
    },
    formatDate(timestamp) {
      if (!timestamp) return "";
      const date = new Date(timestamp);
      return (
        date.toLocaleDateString() +
        " " +
        date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      );
    },
  },
};
</script>

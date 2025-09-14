import { createStore } from "vuex";

export default createStore({
  state: {
    photos: [],
    currentFilter: "normal",
    isCountingDown: false,
    countdownValue: 3,
    isCameraActive: false,
  },
  mutations: {
    ADD_PHOTO(state, photo) {
      state.photos.push(photo);
    },
    SET_FILTER(state, filter) {
      state.currentFilter = filter;
    },
    SET_COUNTDOWN(state, value) {
      state.countdownValue = value;
    },
    SET_COUNTDOWN_STATUS(state, status) {
      state.isCountingDown = status;
    },
    SET_CAMERA_STATUS(state, status) {
      state.isCameraActive = status;
    },
  },
  actions: {
    takePhoto({ commit, state }) {
      return new Promise((resolve) => {
        // Countdown process
        commit("SET_COUNTDOWN_STATUS", true);
        let count = 3;

        const countdownInterval = setInterval(() => {
          commit("SET_COUNTDOWN", count);
          count--;

          if (count < 0) {
            clearInterval(countdownInterval);
            commit("SET_COUNTDOWN_STATUS", false);

            // Capture photo after countdown
            const video = document.querySelector("video");
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            // Draw the current video frame to the canvas
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Apply filter based on current state
            context.globalCompositeOperation =
              state.currentFilter === "sepia"
                ? "sepia"
                : state.currentFilter === "grayscale"
                ? "saturation"
                : state.currentFilter === "invert"
                ? "color"
                : "source-over";

            if (state.currentFilter === "sepia") {
              context.filter = "sepia(1)";
            } else if (state.currentFilter === "grayscale") {
              context.filter = "grayscale(1)";
            } else if (state.currentFilter === "invert") {
              context.filter = "invert(1)";
            } else {
              context.filter = "none";
            }

            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Convert to data URL and store
            const photoData = canvas.toDataURL("image/png");
            commit("ADD_PHOTO", {
              id: Date.now(),
              data: photoData,
              filter: state.currentFilter,
            });

            resolve(photoData);
          }
        }, 1000);
      });
    },
  },
});

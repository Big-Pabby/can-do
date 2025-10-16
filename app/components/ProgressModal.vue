<template>
  <div>
    <!-- Modal Overlay -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed bottom-6 right-0"
      >
        <!-- Modal Content -->
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
          <!-- Modal Header -->
          <h2 class="text-lg font-semibold text-gray-800 mb-3">
            Pulling Services Data
          </h2>

          <!-- Progress Message -->
          <p class="text-sm text-gray-600 mb-4">
            Services are currently being pulled. The services directory list
            will be updated once the process is complete.
          </p>

          <!-- Progress Bar Container -->
          <div class="mb-4 flex gap-2 items-center">
            <div class="w-full flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                class="bg-[#16A34A] h-full rounded-full transition-all duration-300 ease-out"
                :style="{ width: progress + '%' }"
              ></div>
            </div>
             <div class="text-right">
            <span class="text-sm font-medium text-[#16A34A]"
              >{{ progress.toFixed(2) }}%</span
            >
          </div>
          </div>

          <!-- Progress Percentage -->
         

          <!-- Optional: Loading Spinner -->
         
          <!-- Refresh Button (shown when complete) -->
          <!-- <div class="text-center">
            <button
              v-if="progress === 100"
              @click="handleRefresh"
              class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition-colors"
            >
              Refresh Page
            </button>
          </div> -->
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  initialProgress: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["complete", "refresh"]);

const progress = ref(props.initialProgress);

// Watch for isOpen changes to start/reset progress
watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal) {
      progress.value = props.initialProgress;
    }
  }
);

// Watch for external progress updates
watch(
  () => props.initialProgress,
  (newVal) => {
    progress.value = newVal;
  }
);

const handleRefresh = () => {
  emit("refresh");
  // Or reload the page directly
  // window.location.reload()
};

// Expose method to update progress from parent
defineExpose({
  setProgress: (value) => {
    progress.value = Math.min(100, Math.max(0, value));
    if (progress.value === 100) {
      emit("complete");
    }
  },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>

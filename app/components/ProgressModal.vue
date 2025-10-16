<template>
  <div>
    <!-- Modal Overlay -->
    <transition name="fade">
      <div v-if="isOpen" class="fixed bottom-6 right-6 z-50">
        <!-- Modal Content -->
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
          <!-- Close Button (only shown when completed) -->
          <button
            v-if="status === 'Completed'"
            @click="handleClose"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            title="Close"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>

          <!-- Modal Header -->
          <h2 class="text-lg font-semibold text-gray-800 mb-2">
            {{
              status === "Completed"
                ? "Data Collection Complete"
                : "Pulling Services Data"
            }}
          </h2>

          <!-- Progress Message -->
          <p v-if="status !== 'Completed'" class="text-sm text-gray-600 mb-2">
            Services are currently being pulled. The services directory list
            will be updated once the process is complete.
          </p>

          <!-- Completion Summary (shown when completed) -->

          <!-- Progress Bar Container (hidden when completed) -->
          <div class="mb-2 flex gap-2 items-center">
            <div
              class="w-full flex-1 bg-gray-200 rounded-full h-2 overflow-hidden"
            >
              <div
                class="bg-[#16A34A] h-full rounded-full transition-all duration-300 ease-out"
                :style="{ width: progress + '%' }"
              ></div>
            </div>
            <div class="text-right">
              <span class="text-sm font-medium text-[#16A34A]">
                {{ progress.toFixed() }}%
              </span>
            </div>
          </div>
          <div v-if="status === 'Completed'" class="flex w-full justify-between gap-3 items-center">
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium "
                >Successfully Pulled:</span
              >
              <span class="text-lg font-bold ">{{
                success
              }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium ">Failed:</span>
              <span class="text-lg font-bold ">{{ failed }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-medium "
                >Total:</span
              >
              <span class="text-lg font-bold ">{{
                success + failed
              }}</span>
            </div>
          </div>

          <!-- Status Badge -->
         
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useAuthStore } from "~/store/auth";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  initialProgress: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "Processing",
  },
  success: {
    type: Number,
    default: 0,
  },
  failed: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(["complete", "close"]);

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

const handleClose = () => {
  useAuthStore().setJobId(null);
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

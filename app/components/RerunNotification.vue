<template>
  <transition name="slide-fade">
    <div
      v-if="show"
      class="fixed bottom-6 right-6 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 w-96 z-[9999]"
    >
      <!-- Header -->
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-2">
          <div
            v-if="status === 'loading'"
            class="w-5 h-5 border-2 border-[#16A34A] border-t-transparent rounded-full animate-spin"
          ></div>
          <svg
            v-else-if="status === 'success'"
            class="w-5 h-5 text-green-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <svg
            v-else-if="status === 'error'"
            class="w-5 h-5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          <h3 class="font-semibold text-gray-900">{{ title }}</h3>
        </div>
        <button
          v-if="status !== 'loading'"
          @click="handleClose"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      <!-- Message -->
      <p class="text-sm text-gray-600 mb-3">{{ message }}</p>

      <!-- Progress Bar (only show when loading) -->
      <div v-if="status === 'loading'" class="mb-3">
        <div class="flex justify-between text-xs text-gray-600 mb-1">
          <span>Progress</span>
          <span class="font-medium">{{ progress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            class="bg-[#16A34A] h-2 rounded-full transition-all duration-300 ease-out"
            :style="{ width: `${progress}%` }"
          ></div>
        </div>
      </div>

      <!-- Cancel Button (only show when loading and cancelable) -->
      <div v-if="status === 'loading' && cancelable" class="flex justify-end">
        <button
          @click="handleCancel"
          :disabled="cancelling"
          class="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ cancelling ? "Cancelling..." : "Cancel" }}
        </button>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";

const props = defineProps({
  progress: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "loading", // 'loading', 'success', 'error'
    validator: (value) => ["loading", "success", "error"].includes(value),
  },
  title: {
    type: String,
    default: "Processing",
  },
  message: {
    type: String,
    default: "Please wait while we process your request...",
  },
  cancelable: {
    type: Boolean,
    default: true,
  },
  autoDismiss: {
    type: Boolean,
    default: true,
  },
  dismissDelay: {
    type: Number,
    default: 3000,
  },
});

const emit = defineEmits(["close", "cancel"]);

const show = ref(false);
const cancelling = ref(false);

// Auto dismiss on success/error
watch(
  () => props.status,
  (newStatus) => {
    if (
      (newStatus === "success" || newStatus === "error") &&
      props.autoDismiss
    ) {
      setTimeout(() => {
        handleClose();
      }, props.dismissDelay);
    }
  }
);

// Show with animation on mount
onMounted(() => {
  setTimeout(() => {
    show.value = true;
  }, 100);
});

const handleClose = () => {
  show.value = false;
  setTimeout(() => {
    emit("close");
  }, 300);
};

const handleCancel = () => {
  cancelling.value = true;
  emit("cancel");
};
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(100%);
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
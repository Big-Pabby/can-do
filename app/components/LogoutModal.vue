<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div
          class="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 transform transition-all"
          @click.stop
        >
          <!-- Icon -->
          <div class="flex justify-center mb-4">
            <div
              class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center"
            >
              <svg
                class="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </div>
          </div>

          <!-- Title -->
          <h2 class="text-xl font-semibold text-gray-900 text-center mb-2">
            Are you sure you want to log out of your account?
          </h2>

          <!-- Description -->
          <p class="text-sm text-gray-500 text-center mb-6">
            You can log back in anytime to continue.
          </p>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              @click="closeModal"
              :disabled="isLoading"
              class="flex-1 px-4 py-3 rounded-full border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              @click="handleLogout"
              :disabled="isLoading"
              class="flex-1 px-4 py-3 rounded-full bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <span v-if="!isLoading">Logout</span>
              <svg
                v-else
                class="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "confirm", "cancel"]);

const isLoading = ref(false);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const closeModal = () => {
  if (!isLoading.value) {
    isOpen.value = false;
    emit("cancel");
  }
};

const handleLogout = async () => {
  isLoading.value = true;
  try {
    await emit("confirm");
  } finally {
    isLoading.value = false;
  }
};

// Close on ESC key
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && isOpen.value) {
    closeModal();
  }
};

onMounted(() => {
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleKeydown);
});

// Prevent body scroll when modal is open
watch(isOpen, (value) => {
  if (value) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active > div,
.modal-leave-active > div {
  transition: transform 0.3s ease;
}

.modal-enter-from > div,
.modal-leave-to > div {
  transform: scale(0.95);
}
</style>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-30 flex items-center justify-center"
      >
        <!-- Backdrop with blur effect -->
        <div
          class="absolute inset-0 bg-black/30 backdrop-blur-xs"
          @click="$emit('close')"
        ></div>

        <!-- Modal Card -->
        <div
          class="relative bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-sm w-full transform transition-all"
        >
          <!-- Content -->
          <div class="text-center">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              Searching...
            </h3>
            <p class="text-sm text-gray-600 mb-6">
              Searching for services in this area
            </p>

            <!-- Loading Spinner -->
            <div class="flex justify-center">
              <Icon icon="tabler:loader"  width="28" height="28"  class="animate animate-spin text-gray-900" />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
defineProps<{
  isOpen: boolean;
}>();

defineEmits<{
  (e: "close"): void;
}>();
</script>

<style scoped>
/* Modal Fade Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-active .relative,
.modal-fade-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-fade-enter-from .relative {
  transform: scale(0.95);
  opacity: 0;
}

.modal-fade-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}

/* Loading Spinner */
.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #111827;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
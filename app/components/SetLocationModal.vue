<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <!-- Close Button -->
          <button
            @click="closeModal"
            class="close-btn"
            aria-label="Close modal"
          >
            <Icon icon="mdi:close" class="w-6 h-6" />
          </button>

          <!-- Header -->
          <div class="modal-header">
            <h2 class="modal-title">Set your location</h2>
            <p class="modal-subtitle">
              Select your location to see the services available near you.
            </p>
          </div>

          <!-- Content -->
          <div class="modal-content">
            <div class="input-section space-y-3">
              <div class="flex justify-between items-center">
                <label for="address-input" class="input-label">
                  Input address
                </label>
                <button
                  @click="useCurrentLocation"
                  :disabled="isLoadingLocation"
                  class="location-btn"
                >
                  <Icon
                    :icon="isLoadingLocation ? 'mdi:loading' : 'mdi:map-marker'"
                    class="w-5 h-5"
                    :class="{ 'animate-spin': isLoadingLocation }"
                  />
                  <span>{{
                    isLoadingLocation
                      ? "Getting location..."
                      : "Use My Location"
                  }}</span>
                </button>
              </div>

              <div class="relative">
                <input
                  id="address-input"
                  v-model="address"
                  type="text"
                  placeholder="Enter full address"
                  class="address-input"
                  @keypress.enter="handleSave"
                />
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button @click="handleClose" class="btn-secondary">Close</button>
            <button
              @click="handleSave"
              :disabled="!address.trim() || isSaving"
              class="btn-primary"
            >
              <Icon
                v-if="isSaving"
                icon="mdi:loading"
                class="w-5 h-5 animate-spin mr-2"
              />
              {{ isSaving ? "Saving..." : "Save" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { Icon } from "@iconify/vue";

interface Props {
  modelValue?: boolean;
  initialAddress?: string;
}

interface LocationData {
  address: string;
  lat?: number;
  lng?: number;
}

interface Emits {
  (e: "update:modelValue", value: boolean): void;
  (e: "save", data: LocationData): void;
  (e: "close"): void;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  initialAddress: "",
});

const emit = defineEmits<Emits>();

// State
const isOpen = ref(props.modelValue);
const address = ref(props.initialAddress);
const isLoadingLocation = ref(false);
const isSaving = ref(false);
const isCurrentSaving = ref(false);

// Watchers
watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal;
    if (newVal) {
      address.value = props.initialAddress;
    }
  }
);

watch(isOpen, (newVal) => {
  emit("update:modelValue", newVal);
});

// Methods
const closeModal = () => {
  isOpen.value = false;
  emit("close");
};

const handleClose = () => {
  closeModal();
};

const handleSave = async () => {
  if (!address.value.trim()) return;

  isSaving.value = true;

  try {
    // Simulate API call - replace with actual geolocation API
    await new Promise((resolve) => setTimeout(resolve, 800));

    emit("save", {
      address: address.value.trim(),
      lat: undefined,
      lng: undefined,
    });

    closeModal();
  } catch (error) {
    console.error("Error saving location:", error);
    // You can add error handling/notification here
  } finally {
    isSaving.value = false;
  }
};

const useCurrentLocation = async () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  isLoadingLocation.value = true;

  try {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        // Use Google Maps Geocoder to get address
        if (window.google && window.google.maps) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat, lng } },
            (results, status) => {
              if (status === "OK" && results && results[0]) {
                address.value = results[0].formatted_address;
              }
            //   lat.value = latitude;
            //   lng.value = longitude;
            }
          );
        }
      },
      (err) => {
        console.warn("Geolocation error:", err);
      },
      { enableHighAccuracy: true }
    );
  } catch (error: any) {
    console.error("Error getting location:", error);

    let errorMessage = "Unable to get your location. ";

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage +=
          "Please allow location access in your browser settings.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage += "Location information is unavailable.";
        break;
      case error.TIMEOUT:
        errorMessage += "Location request timed out.";
        break;
      default:
        errorMessage += "An unknown error occurred.";
    }

    alert(errorMessage);
  } finally {
    isLoadingLocation.value = false;
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-container {
  background: #f9fafb;
  border-radius: 1.5rem;
  width: 100%;
  max-width: 492px;
  padding: 2rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: #a0d468;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border-radius: 0.5rem;
}

.close-btn:hover {
  background-color: rgba(160, 212, 104, 0.1);
  transform: scale(1.1);
}

.modal-header {
  margin-bottom: 2rem;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #2d3436;
  letter-spacing: -0.02em;
}

.modal-subtitle {
  font-size: 14px;
  color: #374151;
  margin: 0;
  line-height: 1.5;
}

.modal-content {
  margin-bottom: 2rem;
}

.input-section {
  margin-bottom: 1.5rem;
}

.input-label {
  display: block;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #2d3436;
  margin-bottom: 0.75rem;
}

.address-input {
  width: 100%;
  padding: 12px 14px;
  border: 1px solid #e0e0e0;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  color: #2d3436;
  background: white;
  outline: none;
  transition: all 0.2s;
}

.address-input::placeholder {
  color: #b2bec3;
}

.address-input:focus {
  border-color: #0891b2;
  box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
}

.location-btn {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 6px 8px;
  background: white;
  border: 1px solid #b0b72e;
  border-radius: 6px;
  color: #b0b72e;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  width: fit-content;
}

.location-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-buttons {
  display: flex;
  gap: 1rem;
}

.btn-secondary,
.btn-primary {
  flex: 1;
  padding: 0.875rem 2rem;
  border-radius: 3rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-secondary {
  background: white;
  border: 2px solid #e0e0e0;
  color: #636e72;
}

.btn-secondary:hover {
  background: #f8f9fa;
  border-color: #dfe6e9;
  transform: translateY(-1px);
}

.btn-primary {
  background: #0891b2;
  color: white;
  box-shadow: 0 4px 14px rgba(8, 145, 178, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: #0e7490;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(8, 145, 178, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* Modal Transitions */
.modal-enter-active {
  transition: all 0.3s ease-out;
}

.modal-leave-active {
  transition: all 0.2s ease-in;
}

.modal-enter-active .modal-container {
  transition: all 0.3s ease-out;
}

.modal-leave-active .modal-container {
  transition: all 0.2s ease-in;
}

.modal-enter-from {
  opacity: 0;
}

.modal-enter-from .modal-container {
  opacity: 0;
  transform: scale(0.9) translateY(20px);
}

.modal-leave-to {
  opacity: 0;
}

.modal-leave-to .modal-container {
  opacity: 0;
  transform: scale(0.95);
}

/* Animations */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>

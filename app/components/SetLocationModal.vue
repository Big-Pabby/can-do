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
                  Input address or postcode
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
                  ref="addressInputRef"
                  v-model="address"
                  type="text"
                  placeholder="Enter address or postcode (e.g., SW1A 1AA)"
                  class="address-input"
                  @keypress.enter="handleSave"
                />

                <!-- Loading indicator for input -->
                <div
                  v-if="isLoadingLocation"
                  class="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <Icon
                    icon="mdi:loading"
                    class="w-5 h-5 text-cyan-600 animate-spin"
                  />
                </div>
              </div>

              <!-- Selected Location Info -->
              <!-- <div
                v-if="selectedLocation.lat && selectedLocation.lng"
                class="location-info-card"
              >
                <div class="location-info-header">
                  <Icon icon="mdi:check-circle" class="w-5 h-5 text-green-500" />
                  <span class="text-sm font-semibold text-gray-700">Location Selected</span>
                </div>
                
                <div class="location-details">
                  <div v-if="selectedLocation.postcode" class="detail-row">
                    <span class="detail-label">Postcode:</span>
                    <span class="detail-value">{{ selectedLocation.postcode }}</span>
                  </div>
                  
                  <div v-if="selectedLocation.district" class="detail-row">
                    <span class="detail-label">District:</span>
                    <span class="detail-value">{{ selectedLocation.district }}</span>
                  </div>
                  
                  <div v-if="selectedLocation.city" class="detail-row">
                    <span class="detail-label">City:</span>
                    <span class="detail-value">{{ selectedLocation.city }}</span>
                  </div>
                  
                  <div class="detail-row">
                    <span class="detail-label">Coordinates:</span>
                    <span class="detail-value">
                      {{ selectedLocation.lat.toFixed(6) }}, {{ selectedLocation.lng.toFixed(6) }}
                    </span>
                  </div>
                </div>
              </div> -->
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button @click="handleClose" class="btn-secondary">Close</button>
            <button
              @click="handleSave"
              :disabled="!canSave || isSaving"
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
import { ref, watch, computed, onMounted, nextTick } from "vue";
import { Icon } from "@iconify/vue";

interface Props {
  modelValue?: boolean;
  initialAddress?: string;
}

interface LocationData {
  address: string;
  lat: number;
  lng: number;
  district: string;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
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
const addressInputRef = ref<HTMLInputElement | null>(null);
const autocomplete = ref<google.maps.places.Autocomplete | null>(null);

const selectedLocation = ref({
  address: "",
  lat: 0,
  lng: 0,
  district: "",
  city: "",
  state: "",
  country: "",
  postcode: "",
});

// Computed
const canSave = computed(() => {
  return (
    address.value.trim() &&
    selectedLocation.value.lat !== 0 &&
    selectedLocation.value.lng !== 0
  );
});

// Watchers
watch(
  () => props.modelValue,
  (newVal) => {
    isOpen.value = newVal;
    if (newVal) {
      address.value = props.initialAddress;
      nextTick(() => {
        initAutocomplete();
      });
    }
  }
);

watch(isOpen, (newVal) => {
  emit("update:modelValue", newVal);
  if (newVal) {
    nextTick(() => {
      initAutocomplete();
    });
  }
});

// Extract address components from Google Place
const extractAddressComponents = (place: google.maps.places.PlaceResult) => {
  const components = place.address_components || [];

  const getComponent = (types: string[]) => {
    const component = components.find((c) =>
      types.some((type) => c.types.includes(type))
    );
    return component?.long_name || "";
  };

  const getShortComponent = (types: string[]) => {
    const component = components.find((c) =>
      types.some((type) => c.types.includes(type))
    );
    return component?.short_name || "";
  };

  return {
    // Postcode is the most important for UK addresses
    postcode: getComponent(["postal_code"]),
    // District can be sublocality or administrative_area_level_2
    district:
      getComponent(["sublocality_level_1", "sublocality"]) ||
      getComponent(["administrative_area_level_2"]) ||
      getComponent(["locality"]),
    // City/Town
    city: getComponent(["locality", "postal_town"]) || 
          getComponent(["administrative_area_level_2"]),
    // State/County
    state: getComponent(["administrative_area_level_1"]),
    // Country
    country: getComponent(["country"]),
    countryCode: getShortComponent(["country"]),
  };
};

// Initialize Google Places Autocomplete
const initAutocomplete = () => {
  if (!addressInputRef.value) return;

  // Check if Google Maps is loaded
  if (typeof google === "undefined" || !google.maps) {
    console.error("Google Maps API not loaded");
    return;
  }

  try {
    // Create autocomplete instance without type restriction
    // This allows both addresses and postcodes to be searched
    autocomplete.value = new google.maps.places.Autocomplete(
      addressInputRef.value,
      {
        // Remove types to allow all location types including postcodes
        fields: [
          "formatted_address",
          "geometry",
          "address_components",
          "place_id",
        ],
        componentRestrictions: { country: "gb" }, // Restrict to UK - remove or change as needed
      }
    );

    // Listen for place selection
    autocomplete.value.addListener("place_changed", handlePlaceSelect);
  } catch (error) {
    console.error("Error initializing autocomplete:", error);
  }
};

// Handle place selection from autocomplete
const handlePlaceSelect = () => {
  if (!autocomplete.value) return;

  const place = autocomplete.value.getPlace();

  if (!place.geometry || !place.geometry.location) {
    console.error("No geometry data for selected place");
    return;
  }

  // Extract all address components
  const addressComponents = extractAddressComponents(place);

  // Update address and coordinates
  address.value = place.formatted_address || "";
  selectedLocation.value = {
    address: place.formatted_address || "",
    lat: place.geometry.location.lat(),
    lng: place.geometry.location.lng(),
    ...addressComponents,
  };

  console.log("Selected location:", selectedLocation.value);
};

// Methods
const closeModal = () => {
  isOpen.value = false;
  resetLocation();
  emit("close");
};

const handleClose = () => {
  closeModal();
};

const resetLocation = () => {
  selectedLocation.value = {
    address: "",
    lat: 0,
    lng: 0,
    district: "",
    city: "",
    state: "",
    country: "",
    postcode: "",
  };
};

const handleSave = async () => {
  if (!canSave.value) return;

  isSaving.value = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    emit("save", {
      address: selectedLocation.value.address,
      lat: selectedLocation.value.lat,
      lng: selectedLocation.value.lng,
      district: selectedLocation.value.district,
      city: selectedLocation.value.city,
      state: selectedLocation.value.state,
      country: selectedLocation.value.country,
      postcode: selectedLocation.value.postcode,
    });

    closeModal();
  } catch (error) {
    console.error("Error saving location:", error);
  } finally {
    isSaving.value = false;
  }
};

const useCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser");
    return;
  }

  isLoadingLocation.value = true;

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      try {
        // Reverse geocode to get address
        if (typeof google !== "undefined" && google.maps) {
          const geocoder = new google.maps.Geocoder();

          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK" && results && results[0]) {
              const addressComponents = extractAddressComponents(results[0]);
              
              address.value = results[0].formatted_address;
              selectedLocation.value = {
                address: results[0].formatted_address,
                lat: lat,
                lng: lng,
                ...addressComponents,
              };
            } else {
              console.error("Geocoding failed:", status);
            }
            isLoadingLocation.value = false;
          });
        } else {
          // Fallback: Set coordinates without address
          selectedLocation.value = {
            address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
            lat: lat,
            lng: lng,
            district: "",
            city: "",
            state: "",
            country: "",
            postcode: "",
          };
          address.value = selectedLocation.value.address;
          isLoadingLocation.value = false;
        }
      } catch (error) {
        console.error("Error getting address:", error);
        isLoadingLocation.value = false;
      }
    },
    (error) => {
      console.error("Geolocation error:", error);
      isLoadingLocation.value = false;

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
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};

// Lifecycle
onMounted(() => {
  if (isOpen.value) {
    nextTick(() => {
      initAutocomplete();
    });
  }
});
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
  z-index: 40;
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
  transition: all 0.2s;
}

.location-btn:hover:not(:disabled) {
  background: #f8faf5;
  border-color: #9da129;
}

.location-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.location-info-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1rem;
  margin-top: 0.75rem;
}

.location-info-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f3f4f6;
}

.location-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.375rem 0;
}

.detail-label {
  font-size: 0.8125rem;
  color: #6b7280;
  font-weight: 500;
}

.detail-value {
  font-size: 0.8125rem;
  color: #111827;
  font-weight: 600;
  text-align: right;
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

/* Override Google Autocomplete dropdown styles */
:deep(.pac-container) {
  border-radius: 0.75rem;
  margin-top: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e0e0e0;
  font-family: inherit;
  z-index: 9999 !important;
}

:deep(.pac-item) {
  padding: 0.75rem 1rem;
  cursor: pointer;
  border: none;
  font-size: 0.875rem;
}

:deep(.pac-item:hover) {
  background-color: #f0f9ff;
}

:deep(.pac-item-selected) {
  background-color: #e0f2fe;
}

:deep(.pac-icon) {
  margin-top: 0.5rem;
}
</style>
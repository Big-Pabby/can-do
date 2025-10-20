<template>
  <div>
    <!-- Modal Overlay -->
    <transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        @click.self="closeModal"
      >
        <!-- Modal Content -->
        <div
          class="bg-white rounded-lg max-h-[95vh] overflow-y-auto shadow-xl w-full max-w-md p-6 relative"
        >
          <!-- Close Button -->
          <button
            @click="closeModal"
            class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
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
          <h2 class="text-xl font-semibold text-gray-800 mb-2">
            Data Collection
          </h2>
          <p class="text-sm text-gray-500 mb-6">
            Pull services data from specific local authority
          </p>

          <!-- District Selection -->
          <div class="mb-4">
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-gray-700">
                Select Local Authority
              </label>
              <button
                v-if="selectedDistricts.length > 0"
                @click="clearSelection"
                class="text-xs text-[#DC2626] hover:underline font-medium"
              >
                Clear All
              </button>
            </div>
            <div class="relative">
              <button
                @click="showDistrictDropdown = !showDistrictDropdown"
                class="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
              >
                <span
                  :class="selectedDistricts.length > 0 ? 'text-gray-700' : 'text-gray-400'"
                >
                  {{
                    selectedDistricts.length > 0
                      ? `${selectedDistricts.length} district${selectedDistricts.length > 1 ? 's' : ''} selected`
                      : "Local authority"
                  }}
                </span>
                <svg
                  class="w-5 h-5 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  />
                </svg>
              </button>

              <!-- District Dropdown -->
              <div
                v-if="showDistrictDropdown"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg"
              >
                <!-- Search Input -->
                <div class="p-2 border-b border-gray-200">
                  <div class="relative">
                    <input
                      v-model="searchQuery"
                      type="text"
                      placeholder="Search districts..."
                      class="w-full px-3 py-2 pl-9 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      @click.stop
                    />
                    <svg
                      class="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                <!-- Select All Option -->
                <div
                  v-if="filteredDistricts.length > 0"
                  class="px-4 py-2 border-b border-gray-200 hover:bg-gray-50 cursor-pointer flex items-center"
                  @click="toggleSelectAll"
                >
                  <input
                    type="checkbox"
                    :checked="isAllSelected"
                    :indeterminate="isIndeterminate"
                    class="mr-2"
                    readonly
                  />
                  <span class="font-medium text-gray-700">Select All</span>
                </div>

                <!-- Districts List -->
                <div class="max-h-48 overflow-y-auto">
                  <div
                    v-for="district in filteredDistricts"
                    :key="district"
                    @click="toggleDistrict(district)"
                    class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                  >
                    <input
                      type="checkbox"
                      :checked="selectedDistricts.includes(district)"
                      class="mr-2"
                      readonly
                    />
                    <span>{{ district }}</span>
                  </div>
                  <div
                    v-if="filteredDistricts.length === 0"
                    class="px-4 py-3 text-sm text-gray-500 text-center"
                  >
                    No districts found
                  </div>
                </div>
              </div>
            </div>

            <!-- Selected Districts Display -->
            <div v-if="selectedDistricts.length > 0" class="mt-3 flex flex-wrap gap-2">
              <span
                v-for="district in selectedDistricts"
                :key="district"
                class="inline-flex items-center px-3 py-1 rounded-full border border-[#12A0D8] text-sm bg-[#F0F8FF] text-[#12A0D8]"
              >
                {{ district }}
                <button
                  @click="removeDistrict(district)"
                  class="ml-2 text-[#12A0D8] hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            </div>
          </div>

          <!-- Radius Input -->
          <!-- <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Radius (in km)
            </label>
            <div class="relative">
              <input
                v-model.number="radius"
                type="number"
                min="1"
                step="1"
                placeholder="Enter radius in kilometers"
                class="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div class="absolute right-3 top-2.5 text-gray-400 text-sm">
                km
              </div>
            </div>
            <p class="text-xs text-gray-500 mt-1">
              Specify the search radius from the selected districts
            </p>
          </div> -->

          <!-- Action Buttons -->
          <div class="flex gap-3 mt-12">
            <button
              @click="closeModal"
              class="flex-1 px-4 py-2 border border-[#B0B72E] text-[#B0B72E] bg-[#FAFAED] font-medium transition-colors rounded-full"
            >
              Close
            </button>
            <button
              :disabled="loading || selectedDistricts.length === 0 || !radius"
              @click="pullData"
              class="flex-1 flex gap-2 items-center justify-center px-4 py-2 text-white rounded-full bg-[#12A0D8] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon
                v-if="loading"
                icon="codex:loader"
                width="20"
                height="20"
                style="color: #fff"
              />
              Pull Data
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { Icon } from "@iconify/vue";
import { ref, computed } from "vue";
import { UseDistrict } from "~/pages/services/hooks";

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const { data, isLoading } = UseDistrict();

const emit = defineEmits(["close", "submit"]);

const showDistrictDropdown = ref(false);
const selectedDistricts = ref([]);
const radius = ref(10);
const searchQuery = ref("");

// Computed property to filter districts based on search query
const filteredDistricts = computed(() => {
  if (!data.value) return [];
  if (!searchQuery.value) return data.value;

  return data.value.filter((district) =>
    district.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Check if all filtered districts are selected
const isAllSelected = computed(() => {
  if (filteredDistricts.value.length === 0) return false;
  return filteredDistricts.value.every((district) =>
    selectedDistricts.value.includes(district)
  );
});

// Check if some but not all districts are selected (for indeterminate state)
const isIndeterminate = computed(() => {
  const selectedCount = filteredDistricts.value.filter((district) =>
    selectedDistricts.value.includes(district)
  ).length;
  return selectedCount > 0 && selectedCount < filteredDistricts.value.length;
});

// Toggle a single district
const toggleDistrict = (district) => {
  const index = selectedDistricts.value.indexOf(district);
  if (index > -1) {
    selectedDistricts.value.splice(index, 1);
  } else {
    selectedDistricts.value.push(district);
  }
};

// Remove a specific district
const removeDistrict = (district) => {
  const index = selectedDistricts.value.indexOf(district);
  if (index > -1) {
    selectedDistricts.value.splice(index, 1);
  }
};

// Toggle select all filtered districts
const toggleSelectAll = () => {
  if (isAllSelected.value) {
    // Deselect all filtered districts
    filteredDistricts.value.forEach((district) => {
      const index = selectedDistricts.value.indexOf(district);
      if (index > -1) {
        selectedDistricts.value.splice(index, 1);
      }
    });
  } else {
    // Select all filtered districts
    filteredDistricts.value.forEach((district) => {
      if (!selectedDistricts.value.includes(district)) {
        selectedDistricts.value.push(district);
      }
    });
  }
};

// Clear all selected districts
const clearSelection = () => {
  selectedDistricts.value = [];
};

const closeModal = () => {
  showDistrictDropdown.value = false;
  searchQuery.value = "";
  emit("close");
};

const pullData = () => {
  if (selectedDistricts.value.length === 0 || !radius.value) {
    return;
  }

  const payload = {
    districts: selectedDistricts.value, // Changed to plural and array
    radius: radius.value,
  };
  emit("submit", payload);
  closeModal();
};
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

/* Hide number input arrows for webkit browsers */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Hide number input arrows for Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

/* Indeterminate checkbox state */
input[type="checkbox"]:indeterminate {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3e%3cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 8h8'/%3e%3c/svg%3e");
  background-color: #3b82f6;
  border-color: #3b82f6;
}
</style>
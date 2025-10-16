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
        <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
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
            Pull services data from specific district(s)
          </p>

          <!-- District Selection -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select District(s)
            </label>
            <div class="relative">
              <button
                @click="showDistrictDropdown = !showDistrictDropdown"
                class="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
              >
                <span class="text-gray-700">Select</span>
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
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
              >
                <div
                  v-for="district in data"
                  :key="district"
                  @click="toggleDistrict(district)"
                  class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                >
                  <input
                    type="checkbox"
                    :checked="selectedDistricts.includes(district)"
                    class="mr-2"
                  />
                  <span>{{ district }}</span>
                </div>
              </div>
            </div>

            <!-- Selected Districts Tags -->
            <div class="flex flex-wrap gap-2 mt-3">
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

          <!-- Category Selection -->
          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Select Category
            </label>
            <div class="relative">
              <button
                @click="showCategoryDropdown = !showCategoryDropdown"
                class="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent flex items-center justify-between"
              >
                <span class="text-gray-700">Select</span>
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

              <!-- Category Dropdown -->
              <div
                v-if="showCategoryDropdown"
                class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
              >
                <div
                  v-for="category in categories"
                  :key="category"
                  @click="toggleCategory(category)"
                  class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                >
                  <input
                    type="checkbox"
                    :checked="selectedCategories.includes(category)"
                    class="mr-2"
                  />
                  <span>{{ category }}</span>
                </div>
              </div>
            </div>

            <!-- Selected Categories Tags -->
            <div class="flex flex-wrap gap-2 mt-3">
              <span
                v-for="category in selectedCategories"
                :key="category"
                class="inline-flex items-center px-3 py-1 rounded-full border border-[#12A0D8] text-sm bg-[#F0F8FF] text-[#12A0D8]"
              >
                {{ category }}
                <button
                  @click="removeCategory(category)"
                  class="ml-2 text-[#12A0D8] hover:text-blue-900"
                >
                  ×
                </button>
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            <button
              @click="closeModal"
              class="flex-1 px-4 py-2 border border-[#B0B72E] text-[#B0B72E] bg-[#FAFAED] font-medium transition-colors rounded-full"
            >
              Close
            </button>
            <button
              :disabled="loading"
              @click="pullData"
              class="flex-1 flex gap-2 items-center justify-center px-4 py-2 text-white rounded-full bg-[#12A0D8] font-medium transition-colors"
            >
            <Icon v-if="loading" icon="codex:loader" width="20" height="20"  style="color: #fff" />
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
import { ref } from "vue";
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
const showCategoryDropdown = ref(false);

const selectedDistricts = ref([]);
const selectedCategories = ref([]);

const districts = ref([
  "Maidenhead",
  "Windsor",
  "Ascot",
  "Bracknell",
  "Slough",
  "Reading",
]);

const categories = ref([
  "Food & Nutrition",
  "Shelter & Housing",
  "Clothing & Essentials",
  "Addiction & Recovery",
  "Mental Health & Wellbeing",
  "Health & Medical",
  "Justice & Legal Support",
  "Financial & Benefits Support",
  "Employment, Training & Education",
  "Community & General Support",
]);

const toggleDistrict = (district) => {
  const index = selectedDistricts.value.indexOf(district);
  if (index > -1) {
    selectedDistricts.value.splice(index, 1);
  } else {
    selectedDistricts.value.push(district);
  }
};

const removeDistrict = (district) => {
  const index = selectedDistricts.value.indexOf(district);
  if (index > -1) {
    selectedDistricts.value.splice(index, 1);
  }
};

const toggleCategory = (category) => {
  const index = selectedCategories.value.indexOf(category);
  if (index > -1) {
    selectedCategories.value.splice(index, 1);
  } else {
    selectedCategories.value.push(category);
  }
};

const removeCategory = (category) => {
  const index = selectedCategories.value.indexOf(category);
  if (index > -1) {
    selectedCategories.value.splice(index, 1);
  }
};

const closeModal = () => {
  showDistrictDropdown.value = false;
  showCategoryDropdown.value = false;
  emit("close");
};

const pullData = () => {
  const payload = {
    districts: selectedDistricts.value,
    categories: selectedCategories.value,
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
</style>

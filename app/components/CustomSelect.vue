<template>
  <div ref="dropdownRef" class="relative w-full">
    <button
      type="button"
      @click="toggleDropdown"
      class="flex h-12 w-full items-center justify-between rounded-lg border-1 px-4 py-2 text-sm font-medium bg-white transition-all duration-200 focus:outline-none"
      :class="
        isOpen
          ? 'ring-2 ring-blue-500 border-transparent'
          : 'border-[#F3F4F6] hover:border-gray-300'
      "
    >
      <span class="text-[#374151] font-medium">
        {{ getLabel() }}
      </span>
      <svg
        class="w-4 h-4 text-gray-500 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto"
      >
        <div
          @click="selectOption('')"
          class="px-4 py-3 text-sm cursor-pointer transition-colors duration-150"
          :class="[
            modelValue === ''
              ? 'bg-blue-50 text-blue-600 font-medium'
              : 'text-gray-700 hover:bg-blue-50',
            index > 0 ? 'border-t border-gray-100' : '',
          ]"
        >
          {{ placeholder }}
        </div>
        <div
          v-for="(option, index) in options"
          :key="index"
          @click="
            selectOption(placeholder === 'All Categories' ? index : option)
          "
          class="px-4 py-3 text-sm cursor-pointer transition-colors duration-150"
          :class="[
            modelValue === option
              ? 'bg-blue-50 text-blue-600 font-medium'
              : 'text-gray-700 hover:bg-blue-50',
            index > 0 ? 'border-t border-gray-100' : '',
          ]"
        >
          {{ placeholder === "All Categories" ? index : option }}
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: "",
  },
  options: {
    type: Array,
    required: true,
  },
  placeholder: {
    type: String,
    default: "Select an option",
  },
});

const emit = defineEmits(["update:modelValue"]);

const isOpen = ref(false);
const dropdownRef = ref(null);
const selected = ref("");

const toggleDropdown = () => {
  isOpen.value = !isOpen.value;
};

const selectOption = (value) => {
  selected.value = value;
  emit("update:modelValue", value);
  isOpen.value = false;
};

const getLabel = () => {
  if (!props.modelValue) return props.placeholder;

  return selected;
};

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

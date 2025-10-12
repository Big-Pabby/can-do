<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
        <div class="modal-container">
          <!-- Header -->
          <div class="modal-header">
            <div>
              <h2 class="modal-title">Advance Filter</h2>
              <p class="modal-subtitle">Filter to discover services just right for you.</p>
            </div>
            <button @click="closeModal" class="close-btn" aria-label="Close">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <!-- Category Selection -->
          <div class="section">
            <div class="select-wrapper">
              <select v-model="selectedCategory" class="select-input" @change="onCategoryChange">
                <option value="" disabled>Select Category</option>
                <option v-for="category in categories" :key="category" :value="category">
                  {{ category }}
                </option>
              </select>
              <svg class="select-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 8L10 12L14 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <!-- Sub Category Selection -->
          <div class="section">
            <div class="select-wrapper">
              <select 
                v-model="selectedSubCategory" 
                class="select-input" 
                :disabled="!selectedCategory"
              >
                <option value="" disabled>Select Sub Category</option>
                <option 
                  v-for="subCategory in availableSubCategories" 
                  :key="subCategory" 
                  :value="subCategory"
                >
                  {{ formatSubCategory(subCategory) }}
                </option>
              </select>
              <svg class="select-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M6 8L10 12L14 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>

          <!-- Distance Selection -->
          <div class="section">
            <h3 class="section-title">Select a distance</h3>
            <div class="distance-buttons">
              <button
                v-for="dist in distances"
                :key="dist"
                @click="selectedDistance = dist"
                :class="['distance-btn', { active: selectedDistance === dist }]"
              >
                {{ dist }}km
              </button>
            </div>
            <p class="helper-text">You'll see services within {{ selectedDistance }}km of your location.</p>
          </div>

          <!-- Exclude Areas -->
          <div class="section">
            <h3 class="section-title">Exclude Areas</h3>
            <p class="section-description">
              Enter neighborhoods, post code, streets, or areas you want to exclude from the search results.
            </p>
            <div class="input-group">
              <input
                v-model="excludeInput"
                type="text"
                placeholder="e.g Downtown, 5th street, 12345"
                class="exclude-input"
                @keypress.enter="addExcludedArea"
              />
              <button type="button" @click="addExcludedArea" class="add-btn" aria-label="Add area">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 5V15M5 10H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </button>
            </div>

            <!-- Excluded Areas Tags -->
            <div v-if="excludedAreas.length" class="tags-container">
              <span v-for="(area, index) in excludedAreas" :key="index" class="tag">
                {{ area }}
                <button @click="removeExcludedArea(index)" class="tag-remove" aria-label="Remove">
                  ×
                </button>
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <button @click="handleClose" class="btn-secondary">Close</button>
            <button @click="handleApply" class="btn-primary">Apply</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { CORE_SERVICE_CATEGORIES } from '#imports'



interface Props {
  modelValue?: boolean
  initialDistance?: string
  initialExcludedAreas?: string[]
  initialCategory?: string
  initialSubCategory?: string
}

interface FilterData {
  category: string
  subCategory: string
  distance: string
  excludedAreas: string[]
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'apply', data: FilterData): void
  (e: 'close'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  initialDistance: '10km',
  initialExcludedAreas: () => [],
  initialCategory: '',
  initialSubCategory: ''
})

const emit = defineEmits<Emits>()

const distances = ['0.5', '1', '1.5', '2', '2.5', '3']
const categories = Object.keys(CORE_SERVICE_CATEGORIES)

const selectedCategory = ref(props.initialCategory)
const selectedSubCategory = ref(props.initialSubCategory)
const selectedDistance = ref(props.initialDistance)
const excludedAreas = ref<string[]>([...props.initialExcludedAreas])
const excludeInput = ref('')
const isOpen = ref(props.modelValue)

const availableSubCategories = computed(() => {
  if (!selectedCategory.value) return []
  return CORE_SERVICE_CATEGORIES[selectedCategory.value as keyof typeof CORE_SERVICE_CATEGORIES] || []
})

const formatSubCategory = (subCategory: string): string => {
  return subCategory
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const onCategoryChange = () => {
  selectedSubCategory.value = ''
}

watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal
})

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal)
})

const closeModal = () => {
  isOpen.value = false
  emit('close')
}

const handleClose = () => {
  closeModal()
}

const handleApply = () => {
  emit('apply', {
    category: selectedCategory.value,
    subCategory: selectedSubCategory.value,
    distance: selectedDistance.value,
    excludedAreas: excludedAreas.value
  })
  closeModal()
}

const addExcludedArea = () => {
  const trimmed = excludeInput.value.trim()
  if (trimmed && !excludedAreas.value.includes(trimmed)) {
    excludedAreas.value.push(trimmed)
    excludeInput.value = ''
  }
}

const removeExcludedArea = (index: number) => {
  excludedAreas.value.splice(index, 1)
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-container {
  background: white;
  border-radius: 1rem;
  width: 100%;
  max-width: 520px;
  padding: 1.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.25rem 0;
}

.modal-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
  flex-shrink: 0;
}

.close-btn:hover {
  color: #6b7280;
}

.section {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.75rem 0;
}

.section-description {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
}

.select-wrapper {
  position: relative;
}

.select-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1a1a1a;
  background: white;
  cursor: pointer;
  outline: none;
  appearance: none;
  transition: border-color 0.2s;
}

.select-input:focus {
  border-color: #60d5f0;
}

.select-input:disabled {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.select-input option {
  padding: 0.5rem;
}

.select-icon {
  position: absolute;
  right: 0.875rem;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: #6b7280;
}

.distance-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
}

.distance-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.distance-btn:hover {
  border-color: #60d5f0;
  color: #1a1a1a;
}

.distance-btn.active {
  background: #e0f7fc;
  border-color: #60d5f0;
  color: #0891b2;
}

.helper-text {
  font-size: 0.75rem;
  color: #6b7280;
  margin: 0;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.exclude-input {
  flex: 1;
  padding: 0.625rem 0.875rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  color: #1a1a1a;
  outline: none;
  transition: border-color 0.2s;
}

.exclude-input::placeholder {
  color: #9ca3af;
}

.exclude-input:focus {
  border-color: #60d5f0;
}

.add-btn {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #60d5f0;
  border-radius: 0.5rem;
  color: #0891b2;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.add-btn:hover {
  background: #e0f7fc;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  background: #f3f4f6;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: #374151;
}

.tag-remove {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  font-size: 1.25rem;
  line-height: 1;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.tag-remove:hover {
  color: #374151;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn-secondary,
.btn-primary {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 2rem;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-secondary {
  background: white;
  border: 1px solid #e5e7eb;
  color: #6b7280;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

.btn-primary {
  background: #0891b2;
  color: white;
}

.btn-primary:hover {
  background: #0e7490;
}

/* Modal Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.95);
}
</style>
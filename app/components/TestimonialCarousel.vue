<template>
  <div class="w-full">
    <div class="max-w-7xl mx-auto relative">
      <!-- Carousel Container -->
      <div class="relative bg-none overflow-hidden">
        <!-- Slides Wrapper -->
        <div
          class="flex bg-none transition-transform duration-500 ease-out"
          :style="{ transform: `translateX(-${currentIndex * slideWidth}%)` }"
        >
          <div
            v-for="(testimonial, index) in testimonials"
            :key="index"
            class="flex-shrink-0 bg-none"
            :style="{ width: `${slideWidth}%` }"
          >
            <div class="bg-[#D5F1FC] p-4 rounded-2xl overflow-hidden shadow-lg h-full">
              <!-- Image -->
              <div class="aspect-[4/3] overflow-hidden rounded-[8px] bg-gray-200">
                <img
                  :src="testimonial.image"
                  :alt="testimonial.name"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- Content -->
              <div class="pt-3">
                <!-- Name -->
                <h3 class="text-lg font-semibold text-gray-900 mb-1">
                  {{ testimonial.name }}
                </h3>

                <!-- Role/Location -->
                <p class="text-sm text-[#4B5563] mb-1">
                  {{ testimonial.role }}
                </p>

                <!-- Testimonial Text -->
                <p class="text-[#374151] text-sm leading-relaxed">
                  {{ testimonial.text }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation Arrows (Desktop) -->
        
      </div>
      <button
          v-if="showArrows && currentIndex > 0"
          @click="prev"
          class="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full w-12 h-12 items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10"
          aria-label="Previous testimonial"
        >
          <svg
            class="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          v-if="showArrows && currentIndex < maxIndex"
          @click="next"
          class="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full w-12 h-12 items-center justify-center shadow-lg hover:bg-gray-100 transition-colors z-10"
          aria-label="Next testimonial"
        >
          <svg
            class="w-6 h-6 text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

      <!-- Dots Pagination -->
      <div class="flex justify-center gap-2 mt-6">
        <button
          v-for="(dot, index) in totalDots"
          :key="index"
          @click="goToSlide(index)"
          class="transition-all duration-300"
          :class="[
            currentIndex === index
              ? 'w-8 h-2 bg-blue-500'
              : 'w-2 h-2 bg-gray-400 hover:bg-gray-500',
            'rounded-full',
          ]"
          :aria-label="`Go to slide ${index + 1}`"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from "vue";

interface Testimonial {
  name: string;
  role: string;
  text: string;
  image: string;
}

const props = defineProps({
  testimonials: {
    type: Array as PropType<Testimonial[]>,
    required: true,
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  autoplayInterval: {
    type: Number,
    default: 5000,
  },
  showArrows: {
    type: Boolean,
    default: true,
  },
});

const currentIndex = ref(0);
const isTransitioning = ref(false);
let autoplayTimer: ReturnType<typeof setInterval> | null = null;

// Responsive slides per view
const slidesPerView = ref(1);

// Calculate slide width based on slides per view
const slideWidth = computed(() => 100 / slidesPerView.value);

// Calculate max index based on slides per view
const maxIndex = computed(() => {
  return Math.max(0, props.testimonials.length - slidesPerView.value);
});

// Total dots for pagination
const totalDots = computed(() => maxIndex.value + 1);

// Update slides per view based on screen size
const updateSlidesPerView = () => {
  if (window.innerWidth < 640) {
    slidesPerView.value = 1; // Mobile
  } else if (window.innerWidth < 1024) {
    slidesPerView.value = 1; // Tablet
  } else {
    slidesPerView.value = 1; // Desktop
  }

  // Adjust current index if needed
  if (currentIndex.value > maxIndex.value) {
    currentIndex.value = maxIndex.value;
  }
};

const next = () => {
  if (isTransitioning.value || currentIndex.value >= maxIndex.value) return;
  isTransitioning.value = true;
  currentIndex.value++;
  setTimeout(() => {
    isTransitioning.value = false;
  }, 500);
};

const prev = () => {
  if (isTransitioning.value || currentIndex.value <= 0) return;
  isTransitioning.value = true;
  currentIndex.value--;
  setTimeout(() => {
    isTransitioning.value = false;
  }, 500);
};

const goToSlide = (index: number) => {
  if (isTransitioning.value || index === currentIndex.value) return;
  isTransitioning.value = true;
  currentIndex.value = index;
  setTimeout(() => {
    isTransitioning.value = false;
  }, 500);
};

const startAutoplay = () => {
  if (props.autoplay) {
    autoplayTimer = setInterval(() => {
      if (currentIndex.value >= maxIndex.value) {
        currentIndex.value = 0;
      } else {
        next();
      }
    }, props.autoplayInterval);
  }
};

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
  }
};

// Touch/Swipe support
const touchStartX = ref(0);
const touchEndX = ref(0);

const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX;
};

const handleTouchEnd = (e: TouchEvent) => {
  touchEndX.value = e.changedTouches[0].clientX;
  handleSwipe();
};

const handleSwipe = () => {
  const swipeThreshold = 50;
  const diff = touchStartX.value - touchEndX.value;

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      next();
    } else {
      prev();
    }
  }
};

// Keyboard navigation
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "ArrowLeft") {
    prev();
  } else if (e.key === "ArrowRight") {
    next();
  }
};

onMounted(() => {
  updateSlidesPerView();
  window.addEventListener("resize", updateSlidesPerView);
  window.addEventListener("keydown", handleKeydown);

  const carousel = document.querySelector(".overflow-hidden");
  if (carousel) {
    carousel.addEventListener("touchstart", handleTouchStart as any);
    carousel.addEventListener("touchend", handleTouchEnd as any);
  }

  startAutoplay();
});

onUnmounted(() => {
  window.removeEventListener("resize", updateSlidesPerView);
  window.removeEventListener("keydown", handleKeydown);
  stopAutoplay();

  const carousel = document.querySelector(".overflow-hidden");
  if (carousel) {
    carousel.removeEventListener("touchstart", handleTouchStart as any);
    carousel.removeEventListener("touchend", handleTouchEnd as any);
  }
});
</script>

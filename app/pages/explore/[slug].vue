<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Loading State -->
    <div v-if="isLoading" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div class="space-y-4">
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-5/6"></div>
            <div class="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div
      v-else-if="isError"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div class="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-red-800 mb-2">
          Error Loading Service
        </h3>
        <!-- <p class="text-red-600">{{ error.message }}</p> -->
        <button
          @click="refetch()"
          class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Try Again
        </button>
      </div>
    </div>

    <!-- Content -->
    <div
      v-else-if="service"
      class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <!-- Back Button -->
      <button
        @click="$router.back()"
        class="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition"
      >
        <svg
          class="w-5 h-5 mr-2"
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
        Back
      </button>
      <div
        class="border border-[#F3F4F6] bg-white rounded-[12px] p-6 flex justify-between items-center"
      >
        <div class="space-y-1">
          <h2 class="text-2xl font-bold text-[#12A0D8]">Service Details</h2>
          <p class="text-sm text-[#6B7280]">Information about this service</p>
        </div>
        <div class="flex gap-6 items-center">
          <button
            @click="shareService"
            class="p-2 rounded-full flex items-center justify-center border border-[#B0B72E80] bg-[#FAFAED] hover:bg-gray-50 transition"
            aria-label="Share"
          >
            <svg
              class="w-5 h-5 text-[#B0B72E]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
          <button
            @click="toggleBookmark"
            class="p-2 rounded-full bg-[#EAF8FE] border border-[#80D6F7] hover:bg-gray-50 transition"
            aria-label="Bookmark"
          >
            <svg
              class="w-5 h-5 text-[#12A0D8]"
              :class="{ 'fill-current text-cyan-600': isBookmarked }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Header Card -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <h1 class="text-2xl font-bold text-gray-900 mb-2">
                  {{ service.details.name }}
                </h1>
                <div class="flex items-center gap-2 text-sm">
                  <span
                    class="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full font-medium"
                  >
                    {{ service.details.categories }}
                  </span>
                  <span
                    v-if="service.details.sub_category"
                    class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
                  >
                    {{ service.details.sub_category }}
                  </span>
                </div>
              </div>
              <div class="flex gap-2 ml-4">
                <button
                  class="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition font-medium"
                >
                  Contact
                </button>
              </div>
            </div>

            <div class="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <div class="flex items-center">
                <svg
                  class="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{{
                  service.details.hours || "Hours not specified"
                }}</span>
              </div>
              <div class="flex items-center">
                <svg
                  class="w-4 h-4 mr-1.5 text-yellow-500 fill-current"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                  />
                </svg>
                <span
                  >{{ service.details.rating || "No rating" }} ({{
                    service.details.total_ratings || 0
                  }}
                  reviews)</span
                >
              </div>
            </div>

            <p class="text-gray-700 leading-relaxed">
              {{ service.details.description }}
            </p>
          </div>

          <!-- Contact Information -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h2>
            <div class="space-y-3">
              <div v-if="service.details.phone" class="flex items-start">
                <svg
                  class="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  :href="`tel:${service.details.phone}`"
                  class="text-gray-700 hover:text-cyan-600 transition"
                >
                  {{ service.details.phone }}
                </a>
              </div>
              <div v-if="service.details.email" class="flex items-start">
                <svg
                  class="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  :href="`mailto:${service.details.email}`"
                  class="text-gray-700 hover:text-cyan-600 transition"
                >
                  {{ service.details.email }}
                </a>
              </div>
              <div v-if="service.details.website" class="flex items-start">
                <svg
                  class="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                  />
                </svg>
                <a
                  :href="service.details.website"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-gray-700 hover:text-cyan-600 transition"
                >
                  {{ service.details.website }}
                </a>
              </div>
            </div>
          </div>

          <!-- General Information -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
              General Information
            </h2>
            <dl class="space-y-3">
              <div v-if="service.details.eligibility">
                <dt class="text-sm font-medium text-gray-500 mb-1">
                  Eligibility Criteria
                </dt>
                <dd class="text-gray-700">{{ service.details.eligibility }}</dd>
              </div>
              <!-- <div v-if="service.details.cost">
                <dt class="text-sm font-medium text-gray-500 mb-1">Cost</dt>
                <dd class="text-gray-700">{{ service.details.cost }}</dd>
              </div> -->
              <div v-if="service.details.confidence">
                <dt class="text-sm font-medium text-gray-500 mb-1">
                  Languages
                </dt>
                <dd class="text-gray-700">{{ service.details.confidence }}</dd>
              </div>
              <div v-if="service.details.access">
                <dt class="text-sm font-medium text-gray-500 mb-1">
                  Accessibility
                </dt>
                <dd class="text-gray-700">{{ service.details.access }}</dd>
              </div>
            </dl>
          </div>

          <!-- Location Details -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Location</h2>
            <div v-if="service.details.address" class="flex items-start mb-4">
              <svg
                class="w-5 h-5 text-gray-400 mr-3 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <p class="text-gray-700">{{ service.details.address }}</p>
            </div>
            <!-- <div v-if="service.details.distance" class="text-sm text-gray-600 mb-4">
              📍 {{ service.details.distance }} from your location
            </div> -->
            <button
              class="w-full py-2.5 px-4 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Get Directions
            </button>
          </div>

          <!-- Reviews Section -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">
              Reviews & Ratings
            </h2>
            <div class="text-center py-8 text-gray-500">
              <svg
                class="w-12 h-12 mx-auto mb-3 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
              <p>No reviews yet. Be the first to review!</p>
              <button
                class="mt-4 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition"
              >
                Write a Review
              </button>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1">
          <!-- Map Preview -->
          <div class="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
            <div
              class="h-64 bg-gradient-to-br from-cyan-100 to-blue-100 relative"
            >
              <div class="absolute inset-0 flex items-center justify-center">
                <svg
                  class="w-16 h-16 text-cyan-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">
              Quick Actions
            </h3>
            <div class="space-y-2">
              <button
                class="w-full py-2.5 px-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700"
              >
                📞 Call Now
              </button>
              <button
                class="w-full py-2.5 px-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700"
              >
                📧 Send Email
              </button>
              <button
                class="w-full py-2.5 px-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition text-sm font-medium text-gray-700"
              >
                🌐 Visit Website
              </button>
            </div>
          </div>

          <!-- Similar Services -->
          <!-- <div class="bg-white rounded-lg shadow-sm p-6">
            <h3 class="text-sm font-semibold text-gray-900 mb-3">Similar Services</h3>
            <div class="space-y-3">
              <div v-for="similar in similarServices" :key="similar.id" class="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                <NuxtLink 
                  :to="`/services/${similar.id}`"
                  class="block hover:text-cyan-600 transition"
                >
                  <h4 class="font-medium text-sm text-gray-900 mb-1">{{ similar.name }}</h4>
                  <p class="text-xs text-gray-600">{{ similar.category }}</p>
                </NuxtLink>
              </div>
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import https from "@/utils/https";
import type { Service } from "#imports";

const route = useRoute();
const router = useRouter();
const serviceId = route.params.slug as string;
definePageMeta({
  layout: "user",
});

const {
  data: service,
  isLoading,
  isError,
  refetch,
} = useQuery({
  queryKey: ["service", serviceId],
  queryFn: async () => {
    const res = await https.get<Service>(`/v1/services/${serviceId}`);
    return res.data;
  },
  enabled: !!serviceId,
});

// Reactive state
const isBookmarked = ref(false);

// Methods
const toggleBookmark = () => {
  isBookmarked.value = !isBookmarked.value;
  // TODO: Call API to save bookmark
};

const shareService = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: service.value?.details.name,
        text: service.value?.details.description,
        url: window.location.href,
      });
    } catch (err) {
      console.log("Error sharing:", err);
    }
  } else {
    // Fallback: Copy to clipboard
    await navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  }
};

// SEO Meta
useHead({
  title: () => service.value?.details.name || "Service Details",
  meta: [
    {
      name: "description",
      content: () => service.value?.details.description || "",
    },
  ],
});
</script>

<style scoped>
/* Custom scrollbar for better UX */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>

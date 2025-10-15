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
    <div v-else-if="service" class="max-w-7xl mx-auto lg:px-8 space-y-6">
      <!-- Back Button -->
      <button
        @click="$router.back()"
        class="md:flex hidden gap-2 items-center text-gray-600 hover:text-gray-900 transition"
      >
        <Icon icon="tabler:arrow-left" width="20" height="20" />
        Back
      </button>
      <!-- <div
        class="border md:flex hidden border-[#F3F4F6] bg-white rounded-[12px] p-6 justify-between items-center"
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
      </div> -->
      <div
        class="md:bg-white bg-[#12A0D8] md:rounded-[12px] p-6 flex flex-col gap-4 justify-between items-start"
      >
        <div class="md:hidden w-full flex items-center justify-between">
          <button
            @click="$router.back()"
            class="md:hidden flex gap-2 p-2 border border-[#B0B72E80] bg-[#FAFAED] hover:bg-gray-50 transition rounded-full items-center text-[#B0B72E]"
          >
            <Icon icon="tabler:arrow-left" width="20" height="20" />
          </button>
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

        <div class="w-full">
          <div class="flex w-full items-start justify-between mb-4">
            <div class="w-full">
              <div class="flex justify-between w-full md:items-center">
                <h1
                  class="md:text-2xl text-xl font-bold md:text-gray-900 text-white mb-2"
                >
                  {{ service.details.name }}
                </h1>
                <div class="md:flex hidden gap-6 items-center">
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

              <div class="flex items-center flex-wrap gap-2 text-sm">
                <!-- <span
                  class="px-3 md:hidden block py-1 border border-[#6BCFF6] bg-[#EAF8FE] text-[#12A0D8] text-xs rounded-full font-medium"
                >
                  {{ service.details.categories }}
                </span>
                <span
                  v-if="service.details.subcategories"
                  class="px-3 md:hidden block border border-[#B3DAFF] py-1 bg-[#F0F8FF] text-[#005AAD] text-xs rounded-full"
                >
                  {{ service.details.subcategories }}
                </span> -->
                <div
                  class="flex bg-[#FFFBEB] border py-[6px] rounded-full px-[8px] border-[#FDE68A] items-center gap-2"
                >
                  <div class="flex">
                    <template v-for="i in 5" :key="i">
                      <svg
                        class="w-4 h-4 transition-colors duration-150"
                        :class="getStarFill(service.details.rating, i)"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                        />
                      </svg>
                    </template>
                  </div>
                  <div class="flex items-center gap-1 text-sm">
                    <span class="text-[#D97706] font-medium">
                      ({{
                        service.details?.rating === "null"
                          ? "N/A"
                          : service.details.rating
                      }})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- <div
            class="flex items-center gap-4 text-sm md:text-gray-600 text-white mb-4"
          >
            <div class="flex items-center gap-2">
              <Icon icon="akar-icons:location" width="16" height="16" />
              <span>{{
                service.details.address || "Hours not specified"
              }}</span>
            </div>
          </div> -->
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Main Content -->
        <div class="space-y-6 md:p-0 p-4">
          <!-- Contact Information -->
          <div class="space-y-1">
            <h2 class="text-base font-medium text-gray-900 mb-4">
              Service Information
            </h2>
            <div
              class="bg-white rounded-lg p-6 space-y-2 text-sm font-medium text-[#4B5563]"
            >
              <p class="pb-2">
                {{ service.details.description || "No description available." }}
              </p>

              <hr />
              <div class="space-y-1 py-2">
                <h5 class="text-xs text-[#4B5563]">Service Category</h5>
                <span class="text-sm font-medium text-[#111827]">
                  {{ service.details.categories }}
                </span>
              </div>
              <hr />
              <div class="space-y-1 py-2">
                <h5 class="text-xs text-[#4B5563]">Service Sub category</h5>
                <span
                  v-if="service.details.subcategories"
                  class="text-sm font-medium text-[#111827]"
                >
                  {{ service.details.subcategories }}
                </span>
              </div>
              <hr />
              <div class="space-y-1 py-2">
                <h5 class="text-xs text-[#4B5563]">Address</h5>
                <p class="text-sm font-medium text-[#111827]">
                  {{ service.details.address }}
                  <span
                    class="underline text-[#12A0D8]"
                    @click="handleDirections(service)"
                    >View on Map</span
                  >
                </p>
              </div>
              <hr />
            </div>
          </div>
          <div class="space-y-1">
            <h2 class="text-base font-medium text-gray-900 mb-4">
              Contact Information
            </h2>
            <div
              class="bg-white rounded-lg p-6 text-sm font-medium text-[#4B5563] space-y-4"
            >
              <div class="flex gap-2 items-center">
                <div
                  class="w-[30px] h-[30px] flex items-center justify-center bg-[#FAFAED] text-[#B0B72E] rounded-[8px]"
                >
                  <Icon icon="solar:phone-outline" width="20" height="20" />
                </div>
                <div class="space-y-1">
                  <h4 class="text-xs text-[#4B5563]">Phone</h4>
                  <p class="text-sm font-medium">
                    {{ service.details.phone || "Phone number not available" }}
                  </p>
                </div>
              </div>
              <hr />
              <div class="flex gap-2 items-center">
                <div
                  class="w-[30px] h-[30px] flex items-center justify-center bg-[#FAFAED] text-[#B0B72E] rounded-[8px]"
                >
                  <Icon
                    icon="material-symbols:mail-outline-sharp"
                    width="20"
                    height="20"
                  />
                </div>
                <div class="space-y-1">
                  <h4 class="text-xs text-[#4B5563]">Email</h4>
                  <p class="text-sm font-medium">
                    {{ service.details.email || "Email not available" }}
                  </p>
                </div>
              </div>
              <hr />
              <div class="flex gap-2 items-center">
                <div
                  class="w-[30px] h-[30px] flex items-center justify-center bg-[#FAFAED] text-[#B0B72E] rounded-[8px]"
                >
                  <Icon icon="akar-icons:globe" width="20" height="20" />
                </div>
                <div class="space-y-1">
                  <h4 class="text-xs text-[#4B5563]">Website</h4>
                  <a
                    :href="service.details.website"
                    target="_blank"
                    class="text-sm underline text-[#12A0D8] font-medium line-clamp-1"
                  >
                    {{ service.details.website || "website not available" }}
                  </a>
                </div>
              </div>
              <hr />
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="lg:col-span-1 space-y-6 md:p-0 p-4">
          <!-- Map Preview -->
          <div class="space-y-1">
            <h2 class="text-base font-medium text-gray-900 mb-4">
              Opening Hours
            </h2>
            <div
              class="bg-white rounded-lg p-6 text-sm font-medium text-[#4B5563] space-y-4"
            >
              <div
                v-for="(item, index) in hours"
                :key="index"
                class="space-y-4"
              >
                <div class="flex gap-2 items-center">
                  <Icon
                    icon="mdi:clock-outline"
                    width="20"
                    height="20"
                    style="color: #b0b72e"
                  />
                  <p class="text-sm">{{ item }}</p>
                </div>
                <hr />
              </div>
            </div>
          </div>
          <div class="space-y-1">
            <h2 class="text-base font-medium text-gray-900 mb-4">
              Eligibility Criteria
            </h2>
            <div
              class="bg-white rounded-lg p-6 text-sm font-medium text-[#4B5563] space-y-4"
            >
              <div v-for="(item, index) in eligibility" :key="index">
                <div class="flex gap-2 items-start">
                  <Icon
                    icon="icon-park-outline:check-one"
                    width="20"
                    height="20"
                    style="color: #b0b72e"
                  />
                  <p class="text-sm flex-1">{{ item }}</p>
                </div>
              </div>
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
  <div
    class="fixed w-full bg-[#F9FAFB] bottom-0 left-0 p-4 z-40 grid grid-cols-2 gap-4 md:hidden"
  >
    <button
      @click="handleCall(service?.details.phone as string)"
      class="bg-[#12A0D8] py-2.5 px-4.5 rounded-full w-full text-white text-sm font-medium"
    >
      Call Now
    </button>
    <button
      @click="handleDirections(service)"
      class="border border-[#B0B72E] bg-[#FAFAED] py-2.5 px-4.5 rounded-full w-full text-[#B0B72E] text-sm font-medium"
    >
      Directions
    </button>
    <button
      class="border border-[#16A34A] bg-[#FFFFFF1A] py-2.5 px-4.5 rounded-full w-full text-[#16A34A] text-sm font-medium"
    >
      Give Feedback
    </button>
    <button
      class="border border-[#DC2626] bg-[#FFFFFF1A] py-2.5 px-4.5 rounded-full w-full text-[#DC2626] text-sm font-medium"
    >
      Report Issue
    </button>
  </div>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import https from "@/utils/https";
import type { Service } from "#imports";
import { Icon } from "@iconify/vue";
import { useLocationStore } from "~/store/location";

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
const eligibility = computed(() => {
  return service.value?.details.eligibility
    ? service.value.details.eligibility.split(";").map((item) => item.trim())
    : [];
});
const hours = computed(() => {
  return service.value?.details.hours
    ? service.value.details.hours.split(";").map((item) => item.trim())
    : [];
});
function getStarFill(rating: number | undefined, position: number): string {
  if (!rating) return "text-gray-300";

  const roundedRating = Math.round(rating);
  return position <= roundedRating ? "text-yellow-400" : "text-gray-300";
}
function handleCall(phoneNumber: string) {
  if (!phoneNumber) return;

  // Format number safely
  const formatted = phoneNumber.replace(/\s+/g, "");
  window.location.href = `tel:${formatted}`;
}
function handleDirections(service: any) {
  const destLat = Number(service.details.lat);
  const destLng = Number(service.details.lng);
  if (!destLat || !destLng) {
    alert("Service location not available");
    return;
  }

  useLocationStore().setSelectedServiceLocation(
    { lat: destLat, lng: destLng },
    service
  );
  navigateTo("/explore");
}

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

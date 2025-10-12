<template>
  <div class="min-h-screen mb-4">
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
    <div v-if="data" class="max-w-7xl mx-auto lg:px-8 space-y-6">
      <button
        @click="$router.back()"
        class="md:flex hidden gap-2 items-center text-gray-600 hover:text-gray-900 transition"
      >
        <Icon icon="tabler:arrow-left" width="20" height="20" />
        Back
      </button>
      <div
        class="border border-[#F3F4F6] space-y-4 md:bg-white bg-[#12A0D8] md:rounded-[12px] p-6"
      >
        <button
          @click="$router.back()"
          class="md:hidden flex gap-2 p-2 border border-[#B0B72E80] bg-[#FAFAED] hover:bg-gray-50 transition rounded-full items-center text-[#B0B72E]"
        >
          <Icon icon="tabler:arrow-left" width="20" height="20" />
        </button>
        <div class="flex gap-3 items-center">
          <div
            class="h-[52px] w-[52px] bg-[#E0E7FF] rounded-full flex items-center justify-center"
          >
            <span class="text-2xl">
              {{ categoryEmojis[category] || "❓" }}
            </span>
          </div>
          <div>
            <h4 class="md:text-[#12A0D8] text-white md:text-2xl font-bold">
              {{ category }}
            </h4>
            <p class="md:text-[#4B5563] text-white text-sm">
              {{ data.count }} Services
            </p>
          </div>
        </div>
      </div>
      <div
        v-if="data?.results.length"
        class="md:px-0 px-4 grid lg:grid-cols-3 md:grid-cols-2 gap-4 grid-cols-1"
      >
        <div v-for="service in data?.results" :key="service.id">
          <ServiceCard :service="service" @directions="handleDirections" />
        </div>
      </div>
      <div
        v-if="data.results.length"
        class="md:px-0 px-4 mt-8 flex w-full justify-center"
      >
        <nav
          class="flex items-center flex-wrap space-x-1"
          role="navigation"
          aria-label="pagination"
        >
          <button
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-2 py-2 disabled:pointer-events-none disabled:opacity-50"
            :disabled="currentPage === 1"
            @click="prevPage"
          >
            <Icon icon="ooui:next-rtl" width="20" height="20"   />
          </button>

          <div class="flex items-center space-x-1">
            <template v-for="page in paginationPages" :key="page">
              <span
                v-if="page === '...'"
                class="inline-flex items-center justify-center h-9 w-9 text-muted-foreground"
                >...</span
              >
              <button
                v-else
                @click="goToPage(page as number)"
                :class="{
                  'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-9 w-9': true,
                  'bg-[#12A0D8] text-primary-foreground hover:bg-[#12A0D8]/90':
                    currentPage === page,
                  'border border-input bg-background hover:bg-accent hover:text-accent-foreground':
                    currentPage !== page,
                }"
              >
                {{ page }}
              </button>
            </template>
          </div>

          <button
            class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-2 py-2 disabled:pointer-events-none disabled:opacity-50"
            :disabled="currentPage === totalPages"
            @click="nextPage"
          >
           <Icon icon="ooui:next-ltr" width="20" height="20" />
          </button>
        </nav>
      </div>
      <div v-if="!data.results.length" class="text-center">
        No Services for this category
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { UseMapServices } from "../map/hooks";
import { useLocationStore } from "~/store/location";
import { Icon } from "@iconify/vue";

definePageMeta({
  layout: "user",
});
const route = useRoute();
const router = useRouter();
const category = route.params.slug as string;
const currentPage = ref(1);
const pageSize = 9;
const totalPages = computed(() => {
  if (!data?.value?.count) return 1;
  return Math.ceil(data.value.count / pageSize);
});

const reactivePage = computed(() => currentPage.value);
const reactivePageSize = computed(() => pageSize);
const coords = computed(() => ({
  lat: useLocationStore().lat,
  lng: useLocationStore().lng,
}));
const { data, isError, isLoading, refetch } = UseMapServices(
  reactivePage,
  reactivePageSize,
  coords,
  {
    category: category,
  }
);
const categoryEmojis: Record<string, string> = {
  "Food & Nutrition": "🍎",
  "Shelter & Housing": "🏠",
  "Clothing & Essentials": "👕",
  "Addiction & Recovery": "💊",
  "Mental Health & Wellbeing": "🧠",
  "Health & Medical": "🏥",
  "Justice & Legal Support": "⚖️",
  "Financial & Benefits Support": "💰",
  "Employment, Training & Education": "🎓",
  "Community & General Support": "🤝",
};
function handleDirections(service: any) {
  const destLat = Number(service.details.lat);
  const destLng = Number(service.details.lng);
  if (!destLat || !destLng) {
    alert("Service location not available");
    return;
  }

  useLocationStore().setSelectedServiceLocation({ lat: destLat, lng: destLng });
  navigateTo("/explore");
}
const paginationPages = computed(() => {
  const pages: (number | string)[] = [];
  if (totalPages.value <= 7) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i);
  } else {
    if (currentPage.value <= 4) {
      pages.push(1, 2, 3, 4, 5, "...", totalPages.value);
    } else if (currentPage.value >= totalPages.value - 3) {
      pages.push(
        1,
        "...",
        totalPages.value - 4,
        totalPages.value - 3,
        totalPages.value - 2,
        totalPages.value - 1,
        totalPages.value
      );
    } else {
      pages.push(
        1,
        "...",
        currentPage.value - 1,
        currentPage.value,
        currentPage.value + 1,
        "...",
        totalPages.value
      );
    }
  }
  return pages;
});

function goToPage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  refetch();
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    refetch();
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
    refetch();
  }
}
</script>

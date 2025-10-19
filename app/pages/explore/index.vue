<template>
  <div class="md:space-y-4">
    <div
      v-if="toggleType !== 'list'"
      class="w-full md:hidden fixed top-0 left-0 px-4 py-4 flex justify-between items-center z-30"
    >
      <div
        @click="showModal = true"
        class="w-[48px] h-[48px] rounded-full bg-[#FAFAED] flex items-center justify-center text-[#B0B72E]"
      >
        <Icon icon="mage:filter" width="24" height="24" />
      </div>
      <div
        @click.stop="
          selectedDistance = '';
          toggleType = 'list';
          pageSize = 12;
        "
        class="w-[48px] h-[48px] rounded-full bg-[#FAFAED] flex items-center justify-center text-[#B0B72E]"
      >
        <Icon icon="tabler:list" width="24" height="24" />
      </div>
    </div>
    <div v-if="toggleType === 'list'" class="md:hidden block">
      <mobile-nav />
    </div>
    <AdvanceFilter
      v-model="showModal"
      :initial-category="''"
      :initial-sub-category="''"
      :initial-distance="''"
      :initial-excluded-areas="[]"
      @apply="handleApply"
      @close="handleClose"
    />
    <div
      class="md:block hidden border border-[#F3F4F6] bg-white rounded-[12px] p-5"
    >
      <h1 class="text-2xl font-bold text-[#12A0D8]">Explore Services</h1>
      <p class="text-[#6B7280] text-sm">
        Manage services: view, edit, and add new services
      </p>
    </div>
    <div
      :class="`md:border border-[#F3F4F6] md:flex-row md:flex ${
        toggleType === 'list' ? 'flex' : 'hidden'
      } flex-col flex-wrap justify-between gap-6 md:items-center md:bg-white bg-[#12A0D8] md:rounded-[12px] p-5`"
    >
      <div
        class="bg-white border border-gray-300 md:rounded-[10px] rounded-full p-3 focus:outline-none flex gap-4 w-full justify-between items-center focus:ring-2 flex-1 focus:ring-blue-500"
      >
        <Icon
          icon="ri:search-line"
          width="20"
          height="20"
          style="color: #374151"
        />
        <input
          id="search"
          v-model="searchQuery"
          type="text"
          placeholder="Search by services name"
          class="w-full border-0 outline-0 p-0 m-0"
        />
      </div>
      <div class="flex items-center gap-2">
        <div
          @click="showModal = true"
          class="py-3 px-5 cursor-pointer rounded-full flex items-center gap-2 border border-[#E5E7EB] bg-[#F9FAFB]"
        >
          <Icon
            icon="mage:filter"
            width="20"
            height="20"
            style="color: #374151"
          />

          <span class="text-sm text-[#374151]">Filter</span>
        </div>
        <div
          class="rounded-full flex-1 w-full flex items-center gap-2 border border-[#E5E7EB] bg-[#F9FAFB] p-1"
        >
          <div
            @click="
              selectedDistance = '5';
              toggleType = 'map';
              pageSize = 1000;
            "
            :class="`${
              toggleType === 'map'
                ? 'text-[#B0B72E] bg-white'
                : 'text-[#6B7280]'
            } flex gap-2 items-center  rounded-full flex-1 text-sm font-medium py-2 px-3.5 cursor-pointer`"
          >
            <Icon
              icon="material-symbols:map-outline-rounded"
              width="20"
              height="20"
            />
            <p>Map</p>
          </div>
          <div
            @click="
              selectedDistance = '';
              toggleType = 'list';
              pageSize = 12;
            "
            :class="`${
              toggleType === 'list'
                ? 'text-[#B0B72E] bg-white'
                : 'text-[#6B7280]'
            } flex gap-2 items-center  rounded-full flex-1 text-sm font-medium py-2 px-3.5 cursor-pointer`"
          >
            <Icon icon="tabler:list" width="20" height="20" />
            <p>List</p>
          </div>
        </div>
      </div>
    </div>
    <SearchModal :isOpen="isLoading" @close="!isLoading" />

    <div>
      <div
        v-if="toggleType === 'map'"
        class="flex items-start md:h-screen h-[90vh] gap-6"
      >
        <div class="flex-1 bg-white h-full md:rounded-[16px] relative">
          <div
            v-if="isLoading"
            class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10"
          >
            <div class="text-[#12A0D8] flex items-center gap-2">
              <Icon icon="eos-icons:loading" width="24" height="24" />
              <span>Loading services...</span>
            </div>
          </div>
          <Map
            v-else
            :services="services"
            :initial-lat="selectedCoordinates?.lat"
            :initial-lng="selectedCoordinates?.lng"
            :origin="selectedCoordinates"
            :destination="selectedServiceLocation"
            @locationSelected="handleLocationSelected"
          />
        </div>
        <div class="md:w-4/12 md:block hidden space-y-4 h-full overflow-y-auto">
          <h4 class="font-medium">Nearby Services</h4>
          <div v-for="service in sortedServices.slice(0, 10)" :key="service.id">
            <ServiceCard
              :service="service"
              @directions="handleDirections"
              :isSelected="service.id === selectedService?.id"
            />
          </div>
        </div>
      </div>
      <div
        v-else-if="toggleType === 'list'"
        class="space-y-4 md:px-0 px-5 py-4"
      >
        <div
          v-if="data?.results.length"
          class="grid md:grid-cols-3 grid-cols-1 gap-6"
        >
          <div v-for="service in data?.results" :key="service.id">
            <ServiceCard :service="service" @directions="handleDirections" />
          </div>
        </div>
        <div v-else class="text-center text-[#6B7280]">No services found.</div>
        <div class="mt-8 flex w-full justify-center">
          <nav
            class="flex items-center space-x-1"
            role="navigation"
            aria-label="pagination"
          >
            <button
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 disabled:pointer-events-none disabled:opacity-50"
              :disabled="currentPage === 1"
              @click="prevPage"
            >
              Prev
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
              class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 disabled:pointer-events-none disabled:opacity-50"
              :disabled="currentPage === totalPages"
              @click="nextPage"
            >
              Next
            </button>
          </nav>
        </div>
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

const selectedCoordinates = computed(() => {
  return {
    lat: useLocationStore().lat,
    lng: useLocationStore().lng,
  };
});
const coords = computed(() => selectedCoordinates.value);
const selectedService = computed(() => useLocationStore().selectedService);
// State for selected service location for directions
const selectedServiceLocation = computed(() => {
  return useLocationStore().selectedServiceLocation;
});

// Filter/search refs
const searchQuery = ref("");
const selectedCategory = ref<string>("");
const selectedDistance = ref<string>("5");
const excludedAreas = ref<string[] | null>(null);

// Pagination state
const currentPage = ref(1);
const pageSize = ref(1000);
const totalPages = computed(() => {
  if (!data?.value?.count) return 1;
  return Math.ceil(data.value.count / pageSize.value);
});

const reactivePage = computed(() => currentPage.value);
const reactivePageSize = computed(() => pageSize.value);
const { data, error, isLoading, refetch } = UseMapServices(
  reactivePage,
  reactivePageSize,
  coords,
  {
    search: searchQuery,
    category: selectedCategory,
    distance: selectedDistance,
    excludedAreas: excludedAreas,
  }
);

// Refetch when coordinates change
watch(
  () => coords.value,
  () => {
    if (coords.value?.lat && coords.value?.lng) {
      refetch();
    }
  },
  { immediate: true }
);
const services = computed(() => {
  return data.value?.results ?? [];
});
const sortedServices = computed(() => {
  if (!data.value?.results) return [];

  const services = [...data.value.results].slice(0, 10);
  const selectedId = selectedService.value?.id;

  if (!selectedId) {
    return services;
  }

  // Split into selected and non-selected
  const selected = services.filter((s) => s.id === selectedId);
  const others = services.filter((s) => s.id !== selectedId);

  // Return selected first, then others
  return [...selected, ...others];
});
const toggleType = ref("map");
const showModal = ref(false);

const handleApply = (data: {
  category: string;
  subCategory: string;
  distance: string;
  excludedAreas: string[];
}) => {
  // Expecting data to contain { category, subCategory, distance, excludedAreas }
  // Map incoming values into our refs used by the query hook
  selectedCategory.value = data.category;
  // If the user provided a sub-category, prefer it for more specific filtering

  selectedDistance.value = data.distance;
  excludedAreas.value = data.excludedAreas;

  // reset pagination
  currentPage.value = 1;
  // trigger refetch
  refetch();
};

const handleClose = () => {
  console.log("Modal closed");
};

// Debounced search watcher
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
watch(
  () => searchQuery.value,
  () => {
    if (searchDebounceTimer) clearTimeout(searchDebounceTimer);
    searchDebounceTimer = setTimeout(() => {
      currentPage.value = 1;
      refetch();
    }, 500);
  }
);

// Pagination page numbers logic
const paginationPages = computed(() => {
  const pages: (number | string)[] = [];
  if (totalPages.value <= 7) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i);
  } else {
    if (currentPage.value <= 4) {
      pages.push(1, 2, 3, "...", totalPages.value);
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

// Handle location selection from map
function handleLocationSelected(coords: {
  lat: number;
  lng: number;
  address: string;
  district: string;
}) {
  // selectedCoordinates.value = { lat: coords.lat, lng: coords.lng };
  useLocationStore().setLocation(
    coords.lat,
    coords.lng,
    coords.address,
    coords.district
  );

  // Refetch services with new coordinates
  currentPage.value = 1;
  refetch();
}

// Handle directions button click from ServiceCard
function handleDirections(service: any) {
  if (!selectedCoordinates.value) {
    alert("User location not available");
    return;
  }
  const destLat = Number(service.details.lat);
  const destLng = Number(service.details.lng);
  if (!destLat || !destLng) {
    alert("Service location not available");
    return;
  }
  toggleType.value = "map";
  useLocationStore().setSelectedServiceLocation(
    { lat: destLat, lng: destLng },
    service
  );
  pageSize.value = 1000;
}
</script>

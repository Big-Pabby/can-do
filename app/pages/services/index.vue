<template>
  <div class="space-y-6 relative">
    <DataCollectionModal
      :isOpen="isModalOpen"
      :loading="collectPending"
      :data="districts"
      @close="isModalOpen = false"
      @submit="handleDataSubmit"
    />
    <ProgressModal
      :isOpen="isProgressOpen"
      :status="progressWS.message.value"
      :success="progressWS.successCount.value"
      :failed="progressWS.failureCount.value"
      :initialProgress="progressWS.progress.value"
      @complete="handleComplete"
      @refresh="handleRefresh"
      @cancel="handleCancel"
    />
    <RerunNotification
      v-if="progressState.show"
      :progress="progressState.progress"
      :status="progressState.status"
      :title="progressState.title"
      :message="progressState.message"
      :cancelable="progressState.status === 'loading'"
      @cancel="handleProgressCancel"
      @close="handleProgressClose"
    />
    <div
      class="sticky top-20 left-0 z-20  bg-white border border-[#F3F4F6] rounded-[12px] p-4 flex justify-between items-center gap-6"
    >
      <div class="flex-1">
        <h1 class="text-[28px] font-bold text-[#12A0D8]">
          Available Services ({{ data?.count }})
        </h1>
        <p class="mt-2 text-[#6B7280] text-sm">
          Browse and filter through our comprehensive list of services
        </p>
      </div>
      <button
        class="bg-[#B0B72E] py-2.5 px-12 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed"
        @click="isModalOpen = true"
      >
        Data Collection
      </button>
      <button
        class="bg-[#12A0D8] py-2.5 px-12 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="selectedIds.length === 0 || isPending"
        @click="handleRerun"
      >
        <span v-if="isPending">Re-running...</span>
        <span v-else>Re-run</span>
      </button>
    </div>
    <div class="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4">
      <div
        v-for="(category, index) in categories"
        :key="index"
        class="flex flex-col items-center gap-2 p-4 border border-[#F3F4F6] rounded-[12px] bg-white"
      >
        <div
          class="h-[52px] w-[52px] bg-[#E0E7FF] rounded-full flex items-center justify-center"
        >
          <span class="text-2xl">
            {{ categoryEmojis[index] || "❓" }}
          </span>
        </div>
        <p class="text-[#4B5563] text-xs line-clamp-1">{{ index }}</p>
        <h4 class="text-[#111827] text-sm font-medium">
          {{ category }} Services
        </h4>
      </div>
    </div>
    <!-- Filters -->
    <div
      class="bg-white border border-[#F3F4F6] rounded-[12px] p-4 flex md:flex-row flex-col gap-4"
    >
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search services..."
        class="flex bg-white h-12 md:w-6/12 rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
      />
      <div class="flex-1 w-full flex gap-4">
        <CustomSelect
          v-model="selectedCategory"
          :options="categories"
          placeholder="All Categories"
          class="flex-1"
        />

        <CustomSelect
          v-model="selectedDistricts"
          :options="districts"
          placeholder="All Local Authority"
          class="flex-1"
        />
      </div>
    </div>
    <div class="bg-white rounded-[16px] px-4 space-y-4 py-4 lg:px-4">
      <div class="bg-white overflow-x-auto">
        <Table class="">
          <TableHeader>
            <TableRow>
              <TableHead>
                <div class="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    @change="
                      (e) => {
                        if (e.target && e.target.checked) {
                          selectedIds = services.map((s) => s.id);
                        } else {
                          selectedIds = [];
                        }
                      }
                    "
                    class="text-white accent-[#12A0D8] h-4 w-4 border-gray-300 rounded"
                  />
                </div>
              </TableHead>
              <TableHead><p class="text-left">Service Name</p> </TableHead>
              <TableHead>Categories </TableHead>
              <!-- <TableHead>Sub-Categories </TableHead> -->
              <TableHead>Location </TableHead>
              <TableHead>Rating </TableHead>
              <TableHead>UpdatedAt </TableHead>
              <TableHead> Action </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="text-sm">
            <TableRow v-for="(service, index) in services" :key="index">
              <TableCell>
                <div class="">
                  <input
                    type="checkbox"
                    :value="service.id"
                    v-model="selectedIds"
                    class="accent-[#12A0D8] h-4 w-4 border-gray-300 rounded"
                    :aria-label="`Select service ${service.details?.name}`"
                  />
                </div>
              </TableCell>
              <TableCell class="!border-b !border-[#E5E7EB]">
                <div class="flex gap-2 w-[250px] items-start">
                  <Icon
                    v-if="service.has_changes"
                    icon="cuida:info-outline"
                    width="20"
                    height="20"
                    style="color: #12a0d8"
                  />

                  <NuxtLink
                    :to="`/services/${service.id}`"
                    class="text-primary font-semibold flex-1 hover:underline block truncate"
                    >{{ service.details?.name }}</NuxtLink
                  >
                </div>
              </TableCell>
              <TableCell>
                <div class="flex flex-wrap gap-2">
                  <template
                    v-for="cat in typeof service.details?.category === 'string'
                      ? service.details.category
                          .split(',')
                          .map((c) => c.trim())
                          .filter(Boolean)
                      : []"
                    :key="cat"
                  >
                    <span
                      class="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground truncate"
                      >{{ cat }}</span
                    >
                  </template>
                </div>
              </TableCell>
              <!-- <TableCell>
                <div class="flex flex-wrap gap-2">
                  <template
                    v-for="cat in typeof service.details?.subcategories ===
                    'string'
                      ? service.details.subcategories
                          .split(',')
                          .map((c) => c.trim())
                          .filter(Boolean)
                      : []"
                    :key="cat"
                  >
                    <span
                      class="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground truncate"
                      >{{ cat }}</span
                    >
                  </template>
                </div>
              </TableCell> -->
              <TableCell>
                <div class="w-[150px] line-clamp-2 block truncate text-wrap">
                  <p class="line-clamp-2 text-wrap">
                    {{ service.details?.address }}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div class="flex items-center gap-2">
                  <span class="text-yellow-400 text-base">★</span>
                  <span class="font-semibold">{{
                    service.details?.rating
                  }}</span>
                  <span class="text-muted-foreground"
                    >({{ service.details?.reviews }})</span
                  >
                </div>
              </TableCell>
              <TableCell>
                <p class="w-[200px]">{{ formatDate(service.date_updated) }}</p>
              </TableCell>
              <TableCell>
                <div class="flex gap-2 items-center text-[#4B5563]">
                  <nuxt-link
                    :to="`/services/${service.id}`"
                    aria-label="View Service Details"
                    ><Icon icon="iconamoon:eye" width="20" height="20"
                  /></nuxt-link>

                  <!-- <Icon icon="iconamoon:edit" width="20" height="20" /> -->
                  <InfoDialog :serviceId="service.id" />
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <!-- Services Table -->

      <!-- Pagination -->
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
            Previous
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
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useServices } from "~/composables/useServices";
import { useFetchServiceUpdates } from "../hooks/index";
import { Icon } from "@iconify/vue";
import { UseCategories } from "../hooks/index";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { toast } from "vue-sonner";
import InfoDialog from "../components/InfoDialog.vue";
import ProgressToast from "../components/ProgressToast.vue";
import { UseProgress } from "../hooks";
import { UseDataCollection } from "./hooks";
import { useAuthStore } from "~/store/auth";
import { UseMapServices } from "../map/hooks";
import { UseDistrict } from "~/pages/services/hooks";

definePageMeta({
  layout: "admin",
});
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const isProgressOpen = ref(false);
const searchQuery = ref("");
const selectedDistricts = ref("");
const selectedCategory = ref<string>("");
const progressWS = useProgressWebSocket();
const jobid = computed(() => useAuthStore().jobId);

// Pagination state
const currentPage = ref(1);
const pageSize = ref(100);
const totalPages = computed(() => {
  if (!data?.value?.count) return 1;
  return Math.ceil(data.value.count / pageSize.value);
});

const reactivePage = computed(() => currentPage.value);
const reactivePageSize = computed(() => pageSize.value);
const coords = computed(() => null);

const { data: districtsData, isLoading: districtLoading } = UseDistrict();
const districts = computed(() =>
  (districtsData.value || [])
    .slice()
    .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
);
const {
  data,
  error: serviceError,
  isLoading,
  refetch,
} = UseMapServices(reactivePage, reactivePageSize, coords, {
  search: searchQuery,
  category: selectedCategory,
  district: selectedDistricts,
});
const { data: categoriesData, isLoading: categoriesLoading } = UseCategories();
const categories = computed(() => categoriesData.value || {});
const services = computed(() => data.value?.results || []);
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
const startPulling = () => {
  if (!jobid.value) {
    console.error("No job ID provided");
    toast.error("No job ID provided for progress tracking");
    return;
  }
  // Show progress modal
  isProgressOpen.value = true;

  // Connect to WebSocket
  // Option 1: If your backend WebSocket URL is different
  progressWS.connect(
    jobid.value,
    `wss://app.candopeople.uk/v1/services/data_collection_status/${jobid.value}`
  );
  console.log(progressWS.progress);

  // Option 2: If using default URL
  // progressWS.connect(jobId)

  // Option 3: If using polling instead
  // progressWS.startPolling(jobId)
};
watch(
  () => jobid.value,
  (newJobId) => {
    if (newJobId != null) {
      startPulling();
    } else {
      isProgressOpen.value = false;
      progressWS.reset();
    }
  },
  { immediate: true }
);
const handleComplete = () => {
  console.log("Data pulling complete!");
  // toast.success("Services data updated successfully!", {
  //   style: {
  //     background: "#F0FDF4",
  //     border: "1px solid #BBF7D0",
  //     color: "#16A34A",
  //   },
  // });

  // Optionally close the modal after a delay
};

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

const handleCancel = () => {
  // Clear the job ID which will trigger the watcher to clean up
  useAuthStore().setJobId(null);

  // Show cancellation toast
  toast.info("Data collection cancelled", {
    style: {
      background: "#F3F4F6",
      border: "1px solid #E5E7EB",
      color: "#374151",
    },
  });

  // Close the progress modal
  isProgressOpen.value = false;

  // Disconnect WebSocket
  progressWS.disconnect();
};

const handleRefresh = () => {
  // Reload the page or refresh data
  window.location.reload();
};

const isModalOpen = ref(false);
const { mutate, isPending: collectPending } = UseDataCollection();

const handleDataSubmit = (data: any) => {
  console.log("Selected data:", data);
  mutate(
    { location_query: data.districts.join(","), radius: data.radius * 1000 },
    {
      onSuccess: async ({ data }) => {
        toast.success("Data Collection Initiated!", {
          style: {
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            color: "#16A34A",
          },
        });
        const jobId = data.job_id;
        useAuthStore().setJobId(jobId);
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || "Failed to re-run.";
        toast.error(msg);
      },
    }
  );
};

const selectedIds = ref<string[]>([]);
const deleteDialogOpen = ref<boolean>(false);
const jobId = ref<string>("");

const { data: progressData, refetch: progressRefetch } = UseProgress(jobId);

const progressState = ref({
  show: false,
  progress: 0,
  status: "loading" as "loading" | "success" | "error",
  title: "Processing",
  message: "Please wait...",
});

// Watch for progress changes (simpler version)
watch(
  () => progressData.value?.progress,
  (newProgress) => {
    if (newProgress == null) return;

    if (newProgress < 100) {
      progressState.value = {
        show: true,
        progress: newProgress,
        status: "loading",
        title: "Re-running Services",
        message: "Please wait while we re-run the services...",
      };
    } else {
      progressState.value = {
        show: true,
        progress: 100,
        status: "success",
        title: "Complete!",
        message: "Re-run complete! Services have been updated.",
      };

      selectedIds.value = [];
      refetch();
    }
  }
);

// Cancel handler
const handleProgressCancel = async () => {
  try {
    await cancelJob(jobId);
    progressState.value = {
      show: true,
      progress: progressData.value?.progress || 0,
      status: "error",
      title: "Cancelled",
      message: "Operation has been cancelled.",
    };
  } catch (error) {
    console.error("Failed to cancel:", error);
  }
};

// Close handler
const handleProgressClose = () => {
  progressState.value.show = false;
};

const {
  mutate: rerunMutation,
  isPending,
  isSuccess,
  isError,
  error,
} = useFetchServiceUpdates();

function handleRerun() {
  rerunMutation(selectedIds.value, {
    onSuccess: ({ data }) => {
      jobId.value = data.job_id;
      toast.success("Re-run Triggered!", {
        style: {
          background: "#F0FDF4",
          border: "1px solid #BBF7D0",
          color: "#16A34A",
        },
        class: "my-toast",
        descriptionClass: "my-toast-description",
      });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to re-run.";
      toast.error(msg);
    },
  });
}
onUnmounted(() => {
  progressWS.disconnect();
});
</script>

<style scoped>
input[type="checkbox"] {
  accent-color: #12a0d8;
  color: #fff;
}
input[type="checkbox"]:checked {
  color: white; /* ✅ white tick */
}
</style>

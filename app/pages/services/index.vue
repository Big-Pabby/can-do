<template>
  <div class="">
    <div class="bg-white rounded-[16px] px-4 space-y-4 py-8 sm:px-6 lg:px-8">
      <div class="mb-8 flex justify-between items-center gap-6">
        <div class="flex-1">
          <h1 class="text-3xl font-bold text-[#12A0D8]">Available Services ({{ filteredServices.length }})</h1>
          <p class="mt-2 text-sm">
            Browse and filter through our comprehensive list of services
          </p>
        </div>
        <button
          class="bg-[#12A0D8] py-2.5 px-12 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="selectedIds.length === 0 || isPending"
          @click="handleRerun"
        >
          <span v-if="isPending">Re-running...</span>
          <span v-else>Re-run</span>
        </button>
      </div>

      <!-- Filters -->
      <div class="flex md:flex-row flex-col gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search services..."
          class="flex bg-white h-12 md:w-6/12 rounded-md border border-[#E5E7EB] px-3 py-2 text-sm"
        />

        <select
          v-model="selectedCategory"
          class="flex h-12 flex-1 w-full rounded-md border border-[#E5E7EB] px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white"
        >
          <option value="all">All Categories</option>
          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>
      </div>

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
                          selectedIds = filteredServices.map((s) => s.id);
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
              <TableHead>Organization </TableHead>
              <TableHead>Categories </TableHead>
              <TableHead>Location </TableHead>
              <TableHead>Rating </TableHead>
              <TableHead> Status </TableHead>
              <TableHead> Action </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody class="text-sm">
            <TableRow v-for="(service, index) in filteredServices" :key="index">
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
              <TableCell>{{ service.details?.org_name }}</TableCell>
              <TableCell>
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
              </TableCell>
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
                    >({{ service.details?.total_ratings }})</span
                  >
                </div>
              </TableCell>
              <TableCell>
                <span
                  :class="{
                    'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold': true,
                    'bg-green-50 text-green-900':
                      service.details?.verification_status === 'Verified',
                    'bg-yellow-50 text-yellow-900':
                      service.details?.verification_status === 'Pending',
                    'bg-gray-100 text-gray-700':
                      !service.details?.verification_status,
                  }"
                >
                  {{ service.details?.verification_status ?? "Unverified" }}
                </span>
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
      <!-- <div class="mt-8 flex w-full justify-center">
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
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useServices } from "~/composables/useServices";
import { useFetchServiceUpdates } from "../hooks/index";
import { Icon } from "@iconify/vue";
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

const {
  paginatedServices,
  currentPage,
  totalPages,
  categories,
  searchQuery,
  filteredServices,
  selectedCategory,
  verificationStatuses,
  selectedVerification,
  nextPage,
  prevPage,
  goToPage,
  refetch,
} = useServices();

const selectedIds = ref<string[]>([]);
const deleteDialogOpen = ref<boolean>(false);

const {
  mutate: rerunMutation,
  isPending,
  isSuccess,
  isError,
  error,
} = useFetchServiceUpdates();

function handleRerun() {
  console.log(selectedIds.value);
  rerunMutation(selectedIds.value, {
    onSuccess: () => {
      toast.success("Re-run Triggered!", {
        style: {
          background: "#F0FDF4",
          border: "1px solid #BBF7D0",
          color: "#16A34A",
        },
        class: "my-toast",
        descriptionClass: "my-toast-description",
      });
      refetch();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to re-run.";
      toast.error(msg);
    },
  });
  refetch();
}

const paginationPages = computed(() => {
  const pages: (number | string)[] = [];
  const total = typeof totalPages?.value === "number" ? totalPages.value : 1;
  const current =
    typeof currentPage?.value === "number" ? currentPage.value : 1;
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i);
    return pages;
  }
  pages.push(1);
  if (current > 4) pages.push("...");
  for (
    let i = Math.max(2, current - 2);
    i <= Math.min(total - 1, current + 2);
    i++
  ) {
    if (i === 1 || i === total) continue;
    pages.push(i);
  }
  if (current < total - 3) pages.push("...");
  pages.push(total);
  return pages;
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

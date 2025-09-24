<template>
  <div>
    <div class="bg-[#12A0D8] py-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8 text-white">
          <h1 class="text-3xl font-bold">Available Services</h1>
          <p class="mt-2 text-sm text-white">
            Browse and filter through our comprehensive list of services
          </p>
        </div>

        <!-- Filters -->
        <div class="flex md:flex-row flex-col gap-4">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search services..."
            class="flex bg-white h-12 md:w-6/12 rounded-md border border-input px-3 py-2 text-sm"
          />

          <select
            v-model="selectedCategory"
            class="flex h-12 w-full rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-white"
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
        <!-- Verification status filter row -->
        
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Services Table -->

      <div class="overflow-x-auto bg-white rounded-lg shadow">
        <table class="min-w-full divide-y divide-gray-200 sm:table-fixed">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:w-1/3"
              >
                Service
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:w-1/6"
              >
                Organization
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Categories
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Location
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Rating
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Verification Status
              </th>
              <th class="px-6 py-3 sm:w-[96px]"></th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="(service, index) in paginatedServices"
              :key="service.details?.service_id ?? index"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 overflow-hidden">
                <div class="text-sm font-medium text-gray-900">
                  <div class="w-[250px]">
                    <NuxtLink
                      :to="`/services/${service.id}`"
                      class="text-primary font-semibold hover:underline block truncate max-w-[14rem] sm:max-w-full"
                      >{{ service.details?.name }}</NuxtLink
                    >
                    <div
                      class="text-xs text-muted-foreground truncate max-w-[14rem] sm:max-w-full"
                    >
                      {{ service.details?.description }}
                    </div>
                  </div>
                </div>
              </td>

              <td
                class="px-6 py-4 overflow-hidden text-sm text-muted-foreground truncate"
              >
                {{ service.details?.org_name }}
              </td>

              <td class="px-6 py-4 text-sm">
                <div class="flex flex-wrap gap-2">
                  <template
                    v-for="cat in typeof service.details?.categories ===
                    'string'
                      ? service.details.categories
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
              </td>

              <td
                class="w-[200px] px-6 py-4 overflow-hidden text-sm text-muted-foreground truncate"
              >
                {{ service.details?.address }}
              </td>

              <td class="px-6 py-4 text-sm">
                <div class="flex items-center gap-2">
                  <span class="text-yellow-400">★</span>
                  <span class="font-semibold">{{
                    service.details?.avg_rating
                  }}</span>
                  <span class="text-muted-foreground"
                    >({{ service.details?.review_count }})</span
                  >
                </div>
              </td>

              <!-- Verification status column (aligns with header) -->
              <td class="px-6 py-4 text-sm text-muted-foreground">
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
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <NuxtLink
                  :to="`/services/${service.id}`"
                  class="inline-flex items-center rounded-md border px-3 py-1 text-sm font-medium bg-background hover:bg-accent"
                  >Learn More</NuxtLink
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>

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
import { computed } from "vue";
import { useServices } from "~/composables/useServices";

const {
  paginatedServices,
  currentPage,
  totalPages,
  categories,
  searchQuery,
  selectedCategory,
  verificationStatuses,
  selectedVerification,
  nextPage,
  prevPage,
  goToPage,
} = useServices();

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
/* Add any additional custom styles here */
</style>

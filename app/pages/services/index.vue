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
      </div>
    </div>
    <div class="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <!-- Header -->

      <!-- Services Grid -->
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(service, index) in paginatedServices"
          :key="index"
          class="rounded-lg border bg-card text-card-foreground shadow-sm transition-transform hover:scale-105"
        >
          <div class="p-6">
            <div class="flex flex-col space-y-1.5">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold line-clamp-1">
                  {{ service.details.name }}
                </h3>
                <span
                  :class="{
                    'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2': true,
                    'bg-green-50 text-green-900 hover:bg-green-100':
                      service.details.verification_status === 'Verified',
                    'bg-yellow-50 text-yellow-900 hover:bg-yellow-100':
                      service.details.verification_status === 'Pending',
                  }"
                >
                  {{ service.details.verification_status }}
                </span>
              </div>
              <p class="text-sm text-muted-foreground">
                {{ service.details.org_name }}
              </p>
            </div>
            <div class="p-0">
              <p class="text-sm text-muted-foreground mt-4 line-clamp-2">
                {{ service.details.description }}
              </p>
              <div class="mt-4 flex flex-wrap gap-2">
                <span
                  class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  {{ service.details.categories }}
                </span>
              </div>
              <div class="mt-4 border-t pt-4">
                <p
                  class="flex items-center text-sm text-muted-foreground line-clamp-1"
                >
                  {{ service.details.address }}
                </p>
                <div
                  class="flex items-center mt-2 text-sm text-muted-foreground"
                >
                  {{ service.details.hours }}
                </div>
              </div>
            </div>
            <div class="mt-4 flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <div class="flex items-center">
                  <span class="text-yellow-400">★</span>
                  <span class="ml-1 text-sm">{{
                    service.details.avg_rating
                  }}</span>
                </div>
                <span class="text-sm text-muted-foreground"
                  >{{ service.details.review_count }} reviews</span
                >
              </div>
              <NuxtLink
                :to="`/services/${service.id}`"
                class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                Learn More
              </NuxtLink>
            </div>
          </div>
        </div>
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
import { useServices } from "~/composables/useServices";

const {
  paginatedServices,
  currentPage,
  totalPages,
  categories,
  searchQuery,
  selectedCategory,
  nextPage,
  prevPage,
  goToPage,
} = useServices();
const paginationPages = computed(() => {
  const pages = [];
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

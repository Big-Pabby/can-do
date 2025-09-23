<template>
  <div
    class="min-h-screen py-8 bg-gradient-to-br from-background to-secondary/30"
  >
    <div class="max-w-2xl mx-auto px-4">
      <div
        v-if="isLoading"
        class="text-center py-8 animate-pulse text-lg text-muted-foreground"
      >
        Loading service details...
      </div>
      <div
        v-else-if="isError"
        class="text-center py-8 text-red-500 font-semibold"
      >
        Error loading service.
      </div>
      <div
        v-else-if="service"
        class="bg-card rounded-2xl shadow-xl p-8 transition hover:shadow-2xl"
      >
        <!-- Card Header -->
        <div class="flex md:flex-row flex-col-reverse md:items-center  items-start justify-between gap-4 mb-6">
          <div class="flex items-center gap-3">
           
            <div>
              <h1 class="text-2xl font-bold leading-tight">
                {{ service.details.name }}
              </h1>
              <p class="text-muted-foreground text-sm">
                {{ service.details.org_name }}
              </p>
            </div>
          </div>
          <span
            :class="{
              'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors': true,
              'bg-green-50 text-green-900 border-green-200':
                service.details.verification_status === 'Verified',
              'bg-yellow-50 text-yellow-900 border-yellow-200':
                service.details.verification_status === 'Pending',
              'bg-red-50 text-red-900 border-red-200':
                service.details.verification_status === 'Rejected',
            }"
          >
            {{ service.details.verification_status }}
          </span>
        </div>
        <!-- Description -->
        <div class="mb-6">
          <h2 class="font-semibold text-lg mb-2 text-primary">Description</h2>
          <p class="text-base text-muted-foreground">
            {{ service.details.description }}
          </p>
        </div>
        <!-- Categories -->
        <div class="mb-6">
          <h2 class="font-semibold text-lg mb-2 text-primary">Categories</h2>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="cat in categoriesArr"
              :key="cat"
              class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-secondary text-secondary-foreground shadow"
              >{{ cat }}</span
            >
          </div>
        </div>
        <!-- Info Grid -->
        <div class="grid grid-cols-1  gap-6 mb-6">
          <div class="flex items-center gap-2">
            <i class="fas fa-map-marker-alt text-primary"></i>
            <span class="font-semibold">Address:</span>
            <span class="text-muted-foreground">{{
              service.details.address
            }}</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fas fa-clock text-primary"></i>
            <span class="font-semibold">Hours:</span>
            <span class="text-muted-foreground">{{
              service.details.hours
            }}</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fas fa-phone text-primary"></i>
            <span class="font-semibold">Contact:</span>
            <span class="text-muted-foreground">{{
              service.details.contact
            }}</span>
          </div>
          <div class="flex items-center gap-2">
            <i class="fas fa-user-check text-primary"></i>
            <span class="font-semibold">Eligibility:</span>
            <span class="text-muted-foreground">{{
              service.details.eligibility
            }}</span>
          </div>
        </div>
        <!-- Ratings & Reviews -->
        <div class="flex items-center gap-6 border-t pt-6">
          <div class="flex items-center gap-2">
            <span class="text-yellow-400">★</span>
            <span class="font-semibold">{{ service.details.avg_rating }}</span>
            <span class="text-muted-foreground"
              >({{ service.details.review_count }} reviews)</span
            >
          </div>
        </div>
      </div>
      <div v-else class="text-center py-8 text-muted-foreground">
        Service not found.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import https from "@/utils/https";

const route = useRoute();
const id = route.params.id as string;

const { data, isLoading, isError } = useQuery({
  queryKey: ["service", id],
  queryFn: async () => {
    const res = await https.get(`/v1/services/${id}`);
    return res.data;
  },
  enabled: !!id,
});

const service = data;
const categoriesArr = computed(() => {
  if (!service.value) return [];
  const cats = service.value.details.categories;
  return typeof cats === "string"
    ? cats
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : [];
});
</script>

<style scoped>
/* Add any additional custom styles here */
</style>

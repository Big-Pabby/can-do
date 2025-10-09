<template>
  <div class="border border-[#F3F4F6] space-y-3 bg-white rounded-[12px] p-4">
    <h4 class="font-medium text-[#111827]">
      {{ service.details.name }}
    </h4>
    <!-- Star Rating -->
    <div class="flex items-center gap-2">
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
        <span class="text-gray-700 font-medium">
          {{ service.details?.rating === 'null' ? "N/A" : service.details.rating }}
        </span>
      </div>
      <div
        v-if="service.details.verification_status === 'verified'"
        class="ml-2 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full flex items-center gap-1"
      >
        <Icon icon="heroicons:check-circle" class="w-3 h-3" />
        <span>Verified</span>
      </div>
    </div>
    <div class="space-y-1">
      <p class="text-sm text-[#6B7280] line-clamp-1">
        {{ service.details.address === 'null' ? "N/A" : service.details.address }}
      </p>
      <p class="text-sm text-[#6B7280] line-clamp-1">
        {{ service.details?.hours === 'null' ? "N/A" : service.details.hours }}
      </p>
    </div>
    <div class="flex gap-3 justify-between">
      <button class="bg-[#12A0D8] rounded-full py-2 px-3.5 text-sm text-white">
        Call Now
      </button>
      <button
        class="border border-[#FE4D67] rounded-full py-2 px-3.5 text-sm text-[#FE4D67]"
        @click="$emit('directions', service)"
      >
        Directions
      </button>
      <nuxt-link
        :to="`/explore/${service.id}`"
        class="border border-[#B0B72E] rounded-full py-2 px-3.5 text-sm text-[#B0B72E]"
      >
        Details
      </nuxt-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Icon } from "@iconify/vue";
import type { Service } from "#imports";
const props = defineProps<{
  service: Service;
}>();
function getStarFill(rating: number | undefined, position: number): string {
  if (!rating) return "text-gray-300";

  const roundedRating = Math.round(rating);
  return position <= roundedRating ? "text-yellow-400" : "text-gray-300";
}
</script>

<template>
  <div class="space-y-4">
    <MobileNav />
    <div class="md:px-0 px-5 space-y-4">
      <div
        class="border border-[#80D6F7] bg-[#EAF8FE] p-6 rounded-[20px] flex justify-between md:flex-row flex-col md:items-center items-start gap-6"
      >
        <div class="space-y-2 md:w-6/12">
          <h2 class="font-bold text-2xl text-[#12A0D8]">
            Join the CanDO Challenge
          </h2>
          <p class="text-sm text-[#12A0D8]">
            Unlock exciting rewards as you take on fun and inspiring CanDO
            challenges. Do more, earn more!
          </p>
        </div>
        <button
          class="bg-[#12A0D8] text-white font-medium py-2 px-4 rounded-full text-sm flex items-center justify-center gap-2"
        >
          Join the challenge!
          <Icon
            icon="tabler:arrow-right"
            width="20"
            height="20"
            style="color: #fff"
          />
        </button>
      </div>
      <div class="space-y-2">
        <h4 class="font-medium">Categories</h4>
        <div class="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4">
          <div
            v-for="(category, index) in categories"
            :key="index"
            class="flex flex-col items-center gap-2 py-4.5 px-3.5 border border-[#F3F4F6] rounded-[12px] bg-white"
          >
            <div
              class="h-[52px] w-[52px] bg-[#E0E7FF] rounded-full flex items-center justify-center"
            >
              <span class="text-2xl">
                {{ categoryEmojis[index] || "❓" }}
              </span>
            </div>
            <h4 class="text-[#111827] text-sm font-medium line-clamp-1">
              {{ index }}
            </h4>
            <p class="text-[#4B5563] text-xs">{{ category }} Services</p>
            <nuxt-link
              :to="`/home/${index}`"
              class="w-full mt-4 text-center border-[#B0B72E] border rounded-full py-2 px-3.5 text-sm text-[#B0B72E] font-medium"
            >
              View Services
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="space-y-2">
        <h4 class="font-medium">Nearby Services</h4>
        <div class="lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mb-4 grid">
          <div
            v-if="loadingServices"
            class="col-span-full flex justify-center items-center h-[200px]"
          >
            <Icon
              icon="eos-icons:loading"
              class="w-8 h-8 text-[#12A0D8] animate-spin"
            />
          </div>
          <div
            v-if="!loadingServices && data?.results.length === 0"
            class="col-span-full flex justify-center items-center h-[200px] text-sm text-gray-500"
          >
            No services found in your area.
          </div>
          <div v-else v-for="service in data?.results" :key="service.id">
            <ServiceCard :service="service" @directions="handleDirections" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useLocationStore } from "~/store/location";
import { UseCategories } from "../hooks";
import { UseMapServices } from "../map/hooks";
import { useAuthStore } from "~/store/auth";
import { UseProfile } from "../hooks";
import { on } from "events";
definePageMeta({
  layout: "user",
});

const coords = computed(() => {
  return { lat: useLocationStore().lat, lng: useLocationStore().lng };
});
const reactivePage = computed(() => 1);
const reactivePageSize = computed(() => 3);
const {
  data,
  error,
  isLoading: loadingServices,
  refetch,
} = UseMapServices(reactivePage, reactivePageSize, coords);

const { data: categories, isLoading } = UseCategories();
const { data: profile } = UseProfile();

const categoryEmojis: Record<string, string> = {
  "Food & Nutrition": "🍎",
  "Shelter & Housing": "🏠",
  "Clothing & Essentials": "👕",
  "Addiction & Recovery": "💊",
  "Mental Health & Wellbeing": "🧠",
  "Health & Medical": "🏥",
  "Justice & Legal Support": "⚖️",
  "Financial & Benefits Support": "💰",
  "Employment Services": "🎓",
  "Community & General Support": "🤝",
};
watch(profile, (newProfile) => {
  if (newProfile) {
    useAuthStore().setUser(newProfile);
  }
});

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
</script>

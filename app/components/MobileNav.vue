<template>
  <div
    class="block w-full border border-[#F3F4F6] md:bg-white bg-[#12A0D8] md:rounded-[12px] p-5"
  >
    <SetLocationModal
      v-model="showLocationModal"
      :initial-address="currentAddress"
      @save="handleLocationSave"
      @close="handleLocationClose"
    />

    <h1 class="text-2xl font-bold md:text-[#12A0D8] text-white">Hi, {{ user?.username }} 👋</h1>
    <p class="md:text-[#6B7280] text-sm text-white">Welcome back, Champ</p>
    <div
      @click="showLocationModal = true"
      class="md:hidden mt-4 flex cursor-pointer items-center text-white gap-4"
    >
      <div
        class="bg-[#EAF8FE] w-[32px] h-[32px] rounded-full flex items-center justify-center font-medium text-[#12A0D8]"
      >
        <Icon icon="akar-icons:location" width="16" height="16" />
      </div>
      <div class="max-w-[200px]">
        <p class="text-xs">Location</p>
        <h4 class="text-sm font-medium underline line-clamp-1">
          {{ userLocation }}
        </h4>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useLocationStore } from "~/store/location";
import { useAuthStore } from "~/store/auth";

const userLocation = computed(
  () => useLocationStore().address || "Set Location"
);
const user = computed(() => useAuthStore().user);
const showLocationModal = ref(false);
const currentAddress = ref("");

const handleLocationSave = (data: {
  address: string;
  lat?: number;
  lng?: number;
}) => {
  console.log("Location saved:", data);
  currentAddress.value = data.address;

  // Save to local storage or API
  useLocationStore().setLocation(data.lat || 0, data.lng || 0, data.address);

  // Optional: Fetch nearby services
  // await fetchNearbyServices(data.latitude, data.longitude)
};

const handleLocationClose = () => {
  console.log("Modal closed");
};
</script>

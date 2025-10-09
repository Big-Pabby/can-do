<template>
  <div
    class="md:flex hidden fixed top-0 left-0 w-full h-[86px] bg-[#12A0D8] z-40 justify-between items-center px-12 text-white"
  >
    <SetLocationModal
      v-model="showLocationModal"
      :initial-address="currentAddress"
      @save="handleLocationSave"
      @close="handleLocationClose"
    />
    <img src="/images/logo.svg" alt="" />
    <div class="flex items-center gap-16">
      <div @click="showLocationModal = true" class="flex cursor-pointer items-center gap-4">
        <div
          class="bg-[#EAF8FE] w-[40px] h-[40px] rounded-full flex items-center justify-center font-medium text-[#12A0D8]"
        >
          <Icon icon="akar-icons:location" width="20" height="20" />
        </div>
        <div class="max-w-[200px]">
          <p class="text-xs">Location</p>
          <h4 class="text-sm font-medium underline line-clamp-1">
            {{ userLocation }}
          </h4>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div
          class="bg-[#EAF8FE] w-[40px] h-[40px] rounded-full flex items-center justify-center font-medium text-[#12A0D8]"
        >
          SM
        </div>
        <div class="flex-1">
          <h4 class="text-sm font-medium">Josh West</h4>
          <p class="text-xs">joshwest@sm.com</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { computed } from "vue";
import { useLocationStore } from "~/store/location";

const userLocation = computed(() => useLocationStore().address || "Set Location");
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

<template>
  <div
    class="md:flex hidden fixed top-0 left-0 w-full h-[86px] bg-[#12A0D8] z-40 justify-between items-center px-12 text-white"
  >
    <img src="/images/logo.svg" alt="" />
    <div class="flex items-center gap-16">
      <div class="flex items-center gap-4">
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

const userLocation = computed(() => {
  if (typeof window !== "undefined") {
    const loc = localStorage.getItem("location");
    if (loc) {
      try {
        const obj = JSON.parse(loc);
        return obj.address || `${obj.lat}, ${obj.lng}`;
      } catch {
        return "Location not found";
      }
    }
  }
  return "Location not found";
});
</script>

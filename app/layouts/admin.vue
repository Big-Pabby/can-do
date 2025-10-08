<template>
  <div class="min-h-screen bg-[#F9FAFB]">
    <div
      class="md:block hidden fixed top-0 left-0 w-[220px] bg-white h-[100vh] z-40 p-6"
    >
      <div class="h-[86px]">
        <img
          src="/android-chrome-192x192.png"
          class="object-contain rounded-[8px] w-[50px]"
          alt=""
        />
      </div>
      <nuxt-link
        to="/services"
        class="flex items-center gap-2 text-[#12A0D8] font-medium p-4 w-full bg-[#EAF8FE] rounded-[8px]"
        ><Icon
          icon="mingcute:grid-line"
          width="24"
          height="24"
        />Services</nuxt-link
      >
    </div>
    <div
      class="md:flex hidden fixed top-0 left-0 w-full h-[86px] bg-white z-30 justify-end px-12"
    >
      <div class="flex items-center gap-4">
        <div
          class="bg-[#EAF8FE] w-[40px] h-[40px] rounded-full flex items-center justify-center font-medium text-[#12A0D8]"
        >
          SM
        </div>
        <div class="flex-1">
          <h4 class="text-sm text-[#111827] font-medium">Josh West</h4>
          <p class="text-xs text-[#4B5563]">joshwest@sm.com</p>
        </div>
      </div>
    </div>

    <div class="md:ml-[220px] md:p-8 p-5 md:mt-[86px]">
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

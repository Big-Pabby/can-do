<template>
  <div class="min-h-screen bg-[#F9FAFB]">
    <div
      class="md:block hidden fixed top-0 left-0 w-[220px] bg-white h-[100vh] z-30 px-4 pt-[100px] pb-4 "
    >
     
      <nuxt-link
        to="/services"
        class="flex items-center gap-2 text-[#12A0D8] text-sm font-medium p-4 w-full bg-[#EAF8FE] rounded-[8px]"
        ><Icon icon="mingcute:grid-line" width="24" height="24" />Services
        Directory</nuxt-link
      >
    </div>
    <div
      class="md:flex hidden fixed top-0 left-0 w-full h-[86px] bg-[#12A0D8] z-40 justify-between items-center px-8"
    >
      <img src="/images/logo.svg" alt="" />
      <div class="flex items-center gap-4">
        <div
          class="bg-[#EAF8FE] w-[40px] h-[40px] rounded-full flex items-center justify-center font-medium text-[#12A0D8]"
        >
          SM
        </div>
        <div class="flex-1">
          <h4 class="text-sm text-white font-medium">Josh West</h4>
          <p class="text-xs text-white">joshwest@sm.com</p>
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

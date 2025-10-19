<template>
  <div
    class="block fixed md:top-0 bottom-0 left-0 md:w-[220px] w-full bg-white md:h-[100vh] h-[10vh] z-30 md:p-6 p-4"
  >
    <div class="md:flex md:h-full md:pt-[86px] justify-between flex-col">
      <div class="flex md:flex-col items-start flex-row">
        <!-- <nuxt-link
          to="/home"
          :class="[
            'flex md:flex-row flex-col items-center gap-2 font-medium md:p-4 w-full text-sm rounded-[8px]',
            isActive('/home')
              ? 'md:bg-[#EAF8FE] md:border border-[#12A0D8] text-[#12A0D8]'
              : 'text-[#374151] ',
          ]"
        >
          <Icon icon="lsicon:home-outline" width="20" height="20" />
          Home
        </nuxt-link> -->
        <nuxt-link
          to="/explore"
          :class="[
            'flex md:flex-row flex-col items-center gap-2  font-medium md:p-4 w-full text-sm rounded-[8px]',
            isActive('/explore')
              ? 'md:bg-[#EAF8FE] md:border border-[#12A0D8] text-[#12A0D8]'
              : 'text-[#374151] ',
          ]"
        >
          <Icon icon="ri:search-line" width="20" height="20" />
          Explore
        </nuxt-link>
        <nuxt-link
          to="#"
          :class="[
            'flex md:flex-row flex-col items-center gap-2 text-[#374151] font-medium md:p-4 w-full text-sm rounded-[8px]',
            isActive('#') ? 'bg-[#E0E7FF]' : '',
          ]"
        >
          <Icon
            icon="lucide:file-plus"
            width="20"
            height="20"
            style="color: #374151"
          />
          <p>Add <span class="md:inline hidden">Services</span></p>
        </nuxt-link>
        <nuxt-link
          to="/chat"
          :class="[
            'flex md:flex-row flex-col items-center gap-2 font-medium md:p-4 w-full text-sm rounded-[8px]',
            isActive('/chat')
              ? 'md:bg-[#EAF8FE] md:border border-[#12A0D8] text-[#12A0D8]'
              : 'text-[#374151] ',
          ]"
        >
          <img class="md:block hidden" src="/images/ask.svg" alt="" />
          <img class="md:hidden block" src="/images/ask-mo.svg" alt="" />
          <p class="md:inline hidden">Ask Mark</p>
        </nuxt-link>

        <nuxt-link
          to="#"
          :class="[
            'flex md:flex-row flex-col items-center gap-2 text-[#374151] font-medium md:p-4 w-full text-sm rounded-[8px]',
            isActive('#') ? 'bg-[#E0E7FF]' : '',
          ]"
        >
          <Icon
            icon="ph:star-bold"
            width="20"
            height="20"
            style="color: #374151"
          />
          Challenges
        </nuxt-link>
        <nuxt-link
          to="#"
          :class="[
            'flex md:flex-row flex-col items-center gap-2 text-[#374151] font-medium md:p-4 w-full text-sm rounded-[8px]',
            isActive('#') ? 'bg-[#E0E7FF]' : '',
          ]"
        >
          <Icon icon="mi:user" width="20" height="20" style="color: #374151" />
          Profile
        </nuxt-link>
      </div>
      <button
        @click="logoutModal.openModal()"
        class="w-full bg-[#FEF2F2] border border-[#DC2626] py-3 px-5 rounded-full text-[#DC2626] font-medium md:flex hidden items-center gap-2 justify-center"
      >
        Logout
        <Icon
          icon="iconamoon:exit-bold"
          width="20"
          height="20"
          style="color: #dc2626"
        />
      </button>
    </div>
    <LogoutModal
      v-model="logoutModal.isOpen.value"
      @confirm="logoutModal.handleLogout"
      @cancel="logoutModal.closeModal"
    />
  </div>
</template>
<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useRoute } from "vue-router";
const route = useRoute();
const logoutModal = useLogoutModal();
function isActive(path: string) {
  return route.path === path;
}
</script>

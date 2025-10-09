<template>
  <div class="flex md:flex-row flex-col min-h-screen">
    <div
      class="py-8 md:w-6/12 bg-[#EAF8FE] flex items-center justify-center flex-col space-y-4 text-white md:px-36 px-5"
    >
      <div class="text-center space-y-1">
        <h2 class="text-[#12A0D8] font-bold md:text-4xl">
          Meet your community
        </h2>
        <p class="text-[#121212]">
          Hear from people who've navigated these services before you
        </p>
      </div>
    </div>
    <div
      class="px-5 md:px-36 py-8 flex-1 md:flex md:items-center md:justify-center"
    >
      <div class="w-full space-y-8">
        <div class="space-y-2 text-center flex items-center flex-col">
          <img src="/images/logo-2.svg" alt="" />
          <p class="text-xl text-[#111827] font-medium">
            Find trusted support <br />
            through lived experience
          </p>
        </div>
        <div class="bg-[#D5F1FC] w-full p-4 rounded-[16px] space-y-4">
          <div class="space-y-1">
            <label for="email" class="text-sm font-medium text-[#374151]"
              >Your Username or Email Address</label
            >
            <div
              class="bg-white border border-gray-300 rounded-[10px] p-3.5 focus:outline-none flex gap-4 outline-none justify-between items-center focus:ring-2 focus:ring-blue-500"
            >
              <input
                id="email"
                type="text"
                placeholder="Enter your username"
                class="w-full border-0 outline-0 p-0 m-0"
              />
              <Icon
                icon="mage:user"
                width="20"
                height="20"
                style="color: #4b5563"
              />
            </div>
          </div>
          <div class="space-y-1">
            <label for="password" class="text-sm font-medium text-[#374151]"
              >Password</label
            >
            <div
              class="bg-white border border-gray-300 rounded-[10px] p-3.5 focus:outline-none outline-none flex gap-4 justify-between items-center focus:ring-2 focus:ring-blue-500"
            >
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                class="w-full border-0 outline-0 p-0 m-0"
              />
              <Icon
                icon="iconamoon:eye"
                width="20"
                height="20"
                style="color: #4b5563"
              />
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <button
            class="w-full bg-[#12A0D8] text-white font-semibold py-4 px-5 rounded-full transition duration-200 flex items-center justify-center gap-2"
          >
            Login
            <Icon
              icon="tabler:arrow-right"
              width="20"
              height="20"
              style="color: #fff"
            />
          </button>
          <p class="text-sm text-[#374151] text-center">
            Don't have an account?
            <nuxt-link
              to="/sign-up"
              class="text-base text-[#12A0D8] font-medium"
              >Sign Up Now</nuxt-link
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>
<style scoped>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
  box-shadow: 0 0 0px 1000px white inset !important;
  -webkit-text-fill-color: #000 !important;
  transition: background-color 5000s ease-in-out 0s;
}
</style>

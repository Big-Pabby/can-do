<template>
  <div class="flex md:flex-row flex-col min-h-screen">
    <div class="px-4 py-8 md:w-6/12 bg-[#12A0D8] space-y-4 text-white">
      <img src="/images/logo.svg" alt="" />
      <div class="space-y-1">
        <h3 class="font-bold text-xl">Let's set up your profile</h3>
        <p>Share only what you're comfortable with</p>
      </div>
    </div>
    <div class="px-4 py-8 flex-1 md:flex md:items-center md:justify-center">
      <div class="md:w-[500px] mx-auto space-y-8">
        <div class="space-y-2 text-center">
          <h3 class="font-bold text-5xl text-[#12A0D8]">CanDO</h3>
          <p class="text-xl text-[#111827] font-medium">
            Find trusted support <br />
            through lived experience
          </p>
        </div>
        <div class="bg-[#D5F1FC] p-4 rounded-[16px] space-y-4">
          <div class="space-y-1">
            <label for="email" class="text-sm font-medium text-[#374151]"
              >Your Username or Email Address</label
            >
            <div
              class="bg-white border border-gray-300 rounded-[10px] p-3.5 focus:outline-none flex gap-4 justify-between items-center focus:ring-2 focus:ring-blue-500"
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
              class="bg-white border border-gray-300 rounded-[10px] p-3.5 focus:outline-none flex gap-4 justify-between items-center focus:ring-2 focus:ring-blue-500"
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
            class="w-full bg-[#12A0D8] text-white font-semibold py-4 px-5 rounded-full hover:bg-blue-600 transition duration-200 flex items-center justify-center gap-2"
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
            <span class="text-base text-[#12A0D8] font-medium"
              >Sign Up Now</span
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

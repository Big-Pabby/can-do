<template>
  <div
    class="flex flex-col items-center w-full bg-white text-[#111827] rounded-t-[24px] px-4 py-6 space-y-4"
  >
    <div class="text-center space-y-1">
      <h4 class="text-2xl font-bold text-[#33339C]">Welcome to CanDO</h4>
      <p class="text-sm text-[#374151]">Your Voice. Your Power. Your Choice.</p>
    </div>
    <div class="text-center space-y-1">
      <h4 class="text-base font-medium text-[#111827]">
        Help Us Understand Your World
      </h4>
      <p class="text-sm text-[#6B7280]">
        Your insights will help us build something that truly works for people
        like you in Suffolk
      </p>
    </div>
    <div
      class="font-medium text-xs text-[#15803D] bg-[#F0FDF4] py-0.5 px-2 rounded-full"
    >
      Takes 3-5 minutes
    </div>
    <div
      class="text-center mt-4 space-y-2 bg-[#F59E0B] p-4 rounded-[16px] border border-[#FDE68A] flex flex-col items-center justify-center w-full"
    >
      <div
        class="bg-white rounded-full w-[48px] h-[48px] p-2.5 flex items-center justify-center"
      >
        <Icon
          icon="tabler:gift"
          width="28"
          height="28"
          style="color: #d97706"
        />
      </div>
      <p class="text-white font-medium">Get rewarded for your feedback</p>
    </div>
    <div
      class="space-y-1 bg-[#F0F8FF] p-4 rounded-[16px] border border-[#B3DAFF]"
    >
      <h4 class="font-medium text-[#005AAD]">What makes this different</h4>
      <p class="text-sm text-[#0067C7]">
        This isn't a survey where we extract information from you. This is a
        conversation where you teach us what matters. You're the expert on your
        own life, and we want to learn from that expertise.
      </p>
    </div>
    <div
      class="space-y-1 bg-[#F4F4FF] p-4 rounded-[16px] border border-[#33339C1A]"
    >
      <h4 class="font-medium text-[#33339C]">What we're building together</h4>
      <p class="text-sm text-[#33339CCC]">
        A platform where people who've lived through challenges help each other
        find support that actually works. No more outdated directories or
        services that don't exist - just real help from real people.
      </p>
    </div>
    <div class="space-y-4 w-full">
      <nuxt-link
        to="/survey"
        class="flex w-full items-center gap-2 bg-primary text-white justify-center rounded-full p-5 font-medium"
      >
        I’m ready to share my thoughts
        <Icon
          icon="majesticons:arrow-right"
          width="20"
          height="20"
          style="color: #ffffff"
        />
      </nuxt-link>
      <button
        class="flex w-full items-center gap-2 border border-primary text-primary justify-center rounded-full p-5 font-medium"
      >
        Tell me more about this first
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>

<style></style>

<template>
  <div class="space-y-4">
    <div class="px-5 pt-16 text-white text-center space-y-2">
      <h3 class="font-black text-5xl">CanDO</h3>
      <p class="text-xl font-medium">Your Voice, Your Power</p>
      <p class="text-sm">Suffolk Community Research Journey</p>
    </div>
    <div
      class="w-full bg-[#F9FAFB] text-[#111827] rounded-t-[24px] px-4 py-6 space-y-4"
    >
      <div
        class="text-center mt-4 space-y-2 bg-[#16A34A] p-4 rounded-[16px] border border-[#33339C80] flex flex-col items-center justify-center w-full"
      >
        <div
          class="bg-white rounded-full w-[48px] h-[48px] p-2.5 flex items-center justify-center"
        >
          <Icon
            icon="line-md:star"
            width="28"
            height="28"
            style="color: #16a34a"
          />
        </div>
        <p class="text-white font-medium">Your Voice Matters</p>
        <p class="text-sm text-white">
          Thank you for trusting us with your experiences. Every insight you've
          shared will help us build something that truly serves people like you.
        </p>
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
        <p class="text-white font-medium">Your Free Gift</p>
        <p class="text-sm text-white">Will be sent within 24 hours</p>
      </div>
      <div
        class="mt-4 space-y-2 bg-[#F0F8FF] p-4 rounded-[16px] border border-[#B3DAFF] w-full text-[#0067C7]"
      >
        <h4 class="font-medium">What happens with what you've shared</h4>
        <ul class="list-disc list-inside text-sm space-y-1">
          <li>Your experiences will guide how we design the platform</li>
          <li>We'll use your insights to make services more accessible</li>
          <li>
            Your feedback will help us understand what real support looks like
          </li>
          <li>You'll be invited to see what we're building when it's ready</li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Icon } from "@iconify/vue";
</script>
<style scoped></style>

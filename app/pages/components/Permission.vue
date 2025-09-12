<template>
  <div class="space-y-6 flex flex-col h-full">
    <div class="px-5 pt-16 space-y-2">
      <h1 class="text-2xl font-[700]">Your Permission</h1>

      <p class="text-sm">
        We need your consent for how we use your contributions
      </p>
      <div class="flex items-center gap-4 pt-4">
        <div
          class="bg-[#FFFFFFCC] relative h-[8px] rounded-full flex-1 overflow-hidden"
        >
          <div
            class="w-1/4 absolute top-0 left-0 bg-[#22C55E] h-[8px] rounded-full"
          ></div>
        </div>
        <p class="font-medium text-sm">(1/4)</p>
      </div>
    </div>
    <div
      class="flex-1 w-full bg-[#F9FAFB] text-[#111827] rounded-t-[24px] px-4 py-6 space-y-6"
    >
      <div
        v-for="(item, index) in permissions"
        :key="index"
        class="border border-[#F3F4F6] bg-[#FFFFFF] rounded-[16px] p-4 space-y-4"
      >
        <h5 class="font-medium">{{ item.title }}</h5>
        <p class="text-[13px] text-[#6B7280]">
          {{ item.subtitle }}
        </p>
        <div
          v-for="(option, ind) in item.options"
          :key="ind"
          class="border border-[#F3F4F6] p-4 rounded-[16px] bg-[#F9FAFB] flex justify-between items-center gap-8"
        >
          <p class="text-sm">{{ option }}</p>
          <input type="radio" class="accent-primary w-[16px]" />
        </div>
      </div>
      <div
        class="border border-[#33339C1A] p-4 rounded-[16px] bg-[#F4F4FF] text-primary space-y-2"
      >
        <h4 class="font-medium">Important: You're Always in Control</h4>
        <p class="text-[13px] text-[#33339CCC]">
          You can change your mind about any of this at any time. You can leave
          the research whenever you want. Your information will only be used to
          improve services, never to punish or assess you.
        </p>
      </div>

      <div class="space-y-4">
        <button
        @click="onToggle('Duration')"
          class="flex w-full items-center gap-2 bg-primary text-white justify-center rounded-full p-5 font-medium"
        >
          Continue
          <Icon
            icon="majesticons:arrow-right"
            width="20"
            height="20"
            style="color: #ffffff"
          />
        </button>
        <button
        @click="onToggle('Welcome')"
          class="flex w-full items-center gap-2 border border-primary text-primary justify-center rounded-full p-5 font-medium"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
const props = defineProps<{
  onToggle: (item: string) => void
}>();
const permissions = [
  {
    title: "Recording Group Sessions",
    subtitle:
      "We'd like to record our group sessions to capture important insights and make sure we don't miss anything. These recordings help us build evidence for improving services.",
    options: [
      "Yes, you can record our group sessions",
      "No, please don't record me",
    ],
  },
  {
    title: "Using Your Quotes",
    subtitle:
      "Sometimes you might share something really important that could help others. We'd like permission to use anonymous quotes in our reports and materials to show decision-makers what really matters.",
    options: [
      "Yes, you can use my quotes anonymously",
      "No, please don't use my quotes",
    ],
  },
];
</script>

<style></style>

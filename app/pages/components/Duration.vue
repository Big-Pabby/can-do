<template>
  <div class="space-y-6 flex flex-col h-full">
    <div class="px-5 pt-16 space-y-2">
      <h1 class="text-2xl font-[700]">How Much Time?</h1>

      <p class="text-sm">
        Choose the level that feels right for you - you can change this anytime
      </p>
      <div class="flex items-center gap-4 pt-4">
        <div
          class="bg-[#FFFFFFCC] relative h-[8px] rounded-full flex-1 overflow-hidden"
        >
          <div
            class="w-2/4 absolute top-0 left-0 bg-[#22C55E] h-[8px] rounded-full"
          ></div>
        </div>
        <p class="font-medium text-sm">(2/4)</p>
      </div>
    </div>
    <div
      class="flex-1 w-full bg-[#F9FAFB] text-[#111827] rounded-t-[24px] px-4 py-6 space-y-6"
    >
      <div
        v-for="(item, index) in periods"
        :key="index"
        class="border border-[#F3F4F6] bg-[#FFFFFF] rounded-[16px] p-4 space-y-4"
      >
        <div class="flex justify-between items-start gap-8 w-full">
          <div class="space-y-2 flex-1">
            <h5 class="font-medium">{{ item.title }}</h5>
            <p class="text-[13px] text-[#6B7280]">
              {{ item.subtitle }}
            </p>
          </div>
          <div
            class=" border rounded-full border-[#33339C4D] bg-[#F4F4FF] py-0.5 px-2 text-primary text-sm"
          >
            {{ item.timing }}
          </div>
        </div>

        <div
          v-for="(option, ind) in item.options"
          :key="ind"
          class="border border-[#F3F4F6] p-4 rounded-[16px] bg-[#F9FAFB] flex items-center gap-4"
        >
          <Icon
            icon="gg:check-o"
            width="20"
            height="20"
            style="color: #22c55e"
          />
          <p class="text-sm text-[#4B5563]">{{ option }}</p>
        </div>
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
          @click="onToggle('Permission')"
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
  onToggle: (item: string) => void;
}>();
const periods = [
  {
    title: "Light Touch",
    subtitle: "Occasional feedback when it suits you",
    timing: "5-10 min/week",
    options: [
      "Monthly check-ins",
      "Quick feedback forms",
      "Skip anything you want",
      "Leave anytime",
    ],
  },
  {
    title: "Regular Contributor",
    subtitle: "Help shape how the platform develops/",
    timing: "15-20 min/week",
    options: [
      "Bi-weekly conversations",
      "Test new features",
      "Connect with other contributors",
      "Small thank-you rewards",
    ],
  },
  {
    title: "Community Partner",
    subtitle: "Active role in research and platform design",
    timing: "30+ min/week",
    options: [
      "Train as peer researcher",
      "Help design new research",
      "Community leadership opportunities",
      "Meaningful rewards & recognition",
    ],
  },
];
</script>

<style></style>

<template>
  <div class="space-y-6 flex flex-col h-full">
    <div class="px-5 pt-16 space-y-2">
      <div
        @click="onToggle('sharing')"
        class="w-[40px] h-[40px] rounded-full bg-[#F3F4F633] p-2 flex items-center justify-center mb-4"
      >
        <Icon
          icon="tabler:arrow-left"
          width="24"
          height="24"
          style="color: #fff"
        />
      </div>
      <h1 class="text-lg font-[700]">
        Sharing any final thoughts in your own way
      </h1>
      <div class="flex items-center gap-4">
        <div
          class="bg-[#FFFFFFCC] relative h-[8px] rounded-full flex-1 overflow-hidden"
        >
          <div
            class="w-6/6 absolute top-0 left-0 bg-[#22C55E] h-[8px] rounded-full"
          ></div>
        </div>
        <p class="font-medium text-sm">(6/6)</p>
      </div>
    </div>
    <div
      class="flex-1 w-full bg-[#F9FAFB] text-[#111827] rounded-t-[24px] px-4 py-6 space-y-4"
    >
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
        <p class="text-white font-medium">Thank You for Your Time and Trust</p>
        <p class="text-sm text-white">
          Let us know how you'd like us to show our appreciation
        </p>
      </div>
      <div
        class="p-4 rounded-[16px] space-y-3 bg-[#FFFFFF] border border-[#F3F4F6]"
      >
        <div
          class="bg-[#F0F8FF] border border-[#B3DAFF] p-4 rounded-[16px] text-sm text-[#0067C7]"
        >
          Your time is valuable, and sharing your experiences takes emotional
          energy. We want to acknowledge that properly.
        </div>
        <h4 class="text-lg font-medium">
          What kind of appreciation would feel meaningful to you?
        </h4>
        <p class="text-sm text-[#6B7280] italic">
          This isn't payment - it's recognition that your expertise and time
          have value
        </p>
        <div
          v-for="(item, index) in permissions"
          :key="index"
          class="flex gap-2 items-start border border-[#F3F4F6] bg-[#F9FAFB] p-4 rounded-[16px]"
        >
          <div class="flex-1 space-y-2">
            <h5 class="font-medium text-base text-[#111827]">
              {{ item.title }}
            </h5>
            <p class="text-sm text-[#4B5563]">{{ item.subtitle }}</p>
          </div>
        </div>
      </div>
      <div
        class="p-4 rounded-[16px] space-y-3 bg-[#FFFFFF] border border-[#F3F4F6]"
      >
        <div
          class="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-[16px] text-sm text-[#B45309]"
        >
          You've shared so much valuable insight. Is there anything else you
          want us to know? You can type or record your thoughts.
        </div>
        <h4 class="text-lg font-medium">
          What else should we understand about your world?
        </h4>
        <p class="text-sm text-[#6B7280] italic">
          Anything about services, support, or what would really make a
          difference in your life
        </p>
        <div class="border border-[#E5E7EB] bg-white p-4 rounded-[4px]">
          <textarea
            class="w-full text-sm outline-none rounded-none p-0 m-0"
            placeholder="Share anything that feels important to you. Type or use the mic..."
          ></textarea>
          <div class="flex gap-4 mt-4 justify-end">
            <div
              class="w-[28px] h-[28px] flex justify-center items-center bg-[#33339C] rounded-[8px]"
            >
              <Icon icon="mi:send" width="16" height="16" style="color: #fff" />
            </div>
            <div
              class="w-[32px] h-[32px] rounded-full border border-[#F3F4F6] flex items-center justify-center"
            >
              <Icon
                icon="material-symbols:mic-outline-rounded"
                width="24"
                height="24"
                style="color: #33339c"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4 w-full">
        <button
          @click="onToggle('thoughts')"
          class="flex w-full items-center gap-2 bg-primary text-white justify-center rounded-full py-4 px-5 font-medium"
        >
          I appreciate your honesty
        </button>
        <h4 class="font-medium text-[#374151] text-center">
          Actually. I’ll Continue
        </h4>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
const props = defineProps<{
  onToggle: (item: string) => void;
}>();
const permissions = [
  {
    title: "Greggs Vouchers",
    subtitle: "The familiar favourite (£2-£10)",
  },
  {
    title: "Phone Credit",
    subtitle: "Bus/train tickets for accessibility (£5-£15)",
  },
  {
    title: "Transport Vouchers",
    subtitle: "Bus/train tickets for accessibility (£5-£15)",
  },
  {
    title: "Shopping Vouchers",
    subtitle: "Tesco, ASDA, Sainsbury's (£5-£15)",
  },
];
</script>

<style scoped>
input {
    outline: none;
    accent-color: #33339C;
}
</style>


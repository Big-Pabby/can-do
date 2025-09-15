<template>
  <div class="space-y-6 flex flex-col h-full">
    <div class="px-5 pt-16 space-y-2">
      <nuxt-link
      to="/"
        class="w-[40px] h-[40px] rounded-full bg-[#F3F4F633] p-2 flex items-center justify-center mb-4"
      >
        <Icon
          icon="tabler:arrow-left"
          width="24"
          height="24"
          style="color: #fff"
        />
      </nuxt-link>
      <h1 class="text-lg font-[700]">Taking our time together</h1>
      <div class="flex items-center gap-4">
        <div
          class="bg-[#FFFFFFCC] relative h-[8px] rounded-full flex-1 overflow-hidden"
        >
          <div
            class="w-1/6 absolute top-0 left-0 bg-[#22C55E] h-[8px] rounded-full"
          ></div>
        </div>
        <p class="font-medium text-sm">(1/6)</p>
      </div>
    </div>
    <div
      class="flex-1 w-full bg-[#F9FAFB] text-[#111827] rounded-t-[24px] px-4 py-6 space-y-4"
    >
      <div
        class="p-4 rounded-[16px] space-y-3 bg-[#FFFFFF] border border-[#F3F4F6]"
      >
        <h5 class="font-medium text-lg">How are you feeling today?</h5>
        <p class="text-sm text-[#6B7280]">
          Just checking in with you as a person before we start
        </p>
        <div
          class="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-[16px] text-sm text-[#B45309]"
        >
          There's no right or wrong answer here. We're asking because we care
          about you as a person, not just your answers.
        </div>
        <div
          v-for="(item, index) in permissions"
          :key="index"
          class="border mt-2 border-[#F3F4F6] hover:border-[#33339C80] bg-[#F9FAFB] hover:bg-[#F4F4FF] rounded-[16px] text-[#4B5563] hover:text-[#33339C] p-4"
        >
          {{ item }}
        </div>
      </div>
      <div
        class="border border-[#B3DAFF] bg-[#F0F8FF] rounded-[16px] p-4 space-y-2"
      >
        <h4 class="font-medium text-[#005AAD]">Just so you know</h4>
        <p class="text-[#0067C7] text-sm">
          However you're feeling is completely valid. If today feels hard, we'll
          take extra care with how we ask things. If you're feeling good, that's
          wonderful too.
        </p>
      </div>
      <div class="space-y-4 w-full">
        <button
          @click="onToggle('experience')"
          class="flex w-full items-center gap-2 bg-primary text-white justify-center rounded-full py-4 px-5 font-medium"
        >
          Continue when you’re ready
        </button>
        <h4 class="font-medium text-[#374151] text-center">Stop here and get reward</h4>
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
  "Having a tough time",
  "Getting by okay",
  "Doing alright",
  "Feeling good",
  "Really Great",
];
</script>

<style scoped>
input {
    outline: none;
    accent-color: #33339C;
}
</style>


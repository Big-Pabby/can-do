<template>
  <div class="space-y-6 flex flex-col h-full">
    <div class="px-5 pt-16 space-y-2">
      <div
        @click="onToggle('experience')"
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
        Exploring how you prefer to find nearby help
      </h1>
      <div class="flex items-center gap-4">
        <div
          class="bg-[#FFFFFFCC] relative h-[8px] rounded-full flex-1 overflow-hidden"
        >
          <div
            class="w-3/6 absolute top-0 left-0 bg-[#22C55E] h-[8px] rounded-full"
          ></div>
        </div>
        <p class="font-medium text-sm">(3/6)</p>
      </div>
    </div>
    <div
      class="flex-1 w-full bg-[#F9FAFB] text-[#111827] rounded-t-[24px] px-4 py-6 space-y-4"
    >
      <div
        class="p-4 rounded-[16px] space-y-3 bg-[#FFFFFF] border border-[#F3F4F6]"
      >
        <h5 class="font-medium text-lg">
          What we're thinking about: Seeing Help Nearby
        </h5>
        <p class="text-sm text-[#6B7280]">
          Instead of just lists, what if you could see services on a map to
          understand what's actually close to you?
        </p>
        <div
          class="bg-[#33339C0D] border border-[#33339C80] p-4 rounded-[16px] text-sm text-[#33339C]"
        >
          "I didn't know there was a food bank just 10 minutes walk from my
          house. I'd been traveling across town."
        </div>
      </div>
      <div
        class="p-4 rounded-[16px] space-y-3 bg-[#FFFFFF] border border-[#F3F4F6]"
      >
        <div
          class="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-[16px] text-sm text-[#B45309]"
        >
          You know what it's like to travel to get help. Your experience with
          distance and location matters.
        </div>
        <h4 class="text-lg font-medium">
          When you're looking for support, how important is it to know exactly
          where services are and how to get there?
        </h4>
        <p class="text-sm text-[#6B7280] italic">
          Think about transport costs, time, and energy - all the real barriers
          you face
        </p>
        <div
          v-for="(item, index) in permissions"
          :key="index"
          class="border mt-2 rounded-[16px] p-4 cursor-pointer transition-all duration-200"
          :class="{
            'border-[#33339C] bg-[#F4F4FF] text-[#33339C]':
              selectedValue === item,
            'border-[#F3F4F6] bg-[#F9FAFB] text-[#4B5563] hover:border-[#33339C80] hover:bg-[#F4F4FF] hover:text-[#33339C]':
              selectedValue !== item,
          }"
          @click="selectItem(item)"
        >
          {{ item }}
        </div>
      </div>

      <div class="space-y-4 w-full">
        <button
          @click="onToggle('help')"
          :disabled="!selectedValue"
          class="flex w-full items-center gap-2 justify-center rounded-full py-4 px-5 font-medium transition-all duration-200"
          :class="{
            'bg-primary text-white': selectedValue,
            'bg-gray-300 text-gray-500 cursor-not-allowed': !selectedValue,
          }"
        >
          That make sense, thank you
        </button>
        <h4 class="font-medium text-[#374151] text-center">
          Stop here and get reward
        </h4>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";

const props = defineProps<{
  onToggle: (item: string) => void;
}>();

const emit = defineEmits<{
  select: [value: string];
}>();

const selectedValue = ref<string>("");

const selectItem = (item: string) => {
  selectedValue.value = item;
  emit("select", item);
};

const permissions = [
  "Doesn't matter much",
  "Somewhat Important",
  "Pretty Important",
  "Very Important",
  "Absolutely Essential",
];
</script>

<style scoped>
input {
  outline: none;
  accent-color: #33339c;
}
</style>

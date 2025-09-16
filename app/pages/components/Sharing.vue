<template>
  <div class="space-y-6 flex flex-col h-full">
    <div class="px-5 pt-16 space-y-2">
      <div
        @click="onToggle('help')"
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
        Thinking about sharing experiences to help others
      </h1>
      <div class="flex items-center gap-4">
        <div
          class="bg-[#FFFFFFCC] relative h-[8px] rounded-full flex-1 overflow-hidden"
        >
          <div
            class="w-5/6 absolute top-0 left-0 bg-[#22C55E] h-[8px] rounded-full"
          ></div>
        </div>
        <p class="font-medium text-sm">(5/6)</p>
      </div>
    </div>
    <div
      class="flex-1 w-full bg-[#F9FAFB] text-[#111827] rounded-t-[24px] px-4 py-6 space-y-4"
    >
      <div
        class="p-4 rounded-[16px] space-y-3 bg-[#FFFFFF] border border-[#F3F4F6]"
      >
        <h5 class="font-medium text-lg">
          What we're thinking about: Your Experience Helping Others
        </h5>
        <p class="text-sm text-[#6B7280]">
          What if the difficult experiences you've had could help prevent others
          from going through the same thing?
        </p>
        <div
          class="bg-[#33339C0D] border border-[#33339C80] p-4 rounded-[16px] text-sm text-[#33339C]"
        >
          "I wish someone had warned me that place would treat me like that. I
          could have saved myself the pain."
        </div>
      </div>
      <div
        class="p-4 rounded-[16px] space-y-3 bg-[#FFFFFF] border border-[#F3F4F6]"
      >
        <div
          class="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-[16px] text-sm text-[#B45309]"
        >
          Your experiences - both positive and negative - have value. You've
          learned things that could help others navigate the system.
        </div>
        <h4 class="text-lg font-medium">
          If you knew your experience could help improve services for others
          like you, how would that feel?
        </h4>
        <p class="text-sm text-[#6B7280] italic">
          Imagine your feedback leading to real changes that prevent others from
          facing the same barriers you've faced
        </p>
        <label
          v-for="(item, index) in permissions"
          :for="`index-${index}`"
          :key="index"
          class="flex gap-2 items-start border p-4 rounded-[16px] transition-all duration-200"
          :class="{
            'border-[#33339C] bg-[#F4F4FF]': selectedValue === item.title,
            'border-[#F3F4F6] bg-[#F9FAFB]': selectedValue !== item.title,
          }"
        >
          <input
            :id="`index-${index}`"
            type="radio"
            class="w-[24px] h-[24px]"
            :name="'sharing-option'"
            :value="item.title"
            v-model="selectedValue"
            @change="onSelect"
          />
          <div class="flex-1 space-y-2">
            <h5
              class="font-medium text-base transition-colors duration-200"
              :class="{
                'text-[#33339C]': selectedValue === item.title,
                'text-[#111827]': selectedValue !== item.title,
              }"
            >
              {{ item.title }}
            </h5>
            <p class="text-sm text-[#4B5563]">{{ item.subtitle }}</p>
          </div>
        </label>
      </div>

      <div class="space-y-4 w-full">
        <button
          @click="onToggle('thoughts')"
          :disabled="!selectedValue"
          class="flex w-full items-center gap-2 justify-center rounded-full py-4 px-5 font-medium transition-all duration-200"
          :class="{
            'bg-primary text-white': selectedValue,
            'bg-gray-300 text-gray-500 cursor-not-allowed': !selectedValue,
          }"
        >
          I appreciate your honesty
        </button>
        <!-- <h4 class="font-medium text-[#374151] text-center">
          Stop here and get reward
        </h4> -->
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

const onSelect = () => {
  if (selectedValue.value) {
    emit("select", selectedValue.value);
  }
};

const permissions = [
  {
    title: "Having a conversation where I can explain my situation",
    subtitle: "Turning your struggles into something that helps others",
  },
  {
    title: "I'd be willing if I felt completely safe and anonymous",
    subtitle: "You want to help but need strong privacy protections",
  },
  {
    title: "I'd be hesitant - I've been let down by systems before",
    subtitle: "Past experiences make you cautious about trusting",
  },
  {
    title: "It would depend on who's asking and why",
    subtitle: "Trust matters - you need to know the motivation",
  },
];
</script>

<style scoped>
input {
  outline: none;
  accent-color: #33339c;
}
</style>

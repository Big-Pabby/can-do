<template>
  <div class="space-y-6 flex flex-col h-full">
    <div class="px-5 pt-16 space-y-2">
      <div
        @click="onToggle('explore')"
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
        Talking about how you prefer to get help
      </h1>
      <div class="flex items-center gap-4">
        <div
          class="bg-[#FFFFFFCC] relative h-[8px] rounded-full flex-1 overflow-hidden"
        >
          <div
            class="w-4/6 absolute top-0 left-0 bg-[#22C55E] h-[8px] rounded-full"
          ></div>
        </div>
        <p class="font-medium text-sm">(4/6)</p>
      </div>
    </div>
    <div
      class="flex-1 w-full bg-[#F9FAFB] text-[#111827] rounded-t-[24px] px-4 py-6 space-y-4"
    >
      <div
        class="p-4 rounded-[16px] space-y-3 bg-[#FFFFFF] border border-[#F3F4F6]"
      >
        <h5 class="font-medium text-lg">
          What we're thinking about: Having Someone to Talk To
        </h5>
        <p class="text-sm text-[#6B7280]">
          What if instead of filling out forms or searching through lists, you
          could just explain your situation to someone who listens and learns
          about what you need?
        </p>
        <div
          class="bg-[#33339C0D] border border-[#33339C80] p-4 rounded-[16px] text-sm text-[#33339C]"
        >
          "I'm tired of repeating my story over and over. I just want someone
          who gets it."
        </div>
      </div>
      <div
        class="p-4 rounded-[16px] space-y-3 bg-[#FFFFFF] border border-[#F3F4F6]"
      >
        <div
          class="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-[16px] text-sm text-[#B45309]"
        >
          We know that forms and bureaucracy can be exhausting. You deserve
          better ways to ask for help.
        </div>
        <h4 class="text-lg font-medium">
          If you could choose how to explain what you need, which would feel
          better for you?
        </h4>
        <p class="text-sm text-[#6B7280] italic">
          Think about times when you've felt heard versus times when you've felt
          processed
        </p>
        <label
          v-for="(item, index) in permissions"
          :key="index"
          :for="`index-${index}`"
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
            :name="'help-option'"
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
          @click="onToggle('sharing')"
          :disabled="!selectedValue"
          class="flex w-full items-center gap-2 justify-center rounded-full py-4 px-5 font-medium transition-all duration-200"
          :class="{
            'bg-primary text-white': selectedValue,
            'bg-gray-300 text-gray-500 cursor-not-allowed': !selectedValue,
          }"
        >
          That helps us understand
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
    subtitle: "Being able to tell your story in your own words",
  },
  {
    title: "Being asked specific questions that help me think",
    subtitle: "Having someone guide you through what's relevant",
  },
  {
    title: "Looking through options myself at my own pace",
    subtitle: "Having control over what you see and when",
  },
  {
    title: "I've often given up because it feels impossible",
    subtitle: "The system feels so difficult that you stop trying",
  },
  {
    title: "It depends on how I'm feeling that day",
    subtitle: "Different approaches work at different times",
  },
];
</script>

<style scoped>
input {
  outline: none;
  accent-color: #33339c;
}
</style>

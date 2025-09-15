<template>
  <div class="space-y-6 flex flex-col h-full">
    <div class="px-5 pt-16 space-y-2">
      <div
      @click="onToggle('introduction')"
        class="w-[40px] h-[40px] rounded-full bg-[#F3F4F633] p-2 flex items-center justify-center mb-4"
      >
        <Icon
          icon="tabler:arrow-left"
          width="24"
          height="24"
          style="color: #fff"
        />
      </div>
      <h1 class="text-lg font-[700]">Sharing experiences about finding help</h1>
      <div class="flex items-center gap-4">
        <div
          class="bg-[#FFFFFFCC] relative h-[8px] rounded-full flex-1 overflow-hidden"
        >
          <div
            class="w-2/6 absolute top-0 left-0 bg-[#22C55E] h-[8px] rounded-full"
          ></div>
        </div>
        <p class="font-medium text-sm">(2/6)</p>
      </div>
    </div>
    <div
      class="flex-1 w-full bg-[#F9FAFB] text-[#111827] rounded-t-[24px] px-4 py-6 space-y-4"
    >
      <div
        class="p-4 rounded-[16px] space-y-3 bg-[#FFFFFF] border border-[#F3F4F6]"
      >
        <h5 class="font-medium text-lg">
          What we're thinking about: Finding Services
        </h5>
        <p class="text-sm text-[#6B7280]">
          We want to create a directory where you can actually find services
          that work, with real information that's kept up to date.
        </p>
        <div
          class="bg-[#33339C0D] border border-[#33339C80] p-4 rounded-[16px] text-sm text-[#33339C]"
        >
          "I spent hours calling numbers that were disconnected. It felt like
          the system was set up to exhaust me."
        </div>
      </div>
      <div
        class="p-4 rounded-[16px] space-y-3 bg-[#FFFFFF] border border-[#F3F4F6]"
      >
        <div
          class="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-[16px] text-sm text-[#B45309]"
        >
          You're the expert on what it's like to need support. We want to learn
          from your experience.
        </div>
        <h4 class="text-lg font-medium">
          When you've needed to find help or support, what has that been like
          for you?
        </h4>
        <p class="text-sm text-[#6B7280] italic">
          Think about any time you've looked for housing, mental health support,
          benefits help, or any other services
        </p>
        <div v-for="(item,index) in permissions" :key="index" class=" flex gap-2 items-start border border-[#F3F4F6] bg-[#F9FAFB] p-4 rounded-[16px]">
            <input type="radio" class="w-[24px] h-[24px]">
            <div class="flex-1 space-y-2">
                <h5 class="font-medium text-base text-[#111827]">{{ item.title }}</h5>
                <p class="text-sm text-[#4B5563]">{{ item.subtitle }}</p>
            </div>
        </div>
      </div>
     
      <div class="space-y-4 w-full">
        <button
          @click="onToggle('explore')"
          class="flex w-full items-center gap-2 bg-primary text-white justify-center rounded-full py-4 px-5 font-medium"
        >
          Thank you for sharing that
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
const props = defineProps<{
  onToggle: (item: string) => void;
}>();
const permissions = [
  {
    title: 'I usually know where to look and find what I need',
    subtitle: 'You have good networks or know the system well',
  },
  {
    title: 'Sometimes I find help, but it takes effort and time',
    subtitle: 'You get there eventually but it\'s not always straightforward',
  },
  {
    title: 'It\'s often difficult and frustrating to find the right help',
    subtitle: 'You face barriers, outdated information, or unhelpful responses',
  },
  {
    title: 'I\'ve often given up because it feels impossible',
    subtitle: 'The system feels so difficult that you stop trying',
  },
  {
    title: 'I avoid asking for help because of past experiences',
    subtitle: 'Previous negative experiences make you reluctant to seek support',
  },
 
];
</script>

<style scoped>
input {
    outline: none;
    accent-color: #33339C;
}
</style>


<template>
  <div v-if="onboard === 'Welcome'" class="space-y-6 flex flex-col h-full">
    <div class="px-5 pt-16 text-center space-y-4">
      <h1 class="text-5xl font-[900]">CanDo</h1>
      <h3 class="text-lg font-medium">
        Find trusted support through lived experience
      </h3>
      <p class="text-xs">
        We're completely independent from services and government
      </p>
    </div>
    <div
      class="flex-1 w-full bg-white text-[#111827] rounded-t-[24px] px-4 py-6 space-y-4"
    >
      <div class="space-y-2 text-center">
        <h5 class="font-medium">Built on Trust</h5>
        <p class="text-[13px] text-[#6B7280]">
          Our platform is guided by principles that put you first
        </p>
      </div>
      <div
        v-for="(item, index) in principles"
        :key="index"
        class="border border-[#33339C1A] bg-[#F4F4FF] p-4 rounded-[16px] space-y-1"
      >
        <h4 class="font-medium text-sm">{{ item.title }}</h4>
        <p class="text-[13px] text-[#4B5563]">{{ item.subTitle }}</p>
      </div>
      <div class="pt-16 space-y-4">
        <button
        @click="onboard = 'Permission'"
          class="flex w-full items-center gap-2 bg-primary text-white justify-center rounded-full p-5 font-medium"
        >
          Get Started
          <Icon
            icon="majesticons:arrow-right"
            width="20"
            height="20"
            style="color: #ffffff"
          />
        </button>
        <button
          class="flex w-full items-center gap-2 border border-primary text-primary justify-center rounded-full p-5 font-medium"
        >
         I need help with this
        </button>
      </div>
    </div>
  </div>
  <div v-if="onboard === 'Permission'">
    <Permission :onToggle="toggleScreen"/>
  </div>
  <div v-if="onboard === 'Duration'">
    <Duration :onToggle="toggleScreen"/>
  </div>
</template>

<script setup lang="ts">
import Permission from "./components/Permission.vue";
import Duration from "./components/Duration.vue";
import { Icon } from "@iconify/vue";
import { ref } from "vue";
const principles = [
  {
    title: "Peer-Led",
    subTitle: "Designed by users like you, involved at every stage",
  },
  {
    title: "Trust & Privacy",
    subTitle: "Your data is encrypted and only used to help, never to punish",
  },
  {
    title: "Human-First",
    subTitle: "Technology is a tool to connect people, not replace them",
  },
  {
    title: "Independent",
    subTitle: "Free from government and service provider influence",
  },
];
const onboard = ref<string>('Welcome')
const toggleScreen = (name: string) => {
    onboard.value = name
}
</script>

<style></style>

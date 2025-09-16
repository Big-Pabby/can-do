<template>
  <div class="space-y-4">
    <div class="px-5 pt-16 text-white space-y-2">
      <h4 class="font-bold text-xl">{{onboard === 'submit' ? 'Form Submitted Successfully' : 'Lived Expert'}}</h4>
      <p class="text-sm">
        Suffolk Follow Up Group Information Sheet & Consent Form
      </p>
    </div>
    <About v-if="onboard === 'about'" :onToggle="toggleScreen" />
    <UserInfo v-if="onboard === 'info'" :onToggle="toggleScreen" />
    <Submitted v-if="onboard === 'submit'" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import About from "./components/About.vue";
import UserInfo from "./components/UserInfo.vue";
import Submitted from "./components/Submitted.vue";
const onboard = ref<string>("about");
const toggleScreen = (name: string) => {
  onboard.value = name;
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
</script>

<style></style>

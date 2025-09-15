<template>
  <div class="space-y-4">
    <Introduction
      v-if="onboard === 'introduction'"
      v-on:toggle="toggleScreen"
    />
    <Experience
      v-else-if="onboard === 'experience'"
      v-on:toggle="toggleScreen"
    />
    <Explore v-else-if="onboard === 'explore'" v-on:toggle="toggleScreen" />
    <Help v-else-if="onboard === 'help'" v-on:toggle="toggleScreen" />
    <Sharing v-else-if="onboard === 'sharing'" v-on:toggle="toggleScreen" />
    <Thoughts v-else-if="onboard === 'thoughts'" v-on:toggle="toggleScreen" />
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";
import Introduction from "../components/Introduction.vue";
import Experience from "../components/Experience.vue";
import Explore from "../components/Explore.vue";
import Help from "../components/Help.vue";
import Sharing from "../components/Sharing.vue";
import Thoughts from "../components/Thoughts.vue";

const onboard = ref<string>("introduction");
const toggleScreen = (name: string) => {
  onboard.value = name;

  // Smooth scroll to top
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
</script>

<style></style>

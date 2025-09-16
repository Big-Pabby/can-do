<template>
  <transition name="slide-down">
    
  </transition>
</template>
<script setup lang="ts">

const props = defineProps(["errorMsg"]);
</script>
<style  scoped>
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translate(-50%, -100%);
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 1s, transform 1s;
}
</style>

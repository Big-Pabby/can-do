<template>
    <div
      v-if="showIosBanner"
      class="fixed bottom-0 left-0 w-full bg-gray-900 text-white text-sm text-center p-4 z-50"
    >
      📲 To install this app, tap
      <span class="font-semibold">Share</span> → 
      <span class="font-semibold">Add to Home Screen</span>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  
  const showIosBanner = ref(false);
  
  onMounted(() => {
    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    const isInStandalone = ("standalone" in navigator) && (navigator as any).standalone;
  
    if (isIos && !isInStandalone) {
      showIosBanner.value = true;
    }
  });
  </script>
  
  <style scoped>
  /* Optional: add a slide-up animation */
  div {
    animation: slideUp 0.5s ease-in-out;
  }
  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }
  </style>
  
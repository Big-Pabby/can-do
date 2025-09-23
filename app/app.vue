<template>
  <!-- <InstallBanner /> -->
  <div class=" min-h-screen bg-[#F9FAFB] ">
    <NuxtPage />
  </div>
</template>
<script setup lang="ts">
useHead({
  link: [
    { rel: "manifest", href: "/site.webmanifest" },
    { rel: "apple-touch-icon", href: "/icon-192x192.png" },
  ],
});

</script>

<template>
  <InstallBanner />
  <div class="bg-primary min-h-screen text-white max-w-[500px] w-full mx-auto">
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

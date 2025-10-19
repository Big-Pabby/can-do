<template>
  <div class="min-h-screen h-screen overflow-hidden bg-[#F9FAFB]">
    <user-sidebar />

    <user-nav />
    <div
      class="md:ml-[220px] h-[calc(100vh-15vh)] overflow-y-auto md:p-8 md:mt-[86px]"
    >
      <slot />
    </div>
  </div>
</template>
<script setup lang="ts"></script>

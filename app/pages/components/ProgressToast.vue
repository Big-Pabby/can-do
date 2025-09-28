<script setup lang="ts">
const props = defineProps<{
  progress: number;
  title?: string;
}>();
</script>

<template>
  <div
    class="w-[280px] p-4 rounded-[8px] border border-[#FDE68A] bg-[#FFFBEB] flex flex-col gap-2"
  >
    <span class="font-medium text-[#F59E0B]">
      {{ title || "Service re-running please wait..." }}
    </span>

    <div class="flex items-center gap-2">
      <div class="flex-1 h-[6px] bg-gray-300 rounded-full overflow-hidden">
        <div
          class="h-[6px] bg-[#D97706] transition-all duration-300"
          :style="{ width: props.progress + '%' }"
        ></div>
      </div>

      <span class="text-xs text-[#D97706]">{{ props.progress }}%</span>
    </div>

    <!-- Progress bar -->
  </div>
</template>

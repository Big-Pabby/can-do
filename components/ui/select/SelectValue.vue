<script setup lang="ts">
import { SelectValue as RadixSelectValue } from "radix-vue";
import { cn } from "@/lib/utils";

defineOptions({
  inheritAttrs: false,
});

interface SelectValueProps {
  placeholder?: string;
  class?: string;
}

const props = withDefaults(defineProps<SelectValueProps>(), {
  placeholder: "",
  class: "",
});
</script>

<template>
  <RadixSelectValue
    :class="cn('flex h-10 w-full items-center text-sm', props.class)"
    :placeholder="placeholder"
  >
    <slot />
  </RadixSelectValue>
</template>

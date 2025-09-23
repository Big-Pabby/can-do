<script setup lang="ts">
import { SelectRoot } from "radix-vue";

const emit = defineEmits(["update:modelValue"]);
const props = defineProps<{
  modelValue?: string;
}>();

defineOptions({
  name: "Select",
});
</script>

<template>
  <SelectRoot
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot />
  </SelectRoot>
</template>

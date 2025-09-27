<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../../../components/ui/dialog";
import { Icon } from "@iconify/vue";
import { UseDeleteService } from "../hooks";
import { toast } from "vue-sonner";

const props = defineProps<{
  serviceId: string;
}>();
const { mutate, isPending } = UseDeleteService();
const isOpen = ref(false);
const deleteFn = () => {
  mutate(props.serviceId, {
    onSuccess: () => {
      isOpen.value = false;
      useRouter().push("/services");
      toast.success("Service Deleted", {
        style: {
          background: "#F0FDF4",
          border: "1px solid #BBF7D0",
          color: "#16A34A",
        },
        class: "my-toast",
        descriptionClass: "my-toast-description",
      });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to delete.";
      toast.error(msg);
    },
  });
};
</script>

<template>
  <Dialog v-model:open="isOpen">
    <DialogTrigger>
      <Icon icon="mdi:trash-outline" width="20" height="20" />
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px] p-6 rounded-[16px]">
      <DialogHeader>
        <DialogTitle class="text-2xl font-semibold"
          >Are you sure you want to delete this service?</DialogTitle
        >
        <DialogDescription class="text-sm">
          This action cannot be reversed
        </DialogDescription>
      </DialogHeader>
      <button
        @click="deleteFn"
        :disabled="isPending"
        class="text-white p-4 w-full rounded-full bg-[#EF4444] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4"
      >
        <Icon
          v-if="isPending"
          icon="tabler:loader"
          width="20"
          height="20"
          class="animate animate-spin"
          style="color: #fff"
        />
        <span v-if="isPending">Deleting...</span>
        <span v-else>Delete</span>
      </button>
      <DialogClose
        class="text-[#12A0D8] p-4 w-full rounded-full border border-[#12A0D8]"
      >
        Cancel
      </DialogClose>
    </DialogContent>
  </Dialog>
</template>

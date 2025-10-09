<template>
  <div
    class="w-full h-screen overflow-y-auto flex flex-col bg-white rounded-t-[24px] px-6 pt-6 pb-[86px] space-y-4 relative"
    style="position: relative"
  >
    <div
      class="flex w-full md:flex-row flex-col-reverse md:items-center items-start border-b pb-4 justify-between gap-6"
    >
      <div class="flex items-center gap-3">
        <img src="/images/mark.svg" alt="Ask Mark" class="w-10 h-10" />
        <div class="space-y-1">
          <h2 class="text-base text-[#12A0D8] font-medium">Ask Mark</h2>
          <p class="text-sm text-[#6B7280]">Here to help you find support</p>
        </div>
      </div>
      <div
        class="text-xs text-[#B0B72E] font-medium bg-[#FAFAED] border border-[#B0B72E] py-1 px-2 rounded-full"
      >
        View History
      </div>
    </div>
    <div class="flex-1">
      <div
        v-for="(msg, i) in messages"
        :key="i"
        class="w-full flex mb-4"
        :class="msg.sender === 'user' ? 'justify-end' : 'justify-start'"
      >
        <div class="flex items-start gap-4 md:max-w-[70%]">
          <img
            v-if="msg.sender === 'mark'"
            src="/images/mark.svg"
            alt="Mark"
            class="w-10 h-10"
          />
          <div
            :class="
              msg.sender === 'mark'
                ? 'border border-[#AAE3FA] bg-[#EAF8FE] text-[#374151]'
                : 'border border-[#12A0D8] bg-[#12A0D8] text-white'
            "
            class="p-3 rounded-[16px] text-sm"
          >
            {{ msg.text }}
          </div>
        </div>
      </div>
      <div v-if="isPending" class="w-full flex mb-4 justify-start">
        <div class="flex items-start gap-4 max-w-[70%] animate-pulse">
          <img src="/images/mark.svg" alt="Mark" class="w-10 h-10" />
          <div
            class="border border-[#AAE3FA] bg-[#EAF8FE] text-[#374151] p-3 rounded-[16px] text-sm flex items-center gap-2"
          >
            <span
              class="inline-block w-2 h-2 bg-[#D1D5DB] rounded-full animate-bounce"
            ></span>
            <span
              class="inline-block w-2 h-2 bg-[#E5E7EB] rounded-full animate-bounce delay-150"
            ></span>
            <span
              class="inline-block w-2 h-2 bg-[#E5E7EB] rounded-full animate-bounce delay-300"
            ></span>
          </div>
        </div>
      </div>
    </div>
    <div
      class="fixed md:bg-transparent bg-white left-0 md:bottom-[0px] bottom-[86px] md:pl-[252px] md:pr-[32px] w-full z-20 flex items-center justify-center"
    >
      <div class="w-full bg-white flex gap-4 items-center px-6 py-4">
        <input
          v-model="input"
          type="text"
          placeholder="Type in your question or use the mic"
          class="flex-1 bg-white border border-gray-300 rounded-full p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          @keyup.enter="sendMessage"
        />
        <button
          class="bg-[#12A0D8] w-[40px] h-[40px] rounded-full flex items-center justify-center cursor-pointer"
          @click="sendMessage"
        >
          <Icon
            icon="ic:round-send"
            width="20"
            height="20"
            style="color: white"
          />
        </button>
        <button
          class="bg-[#12A0D8] w-[40px] h-[40px] rounded-full flex items-center justify-center cursor-pointer"
          @click="handleMic"
        >
          <Icon icon="ri:mic-line" width="20" height="20" style="color: #fff" />
        </button>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Icon } from "@iconify/vue";
definePageMeta({
  layout: "user",
});
import { ref } from "vue";
import { UseChatBot } from "./hooks/index";

const messages = ref([
  {
    sender: "mark",
    text: "Alright mate! I'm Mark, and I'm here to help you find the right support round Suffolk. What's going on for you today?",
  },
]);
const input = ref("");
const thinking = ref(false);

const { mutate, isPending } = UseChatBot();

function sendMessage() {
  if (!input.value.trim()) return;
  messages.value.push({ sender: "user", text: input.value });
  thinking.value = true;

  // Get user location from localStorage
  let location = { place: "", lat: 0, lng: 0 };
  if (typeof window !== "undefined") {
    const loc = localStorage.getItem("location");
    if (loc) {
      try {
        const obj = JSON.parse(loc);
        location = {
          place: obj.address || "",
          lat: obj.lat || 0,
          lng: obj.lng || 0,
        };
      } catch {}
    }
  }

  mutate(
    { ...location, message: input.value },
    {
      onSuccess: async ({ data }) => {
        messages.value.push({ sender: "mark", text: data.answer });
      },

      onError: (error) => {
        messages.value.push({
          sender: "mark",
          text: "Sorry, I couldn't process your request.",
        });
      },
    }
  );
  input.value = "";
}

function handleMic() {
  // Placeholder for mic functionality
  alert("Mic feature coming soon!");
}
</script>

<template>
  <div
    class="flex-1 w-full bg-white text-[#111827] rounded-t-[24px] px-4 py-6 space-y-4"
  >
    <div
      class="bg-[#F4F4FF] border border-[#33339C1A] p-4 rounded-[16px] space-y-4"
    >
      <div class="space-y-2">
        <h4 class="font-medium text-[#111827]">Who we are:</h4>
        <p class="italic text-sm text-[#374151]">
          Lived expert is a social enterprise set up and run by people with
          lived experience of addiction, mental health, homelessness,
          neurodiversity, and crime.
        </p>
      </div>
      <div class="space-y-2">
        <h4 class="font-medium text-[#111827]">What is this project?</h4>
        <p class="italic text-sm text-[#374151]">
          We are running a project to find out people's experience of drug and
          alcohol services in Suffolk.
        </p>
      </div>
      <div class="space-y-2">
        <h4 class="font-medium text-[#111827]">Why take part:</h4>
        <p class="italic text-sm text-[#374151]">
          It is important that lived experience is included in the design and
          delivery of drug and alcohol services, so they reflect peoples’ needs.
        </p>
      </div>
      <div class="space-y-2">
        <h4 class="font-medium text-[#111827]">What is involved:</h4>
        <p class="italic text-sm text-[#374151]">
          We are running a group to get your feedback on the key themes of what
          people have told us.
        </p>
      </div>
      <div class="space-y-2">
        <h4 class="font-medium text-[#111827]">
          What happens to my information?
        </h4>
        <p class="italic text-sm text-[#374151]">
          The group will be recorded and transcribed. If you provide us with
          your contact details, these will be securely stored on our server. If
          you tell us you are currently involved in crime, or that you are
          someone else are at risk of harm, we must report it.
        </p>
      </div>
      <div class="space-y-2">
        <h4 class="font-medium text-[#111827]">Do i have to take part?</h4>
        <p class="italic text-sm text-[#374151]">
          No, it is completely up to you. If you do take part, you can change
          your mind and ask for your audio or quotes to not be included up to 3
          weeks after the recording.
        </p>
      </div>
      <div class="space-y-2">
        <h4 class="font-medium text-[#111827]">Contact:</h4>
        <p class="italic text-sm text-[#374151]">
          For more information or to stay involved contact Daniel Hutt
          (daniel@livedexpert.org or 07904 008 084).
        </p>
      </div>
    </div>
    <p class="text-sm text-[#374151]">
      When you submit this form, it will not automatically collect your details
      like name and email address unless you provide it yourself.
    </p>
    <div
      class="bg-[#F9FAFB] border border-[#F3F4F6] p-4 rounded-[16px] space-y-4"
    >
      <div class="space-y-1">
        <h4 class="font-medium text-lg text-[#33339C]">Information Sheet</h4>
        <p class="text-sm text-[#374151]">If you agree tick the box below:</p>
      </div>
      <ol class="space-y-2 text-sm text-[#374151] list-decimal list-inside">
        <li>
          I have read and understood the information sheet for this
          consultation.
        </li>
        <li>
          I have had the option to ask questions and receive answers about this
          consultation.
        </li>
        <li>
          I understand my participation is voluntary and I do not have to
          disclose information I want to keep private.
        </li>
        <li>I understand that I can drop out at any time with no penalties.</li>
        <li>I understand that the focus group/interview will be recorded.</li>
        <li>
          I understand that Lived Expert staff/consultants will hold all
          information securely and only they will have access to the raw data
          and information.
        </li>
        <li>
          I understand that the audio from my recording, without my name, may be
          used as a media source.
        </li>
        <li>
          I understand that I can ask for my audio or quotes to not be included
          up to 3 weeks after the recording.
        </li>
        <li>
          I understand that if I tell you that I or someone else is at risk of
          harm or tell you about current criminal activity this information is
          not confidential, and we will have to report it.
        </li>
      </ol>
    </div>
    <div class="flex gap-2 items-center">
      <input
        id="agree"
        type="checkbox"
        class="w-[24px] h-[24px]"
        v-model="hasConsented"
      />
      <label for="agree" class="text-[#33339C] text-sm">
        I agree with the statements and provide consent
      </label>
    </div>
    <div class="mt-6">
      <button
        type="button"
        @click="onToggle('info')"
        :disabled="!hasConsented"
        class="flex w-full items-center gap-2 justify-center rounded-full py-4 px-5 font-medium transition-all duration-200"
        :class="{
          'bg-primary text-white': hasConsented,
          'bg-gray-300 text-gray-500 cursor-not-allowed': !hasConsented,
        }"
      >
        Next
        <Icon
          icon="majesticons:arrow-right"
          width="20"
          height="20"
          :style="{ color: hasConsented ? '#ffffff' : '#9CA3AF' }"
        />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";

const props = defineProps<{
  onToggle: (item: string) => void;
}>();

const hasConsented = ref<boolean>(false);
</script>

<style scoped>
input[type="checkbox"] {
  outline: none;
  accent-color: #33339c;
}
</style>

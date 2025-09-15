<template>
  <div
    class="flex-1 w-full bg-white text-[#111827] rounded-t-[24px] px-4 py-6 space-y-4"
  >
    <div class="space-y-2">
      <h4 class="text-sm text-[#111827] font-medium">
        1. I agree to take part in the above consultation?
      </h4>
      <div class="flex gap-4">
        <div class="flex gap-2 text-sm items-center">
          <input type="radio" class="w-[20px] h-[20px]" />
          <p class="text-[#4B5563]">Agree</p>
        </div>
        <div class="flex gap-2 text-sm items-center">
          <input type="radio" class="w-[20px] h-[20px]" />
          <p class="text-[#4B5563]">Disagree</p>
        </div>
      </div>
    </div>
    <div class="space-y-2">
      <h4 class="text-sm text-[#111827] font-medium">2. First Name</h4>
      <div class="h-[48px] rounded-[10px] px-4 w-full border border-[#D1D5DB]">
        <input
          type="text"
          class="w-full h-full text-sm"
          placeholder="Enter  name"
        />
      </div>
    </div>
    <div class="space-y-2">
      <h4 class="text-sm text-[#111827] font-medium">3. Surname</h4>
      <div class="h-[48px] rounded-[10px] px-4 w-full border border-[#D1D5DB]">
        <input
          type="text"
          class="w-full h-full text-sm"
          placeholder="Enter  name"
        />
      </div>
    </div>
    <div class="space-y-2">
      <h4 class="text-sm text-[#111827] font-medium">4. Location</h4>
      <div class="flex gap-4">
        <div class="flex gap-2 text-sm items-center">
          <input type="radio" class="w-[20px] h-[20px]" />
          <p class="text-[#4B5563]">Bury</p>
        </div>
        <div class="flex gap-2 text-sm items-center">
          <input type="radio" class="w-[20px] h-[20px]" />
          <p class="text-[#4B5563]">Ipswich</p>
        </div>
        <div class="flex gap-2 text-sm items-center">
          <input type="radio" class="w-[20px] h-[20px]" />
          <p class="text-[#4B5563]">Lowestoft</p>
        </div>
      </div>
    </div>
    <div class="space-y-2">
      <h4 class="text-sm text-[#111827] font-medium">5. What is your gender</h4>
      <div class="flex flex-col gap-4">
        <div class="flex gap-2 text-sm items-center">
          <input type="radio" class="w-[20px] h-[20px]" />
          <p class="text-[#4B5563]">Male</p>
        </div>
        <div class="flex gap-2 text-sm items-center">
          <input type="radio" class="w-[20px] h-[20px]" />
          <p class="text-[#4B5563]">Female</p>
        </div>
        <div class="flex gap-2 text-sm items-center">
          <input type="radio" class="w-[20px] h-[20px]" />
          <p class="text-[#4B5563]">Other</p>
        </div>
        <div class="flex gap-2 text-sm items-center">
          <input type="radio" class="w-[20px] h-[20px]" />
          <p class="text-[#4B5563]">Prefer not to say</p>
        </div>
      </div>
    </div>
    <div class="space-y-2">
      <h4 class="text-sm text-[#111827] font-medium">6. How old are you?</h4>
      <div class="h-[48px] rounded-[10px] px-4 w-full border border-[#D1D5DB]">
        <input
          type="text"
          class="w-full h-full text-sm"
          placeholder="Enter your answer"
        />
      </div>
    </div>
    <div class="space-y-2">
      <h4 class="text-sm text-[#111827] font-medium">
        7. How would you describe your ethinicity?
      </h4>
      <div class="flex flex-col gap-4">
        <div class="flex gap-2 text-sm items-center">
          <input type="radio" class="w-[20px] h-[20px]" />
          <p class="text-[#4B5563]">Asian or Asian British</p>
        </div>
        <div class="flex gap-2 text-sm items-center">
          <input type="radio" class="w-[20px] h-[20px]" />
          <p class="text-[#4B5563]">
            Black, Black British, Caribbean, or African
          </p>
        </div>
        <div class="flex gap-2 text-sm items-center">
          <input type="radio" class="w-[20px] h-[20px]" />
          <p class="text-[#4B5563]">Mixed or multiple ethnic groups</p>
        </div>
        <div class="flex gap-2 text-sm items-center">
          <input type="radio" class="w-[20px] h-[20px]" />
          <p class="text-[#4B5563]">White</p>
        </div>
        <div class="flex gap-2 text-sm items-center">
          <input type="radio" class="w-[20px] h-[20px]" />
          <div
            class="h-[48px] flex-1 rounded-[10px] px-4 w-full border border-[#D1D5DB]"
          >
            <input
              type="text"
              class="w-full h-full text-sm"
              placeholder="Other"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="space-y-2">
      <h4 class="text-sm text-[#111827] font-medium">
        8. Where are you right now in your recovery journey?
      </h4>
      <div class="flex flex-col gap-4">
        <div class="flex gap-2 text-sm items-center">
          <input type="checkbox" class="w-[20px] h-[20px]" />
          <p class="text-[#4B5563] flex-1">
            Using but not accessing any treatment services
          </p>
        </div>
        <div class="flex gap-2 text-sm items-center">
          <input type="checkbox" class="w-[20px] h-[20px]" />
          <p class="text-[#4B5563] flex-1">
            Using harm reduction services (e.g. needle exchange, naloxone, safer
            using advice, health checks)
          </p>
        </div>
        <div class="flex gap-2 text-sm items-center">
          <input type="checkbox" class="w-[20px] h-[20px]" />
          <p class="text-[#4B5563] flex-1">
            On medication (e.g. methadone, Subutex, Buvidal)
          </p>
        </div>
        <div class="flex gap-2 text-sm items-center">
          <input type="checkbox" class="w-[20px] h-[20px]" />
          <p class="text-[#4B5563] flex-1">
            Attending groups, counselling, or peer support (e.g. SMART Recovery,
            NA, AA)
          </p>
        </div>
        <div class="flex gap-2 text-sm items-center">
          <input type="checkbox" class="w-[20px] h-[20px]" />
          <p class="text-[#4B5563] flex-1">
            In detox or rehab (or recently completed)
          </p>
        </div>
        <div class="flex gap-2 text-sm items-center">
          <input type="checkbox" class="w-[20px] h-[20px]" />
          <p class="text-[#4B5563] flex-1">
            Getting wider support (e.g. help with housing, mental health,
            employment)
          </p>
        </div>
        <div class="flex gap-2 text-sm items-center">
          <input type="checkbox" class="w-[20px] h-[20px]" />
          <p class="text-[#4B5563] flex-1">
            In aftercare or relapse prevention support
          </p>
        </div>
      </div>
    </div>
    <div class="pt-6">
      <button
        type="button"
         @click="onToggle('submit')"
        class="flex w-full items-center gap-2 bg-primary text-white justify-center rounded-full py-4 px-5 font-medium"
      >
        Submit Form
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  onToggle: (item: string) => void;
}>();
</script>
<style scoped>
input {
    outline: none;
    accent-color: #33339C;
}
</style>

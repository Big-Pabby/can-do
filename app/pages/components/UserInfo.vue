<template>
  <form
    class="flex-1 w-full bg-white text-[#111827] rounded-t-[24px] px-4 py-6 space-y-4"
    @submit.prevent="handleSubmit"
  >
    <!-- 1. Agree -->
    <div class="space-y-2">
      <h4 class="font-medium">
        1. I agree to take part in the above consultation?
      </h4>
      <div class="flex gap-4">
        <label class="flex gap-2 items-center text-sm">
          <input type="radio" value="agree" v-model="form.agree" />
          <span class="text-[#4B5563]">Agree</span>
        </label>
        <label class="flex gap-2 items-center text-sm">
          <input type="radio" value="disagree" v-model="form.agree" />
          <span class="text-[#4B5563]">Disagree</span>
        </label>
      </div>
    </div>

    <!-- 2. First name -->
    <div class="space-y-2">
      <h4 class="font-medium">2. First Name</h4>
      <div class="h-[48px] border rounded-[10px] px-4">
        <input
          type="text"
          v-model="form.first_name"
          class="w-full h-full text-sm"
        />
      </div>
    </div>

    <!-- 3. Last name -->
    <div class="space-y-2">
      <h4 class="font-medium">3. Surname</h4>
      <div class="h-[48px] border rounded-[10px] px-4">
        <input
          type="text"
          v-model="form.last_name"
          class="w-full h-full text-sm"
        />
      </div>
    </div>

    <!-- 4. Location -->
    <div class="space-y-2">
      <h4 class="font-medium">4. Location</h4>
      <div class="flex gap-4">
        <label class="flex gap-2 items-center text-sm">
          <input type="radio" value="Bury" v-model="form.location" />
          <span class="text-[#4B5563]">Bury</span>
        </label>
        <label class="flex gap-2 items-center text-sm">
          <input type="radio" value="Ipswich" v-model="form.location" />
          <span class="text-[#4B5563]">Ipswich</span>
        </label>
        <label class="flex gap-2 items-center text-sm">
          <input type="radio" value="Lowestoft" v-model="form.location" />
          <span class="text-[#4B5563]">Lowestoft</span>
        </label>
      </div>
    </div>

    <!-- 5. Gender -->
    <div class="space-y-2">
      <h4 class="font-medium">5. What is your gender</h4>
      <div class="flex flex-col text-sm gap-2">
        <label class="text-[#4B5563] flex gap-2 items-center text-sm"
          ><input type="radio" value="Male" v-model="form.gender" /> Male</label
        >
        <label class="text-[#4B5563] flex gap-2 items-center text-sm"
          ><input type="radio" value="Female" v-model="form.gender" />
          Female</label
        >
        <label class="text-[#4B5563] flex gap-2 items-center text-sm"
          ><input type="radio" value="Other" v-model="form.gender" />
          Other</label
        >
        <label class="text-[#4B5563] flex gap-2 items-center text-sm"
          ><input
            type="radio"
            value="Prefer not to say"
            v-model="form.gender"
          />
          Prefer not to say</label
        >
      </div>
    </div>

    <!-- 6. Age -->
    <div class="space-y-2">
      <h4 class="font-medium">6. How old are you?</h4>
      <div class="h-[48px] border rounded-[10px] px-4">
        <input
          type="number"
          v-model.number="form.age"
          class="w-full h-full text-sm"
        />
      </div>
    </div>

    <!-- 7. Ethnicity -->
    <div class="space-y-2">
      <h4 class="font-medium">7. Ethnicity</h4>
      <div class="flex flex-col text-sm gap-2">
        <label class="text-[#4B5563] flex gap-2 items-center text-sm"
          ><input
            type="radio"
            value="Asian or Asian British"
            v-model="form.ethnicity"
          />
          Asian or Asian British</label
        >
        <label class="text-[#4B5563] flex gap-2 items-center text-sm"
          ><input
            type="radio"
            value="Black, Black British, Caribbean, or African"
            v-model="form.ethnicity"
          />
          Black, Black British, Caribbean, or African</label
        >
        <label class="text-[#4B5563] flex gap-2 items-center text-sm"
          ><input
            type="radio"
            value="Mixed or multiple ethnic groups"
            v-model="form.ethnicity"
          />
          Mixed or multiple ethnic groups</label
        >
        <label class="text-[#4B5563] flex gap-2 items-center text-sm"
          ><input type="radio" value="White" v-model="form.ethnicity" />
          White</label
        >
        <label class="flex gap-2 items-center">
          <input type="radio" value="Other" v-model="form.ethnicity" />
          <input
            type="text"
            placeholder="Other"
            v-model="form.ethnicityOther"
            class="h-[48px] border rounded-[10px] px-4"
          />
        </label>
      </div>
    </div>

    <!-- 8. Recovery journey -->
    <div class="space-y-2">
      <h4 class="font-medium">8. Recovery journey</h4>
      <div class="flex flex-col text-sm gap-2">
        <label class="text-[#4B5563] flex gap-2 items-center text-sm"
          ><input
            type="checkbox"
            value="Using but not accessing services"
            v-model="form.recovery_status"
          />
          Using but not accessing services</label
        >
        <label class="text-[#4B5563] flex gap-2 items-center text-sm"
          ><input
            type="checkbox"
            value="Using harm reduction services"
            v-model="form.recovery_status"
          />
          Using harm reduction services</label
        >
        <label class="text-[#4B5563] flex gap-2 items-center text-sm"
          ><input
            type="checkbox"
            value="On medication"
            v-model="form.recovery_status"
          />
          On medication</label
        >
        <label class="text-[#4B5563] flex gap-2 items-center text-sm"
          ><input
            type="checkbox"
            value="Attending groups"
            v-model="form.recovery_status"
          />
          Attending groups</label
        >
        <label class="text-[#4B5563] flex gap-2 items-center text-sm"
          ><input
            type="checkbox"
            value="In detox or rehab"
            v-model="form.recovery_status"
          />
          In detox or rehab</label
        >
        <label class="text-[#4B5563] flex gap-2 items-center text-sm"
          ><input
            type="checkbox"
            value="Getting wider support"
            v-model="form.recovery_status"
          />
          Getting wider support</label
        >
        <label class="text-[#4B5563] flex gap-2 items-center text-sm"
          ><input
            type="checkbox"
            value="In aftercare"
            v-model="form.recovery_status"
          />
          In aftercare</label
        >
      </div>
    </div>

    <!-- Submit -->
    <div class="pt-6">
      <button
        type="submit"
        class="w-full bg-primary text-white rounded-full py-4 px-5 font-medium"
        :disabled="isLoading"
      >
        {{ isLoading ? "Submitting..." : "Submit Form" }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useConsent } from "../hooks";
const props = defineProps<{
  onToggle: (item: string) => void;
}>();

const { mutate, isPending: isLoading } = useConsent();

const form = reactive({
  agree: "",
  first_name: "",
  last_name: "",
  location: "",
  gender: "",
  age: null as number | null,
  ethnicity: "",
  ethnicityOther: "",
  recovery_status: [] as string[],
});

async function handleSubmit() {
  const payload = {
    first_name: form.first_name,
    last_name: form.last_name,
    age: form.age ?? 0,
    gender: form.gender,
    location: form.location,
    ethincity:
      form.ethnicity === "Other" ? form.ethnicityOther : form.ethnicity,
    recovery_status: form.recovery_status, // API expects string?
  };
  mutate(payload, {
    onSuccess({ data }) {
      localStorage.setItem("consent_id", data.id);
      props.onToggle("submit");
      console.log(data);
    },
    onError(error) {
      console.error("Submit failed", error);
    },
  });
}
</script>

<style scoped>
input {
  outline: none;
  accent-color: #33339c;
}
input[type="radio"],
input[type="checkbox"] {
  width: 20px;
  height: 20px;
}
</style>

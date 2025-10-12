<template>
  <div class="flex md:flex-row flex-col">
    <div
      class="py-8 md:w-6/12 bg-[#EAF8FE] md:flex hidden items-center justify-center flex-col space-y-4 text-white md:px-36 px-5"
    >
      <div class="text-center space-y-1">
        <h2 class="text-[#12A0D8] font-bold md:text-4xl">
          Meet your community
        </h2>
        <p class="text-[#121212]">
          Hear from people who've navigated these services before you
        </p>
      </div>
      <div class="w-full">
        <TestimonialCarousel :testimonials="testimonials" />
      </div>
    </div>
    <form
      @submit.prevent="handleFormSubmit"
      class="px-5 md:px-24 py-12 space-y-4 flex-1 h-screen overflow-y-auto"
    >
      <div class="space-y-4 mb-6 text-center flex items-center flex-col">
        <img src="/images/logo-2.svg" alt="" />
        <div class="space-y-1">
          <p class="text-xl text-[#111827] font-medium">
            Let's set up your profile
          </p>
          <p class="text-sm text-[#374151]">
            Share only what you're comfortable with
          </p>
        </div>
      </div>
      <div class="space-y-1">
        <label for="name" class="text-sm text-[#374151]"
          >What should i call you? (username)</label
        >
        <input
          id="name"
          v-model="form.username"
          required
          type="text"
          placeholder="e.g Alex, Sam, or any name you like"
          class="w-full bg-white border border-gray-300 rounded-[10px] p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p class="text-xs text-[#6B7280]">
          This can be your first name, nickname, or anything you prefer
        </p>
      </div>
      <div class="space-y-1">
        <label for="phone_number" class="text-sm text-[#374151]"
          >Phone Number</label
        >
        <input
          v-model="form.phone_number"
          required
          id="phone_number"
          type="text"
          placeholder="e.g 0909090909"
          class="w-full bg-white border border-gray-300 rounded-[10px] p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p class="text-xs text-[#6B7280]">
          Helps us reach you for important updates & reasons only
        </p>
      </div>
      <div class="space-y-1">
        <label for="email" class="text-sm text-[#374151]">Email Address</label>
        <input
          v-model="form.email"
          required
          id="email"
          type="text"
          placeholder="e.g cando@gmail.com"
          class="w-full bg-white border border-gray-300 rounded-[10px] p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p class="text-xs text-[#6B7280]">
          Helps us reach you for important updates & reasons only
        </p>
      </div>
      <div class="space-y-1">
        <label for="password" class="text-sm text-[#374151]">Password</label>
        <input
          required
          v-model="form.password"
          id="password"
          type="password"
          placeholder="Enter password"
          class="w-full bg-white border border-gray-300 rounded-[10px] p-3.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p class="text-xs text-[#6B7280]">
          Enter a password you can easily remember
        </p>
      </div>
      <div class="space-y-1">
        <label for="service_interest" class="text-sm text-[#374151]"
          >Service Interests</label
        >
        <p class="text-xs text-[#4B5563]">
          Select areas you might need support with for better recommendations
        </p>
        <div
          class="border-[#F3F4F6] bg-white p-4 rounded-[16px] grid grid-cols-1 gap-2 mt-2"
        >
          <button
            type="button"
            v-for="interest in interests"
            :key="interest"
            @click="
              {
                if (form.service_interest.includes(interest)) {
                  form.service_interest = form.service_interest.filter(
                    (i) => i !== interest
                  );
                } else {
                  form.service_interest.push(interest);
                }
              }
            "
            :class="{
              'bg-[#EAF8FE] text-[#12A0D8]':
                form.service_interest.includes(interest),
              'bg-[#F9FAFB] text-[#4B5563]':
                !form.service_interest.includes(interest),
            }"
            class="w-full border border-[#F3F4F6] rounded-[16px] p-3.5 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
          >
            {{ interest }}
            <div
              class="w-[16px] h-[16px] rounded-[4px] border flex items-center justify-center bg-white"
              :class="{
                ' border-[#12A0D8]': form.service_interest.includes(interest),
                ' border-[#D1D5DB]': !form.service_interest.includes(interest),
              }"
            >
              <span
                v-if="form.service_interest.includes(interest)"
                class="text-[#12A0D8] text-xs font-bold"
                >✓</span
              >
            </div>
          </button>
        </div>
      </div>

      <button
        :disabled="isPending"
        class="w-full bg-[#12A0D8] text-white font-semibold py-4 px-5 rounded-full transition duration-200 flex items-center justify-center gap-2"
      >
        <Icon
          v-if="isPending"
          icon="mdi:loading"
          class="w-5 h-5 animate-spin"
        />
        Submit
        <Icon
          icon="tabler:arrow-right"
          width="20"
          height="20"
          style="color: #fff"
        />
      </button>
       <p class="text-sm text-[#374151] text-center">
            Already have an account?
            <nuxt-link
              to="/sign-in"
              class="text-base text-[#12A0D8] font-medium"
              >Sign In</nuxt-link
            >
          </p>
    </form>
  </div>
</template>
<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useSignUp } from "../hooks";
import { toast } from "vue-sonner";
interface SignUpForm {
  username: string;
  phone_number: string;
  email: string;
  password: string;
  service_interest: string[];
}
const form = ref<SignUpForm>({
  username: "",
  phone_number: "",
  email: "",
  password: "",
  service_interest: [] as string[],
});
const selectedInterests = ref<string[]>([]);
const interests = [
  "🧠 Mental Health Support",
  "🏠 Housing & Homelessness",
  "🤝 Addiction & Recovery",
  "💷 Benefits & Financial Support",
  "❤️‍🩹 Health Services",
  "💼 Job and other services",
];
const testimonials = [
  {
    name: "Anthony",
    role: "Recovery Support",
    text: '"Recovery is possible with the right support. Now I help others find the same services that worked for me through CanDo."',
    image: "/images/image-4.svg",
  },
  {
    name: "Marcus",
    role: "Housing Support",
    text: '"Stable housing changed everything for me. With CanDo, I’m able to guide others toward safe and supportive living."',
    image: "/images/image-5.svg",
  },
  {
    name: "Maya",
    role: "Mental Health Support",
    text: '"Living with anxiety and depression felt isolating. CanDo connected me with care and community.”',
    image: "/images/image-6.svg",
  },
];
const { mutate: signUp, isPending, error } = useSignUp();
const handleFormSubmit = () => {
  signUp(form.value, {
    onSuccess() {
      toast.success("Sign-up Successful", {
        style: {
          background: "#F0FDF4",
          border: "1px solid #BBF7D0",
          color: "#16A34A",
        },
        class: "my-toast",
        descriptionClass: "my-toast-description",
      });
      // Redirect to another page or show success message
      useRouter().push("/sign-in");
    },
    onError(err: any) {
      const msg = err?.response?.data?.detail || "Failed to signup.";
      toast.error(msg);
    },
  });
};
</script>

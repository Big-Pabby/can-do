<template>
  <div class="flex md:flex-row flex-col min-h-screen">
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
    <div class="px-5 md:px-36 py-8 flex-1 flex items-center justify-center">
      <div class="w-full space-y-8">
        <div class="space-y-2 text-center flex items-center flex-col">
          <img src="/images/logo-2.svg" alt="" />
          <p class="text-xl text-[#111827] font-medium">
            Find trusted support <br />
            through lived experience
          </p>
          <p class="text-sm text-[#374151]">
            Real feedback from people like you to help you navigate services
            with confidence
          </p>
        </div>
        <div class="bg-[#D5F1FC] w-full p-4 rounded-[16px] space-y-4">
          <p class="text-sm font-medium text-[#374151]">
            Completely independent from services & government
          </p>
          <div class="grid grid-cols-3 gap-2">
            <div
              class="border border-[#BFEAFB] bg-white p-3 rounded-[8px] flex flex-col items-center justify-center gap-2"
            >
              <div
                class="w-[48px] h-[48px] bg-[#CFD659] p-2.5 rounded-[10px] flex items-center justify-center text-white"
              >
                <Icon
                  icon="icons8:lock-2"
                  width="28"
                  height="28"
                  style="color: #fff"
                />
              </div>
              <p class="text-sm text-[#B0B72E] text-center">Privacy</p>
            </div>
            <div
              class="border border-[#BFEAFB] bg-white p-3 rounded-[8px] flex flex-col items-center justify-center gap-2"
            >
              <div
                class="w-[48px] h-[48px] bg-[#12A0D8] p-2.5 rounded-[10px] flex items-center justify-center text-white"
              >
                <Icon
                  icon="lucide:users"
                  width="28"
                  height="28"
                  style="color: #fff"
                />
              </div>
              <p class="text-sm text-[#12A0D8] text-center">Peer-Led</p>
            </div>
            <div
              class="border border-[#BFEAFB] bg-white p-3 rounded-[8px] flex flex-col items-center justify-center gap-2"
            >
              <div
                class="w-[48px] h-[48px] bg-[#FE4D67] p-2.5 rounded-[10px] flex items-center justify-center text-white"
              >
                <Icon
                  icon="proicons:chat"
                  width="28"
                  height="28"
                  style="color: #fff"
                />
              </div>
              <p class="text-sm text-[#FE4D67] text-center">Real Stories</p>
            </div>
          </div>
        </div>
        <div class="space-y-3">
          <nuxt-link
            to="/sign-up"
            class="w-full bg-[#12A0D8] text-white font-semibold py-4 px-5 rounded-full transition duration-200 flex items-center justify-center gap-2"
          >
            Sign Up
            <Icon
              icon="tabler:arrow-right"
              width="20"
              height="20"
              style="color: #fff"
            />
          </nuxt-link>
          <nuxt-link
            to="/sign-in"
            class="w-full border border-[#12A0D8] text-[#12A0D8] font-semibold py-4 px-5 rounded-full transition duration-200 flex items-center justify-center gap-2"
          >
            Sign In
          </nuxt-link>
          <p class="text-sm text-[#374151] text-center">
            <nuxt-link to="/home" class="text-base font-medium"
              >Try Anonymously</nuxt-link
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Icon } from "@iconify/vue";
interface SignUpForm {
  username: string;

  password: string;
}
const form = ref<SignUpForm>({
  username: "",

  password: "",
});
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
</script>
<style scoped>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0px 1000px white inset !important;
  box-shadow: 0 0 0px 1000px white inset !important;
  -webkit-text-fill-color: #000 !important;
  transition: background-color 5000s ease-in-out 0s;
}
</style>

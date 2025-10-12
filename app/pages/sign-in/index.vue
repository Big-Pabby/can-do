<template>
  <div class="flex md:flex-row flex-col min-h-screen">
    <div
      class="py-8  md:w-6/12 bg-[#EAF8FE] md:flex hidden items-center justify-center flex-col space-y-4 text-white md:px-36 px-5"
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
    <div
      class="px-5 md:px-36 py-8 flex-1 md:flex md:items-center md:justify-center"
    >
      <form @submit.prevent="handleFormSubmit" class="w-full space-y-8">
        <div class="space-y-2 text-center flex items-center flex-col">
          <img src="/images/logo-2.svg" alt="" />
          <p class="text-xl text-[#111827] font-medium">
            Find trusted support <br />
            through lived experience
          </p>
        </div>
        <div class="bg-[#D5F1FC] w-full p-4 rounded-[16px] space-y-4">
          <div class="space-y-1">
            <label for="username" class="text-sm font-medium text-[#374151]"
              >Your Username or Email Address</label
            >
            <div
              class="bg-white border border-gray-300 rounded-[10px] p-3.5 focus:outline-none flex gap-4 outline-none justify-between items-center focus:ring-2 focus:ring-blue-500"
            >
              <input
                v-model="form.username"
                required
                id="username"
                type="text"
                placeholder="Enter your username"
                class="w-full border-0 outline-0 p-0 m-0"
              />
              <Icon
                icon="mage:user"
                width="20"
                height="20"
                style="color: #4b5563"
              />
            </div>
          </div>
          <div class="space-y-1">
            <label for="password" class="text-sm font-medium text-[#374151]"
              >Password</label
            >
            <div
              class="bg-white border border-gray-300 rounded-[10px] p-3.5 focus:outline-none outline-none flex gap-4 justify-between items-center focus:ring-2 focus:ring-blue-500"
            >
              <input
                v-model="form.password"
                required
                id="password"
                type="password"
                placeholder="Enter your password"
                class="w-full border-0 outline-0 p-0 m-0"
              />
              <Icon
                icon="iconamoon:eye"
                width="20"
                height="20"
                style="color: #4b5563"
              />
            </div>
          </div>
        </div>
        <div class="space-y-2">
          <button
            :disabled="isPending"
            class="w-full bg-[#12A0D8] text-white font-semibold py-4 px-5 rounded-full transition duration-200 flex items-center justify-center gap-2"
          >
            <Icon
              v-if="isPending"
              icon="mdi:loading"
              class="w-5 h-5 animate-spin"
            />
            Login
            <Icon
              icon="tabler:arrow-right"
              width="20"
              height="20"
              style="color: #fff"
            />
          </button>
          <p class="text-sm text-[#374151] text-center">
            Don't have an account?
            <nuxt-link
              to="/sign-up"
              class="text-base text-[#12A0D8] font-medium"
              >Sign Up Now</nuxt-link
            >
          </p>
        </div>
      </form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { useSignIn } from "../hooks";
import { toast } from "vue-sonner";
import { useAuthStore } from "~/store/auth";
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
    image:
      "/images/image-4.svg",
  },
  {
    name: "Marcus",
    role: "Housing Support",
    text: '"Stable housing changed everything for me. With CanDo, I’m able to guide others toward safe and supportive living."',
    image:
        "/images/image-5.svg",
  },
  {
    name: "Maya",
    role: "Mental Health Support",
    text: '"Living with anxiety and depression felt isolating. CanDo connected me with care and community.”',
    image:
        "/images/image-6.svg",
  },
];
const { mutate: signIn, isPending, error } = useSignIn();
const handleFormSubmit = () => {
  const formData = new FormData();
  formData.append("username", form.value.username);
  formData.append("password", form.value.password);
  signIn(formData, {
    onSuccess({ data }) {
      toast.success("Sign-in Successful", {
        style: {
          background: "#F0FDF4",
          border: "1px solid #BBF7D0",
          color: "#16A34A",
        },
        class: "my-toast",
        descriptionClass: "my-toast-description",
      });
      useAuthStore().setTokens(data);
      // Redirect to another page or show success message
      useRouter().push("/home");
    },
    onError(err: any) {
      const msg = err?.response?.data?.detail || "Failed to signup.";
      toast.error(msg);
    },
  });
};
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

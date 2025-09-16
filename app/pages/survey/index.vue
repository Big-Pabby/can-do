<template>
  <div class="space-y-4">
    <Introduction
      v-if="onboard === 'introduction'"
      v-on:toggle="toggleScreen"
    />
    <Experience
      v-else-if="onboard === 'experience'"
      v-on:toggle="toggleScreen"
      v-on:select="updateSurveyData('current_feeling', $event)"
    />
    <Explore
      v-else-if="onboard === 'explore'"
      v-on:toggle="toggleScreen"
      v-on:select="updateSurveyData('support_discovery_important', $event)"
    />
    <Help
      v-else-if="onboard === 'help'"
      v-on:toggle="toggleScreen"
      v-on:select="updateSurveyData('preferred_support_process', $event)"
    />
    <Sharing
      v-else-if="onboard === 'sharing'"
      v-on:toggle="toggleScreen"
      v-on:select="updateSurveyData('offered_support_feeling', $event)"
    />
    <Thoughts
      v-else-if="onboard === 'thoughts'"
      v-on:toggle="toggleScreen"
      v-on:select="updateSurveyData('preferred_insight_appreciation', $event)"
      v-on:submit="submitSurvey"
    />
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref, reactive } from "vue";
import Introduction from "../components/Introduction.vue";
import Experience from "../components/Experience.vue";
import Explore from "../components/Explore.vue";
import Help from "../components/Help.vue";
import Sharing from "../components/Sharing.vue";
import Thoughts from "../components/Thoughts.vue";
import { useConsentInsight } from "../hooks";

const onboard = ref<string>("introduction");

// Survey data store
const surveyData = reactive({
  current_feeling: "",
  support_experience: "",
  support_discovery_important: "",
  preferred_support_process: "",
  offered_support_feeling: "",
  preferred_insight_appreciation: "",
});

// Get the consent insight mutation
const consentInsightMutation = useConsentInsight();

const toggleScreen = (name: string) => {
  onboard.value = name;

  // Smooth scroll to top
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const updateSurveyData = (field: keyof typeof surveyData, value: string) => {
  surveyData[field] = value;
};

const submitSurvey = async () => {
  try {
    // Get consent_id from localStorage or route params
    const consentId = localStorage.getItem("consent_id") || "temp-consent-id";

    const payload = {
      consent_id: consentId,
      data: {
        current_feeling: surveyData.current_feeling,
        support_experience: surveyData.support_experience,
        support_discovery_important: surveyData.support_discovery_important,
        preferred_support_process: surveyData.preferred_support_process,
        offered_support_feeling: surveyData.offered_support_feeling,
        preferred_insight_appreciation:
          surveyData.preferred_insight_appreciation,
      },
    };

    await consentInsightMutation.mutateAsync(payload);

    // Navigate to success page or show success message
    console.log("Survey submitted successfully");
  } catch (error) {
    console.error("Error submitting survey:", error);
    // Handle error (show error message, etc.)
  }
};
</script>

<style></style>

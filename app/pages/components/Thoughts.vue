<template>
  <div class="space-y-6 flex flex-col h-full">
    <div class="px-5 pt-16 space-y-2">
      <div
        @click="onToggle('sharing')"
        class="w-[40px] h-[40px] rounded-full bg-[#F3F4F633] p-2 flex items-center justify-center mb-4"
      >
        <Icon
          icon="tabler:arrow-left"
          width="24"
          height="24"
          style="color: #fff"
        />
      </div>
      <h1 class="text-lg font-[700]">
        Sharing any final thoughts in your own way
      </h1>
      <div class="flex items-center gap-4">
        <div
          class="bg-[#FFFFFFCC] relative h-[8px] rounded-full flex-1 overflow-hidden"
        >
          <div
            class="w-6/6 absolute top-0 left-0 bg-[#22C55E] h-[8px] rounded-full"
          ></div>
        </div>
        <p class="font-medium text-sm">(6/6)</p>
      </div>
    </div>
    <div
      class="flex-1 w-full bg-[#F9FAFB] text-[#111827] rounded-t-[24px] px-4 py-6 space-y-4"
    >
      <div
        class="text-center mt-4 space-y-2 bg-[#F59E0B] p-4 rounded-[16px] border border-[#FDE68A] flex flex-col items-center justify-center w-full"
      >
        <div
          class="bg-white rounded-full w-[48px] h-[48px] p-2.5 flex items-center justify-center"
        >
          <Icon
            icon="tabler:gift"
            width="28"
            height="28"
            style="color: #d97706"
          />
        </div>
        <p class="text-white font-medium">Thank You for Your Time and Trust</p>
        <p class="text-sm text-white">
          Let us know how you'd like us to show our appreciation
        </p>
      </div>
      <div
        class="p-4 rounded-[16px] space-y-3 bg-[#FFFFFF] border border-[#F3F4F6]"
      >
        <div
          class="bg-[#F0F8FF] border border-[#B3DAFF] p-4 rounded-[16px] text-sm text-[#0067C7]"
        >
          Your time is valuable, and sharing your experiences takes emotional
          energy. We want to acknowledge that properly.
        </div>
        <h4 class="text-lg font-medium">
          What kind of appreciation would feel meaningful to you?
        </h4>
        <p class="text-sm text-[#6B7280] italic">
          This isn't payment - it's recognition that your expertise and time
          have value
        </p>
        <div
          v-for="(item, index) in permissions"
          :key="index"
          class="flex gap-2 items-start border p-4 rounded-[16px] cursor-pointer transition-all duration-200"
          :class="{
            'border-[#33339C] bg-[#F4F4FF]': selectedValue === item.title,
            'border-[#F3F4F6] bg-[#F9FAFB]': selectedValue !== item.title,
          }"
          @click="selectItem(item.title)"
        >
          <div class="flex-1 space-y-2">
            <h5
              class="font-medium text-base transition-colors duration-200"
              :class="{
                'text-[#33339C]': selectedValue === item.title,
                'text-[#111827]': selectedValue !== item.title,
              }"
            >
              {{ item.title }}
            </h5>
            <p class="text-sm text-[#4B5563]">{{ item.subtitle }}</p>
          </div>
        </div>
      </div>
      <div
        class="p-4 rounded-[16px] space-y-3 bg-[#FFFFFF] border border-[#F3F4F6]"
      >
        <div
          class="bg-[#FFFBEB] border border-[#FDE68A] p-4 rounded-[16px] text-sm text-[#B45309]"
        >
          You've shared so much valuable insight. Is there anything else you
          want us to know? You can type or record your thoughts.
        </div>
        <h4 class="text-lg font-medium">
          What else should we understand about your world?
        </h4>
        <p class="text-sm text-[#6B7280] italic">
          Anything about services, support, or what would really make a
          difference in your life
        </p>
        <div class="border border-[#E5E7EB] bg-white p-4 rounded-[4px]">
          <textarea
            v-model="additionalThoughts"
            class="w-full text-sm outline-none rounded-none p-0 m-0 min-h-[100px]"
            placeholder="Share anything that feels important to you. Type or use the mic..."
          ></textarea>

          <!-- Voice Recording Section -->
          <div
            v-if="isRecording || hasRecording"
            class="mt-4 p-4 bg-[#F8FAFC] rounded-[8px] border border-[#E2E8F0]"
          >
            <!-- Recording Status -->
            <div v-if="isRecording" class="flex items-center gap-3 mb-3">
              <div class="flex items-center gap-2">
                <div
                  class="w-3 h-3 bg-red-500 rounded-full animate-pulse"
                ></div>
                <span class="text-sm font-medium text-[#DC2626]"
                  >Recording...</span
                >
              </div>
              <span class="text-sm text-[#6B7280]">{{
                formatTime(recordingTime)
              }}</span>
            </div>

            <!-- Recording Controls -->
            <div class="flex items-center gap-3 mb-3">
              <!-- Record Button -->
              <button
                v-if="!isRecording && !hasRecording"
                @click="startRecording"
                class="w-10 h-10 rounded-full bg-[#33339C] flex items-center justify-center hover:bg-[#2A2A7A] transition-colors"
              >
                <Icon
                  icon="material-symbols:mic"
                  width="20"
                  height="20"
                  style="color: #fff"
                />
              </button>

              <!-- Stop Recording Button -->
              <button
                v-if="isRecording"
                @click="stopRecording"
                class="w-10 h-10 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
              >
                <Icon
                  icon="material-symbols:stop"
                  width="20"
                  height="20"
                  style="color: #fff"
                />
              </button>

              <!-- Play/Pause Button -->
              <button
                v-if="hasRecording && !isRecording"
                @click="togglePlayback"
                class="w-10 h-10 rounded-full bg-[#059669] flex items-center justify-center hover:bg-[#047857] transition-colors"
              >
                <Icon
                  :icon="
                    isPlaying
                      ? 'material-symbols:pause'
                      : 'material-symbols:play-arrow'
                  "
                  width="20"
                  height="20"
                  style="color: #fff"
                />
              </button>

              <!-- Delete Recording Button -->
              <button
                v-if="hasRecording"
                @click="deleteRecording"
                class="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center hover:bg-gray-600 transition-colors"
              >
                <Icon
                  icon="material-symbols:delete"
                  width="18"
                  height="18"
                  style="color: #fff"
                />
              </button>

              <!-- Recording Duration -->
              <span v-if="hasRecording" class="text-sm text-[#6B7280] ml-2">
                {{ formatTime(audioDuration || recordingTime) }}
              </span>
            </div>

            <!-- Audio Waveform Visualization -->
            <div v-if="isRecording || hasRecording" class="mb-3">
              <div class="flex items-center gap-1 h-8">
                <div
                  v-for="(bar, index) in waveformBars"
                  :key="index"
                  class="bg-[#33339C] rounded-full transition-all duration-100"
                  :style="{
                    width: '3px',
                    height: isRecording
                      ? `${Math.random() * 20 + 4}px`
                      : `${bar}px`,
                    opacity: isRecording ? 0.8 : 0.6,
                  }"
                ></div>
              </div>
            </div>

            <!-- Transcript Section -->
            <div
              v-if="transcript"
              class="mt-3 p-3 bg-white rounded-[6px] border border-[#E2E8F0]"
            >
              <div class="flex items-center gap-2 mb-2">
                <Icon
                  icon="material-symbols:transcript"
                  width="16"
                  height="16"
                  style="color: #33339c"
                />
                <span class="text-sm font-medium text-[#33339C]"
                  >Transcript</span
                >
              </div>
              <p class="text-sm text-[#374151] leading-relaxed">
                {{ transcript }}
              </p>
              <button
                @click="applyTranscript"
                class="mt-2 text-xs text-[#33339C] hover:text-[#2A2A7A] underline"
              >
                Use this text
              </button>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-4 mt-4 justify-end">
            <button
              v-if="!isRecording && !hasRecording"
              @click="startRecording"
              class="w-10 h-10 rounded-full border border-[#F3F4F6] flex items-center justify-center hover:border-[#33339C] hover:bg-[#F4F4FF] transition-all"
            >
              <Icon
                icon="material-symbols:mic-outline-rounded"
                width="20"
                height="20"
                style="color: #33339c"
              />
            </button>

            <!-- <button
              @click="submitForm"
              :disabled="!additionalThoughts && !transcript"
              class="w-10 h-10 rounded-[8px] flex justify-center items-center transition-all"
              :class="{
                'bg-[#33339C] hover:bg-[#2A2A7A]':
                  additionalThoughts || transcript,
                'bg-gray-300 cursor-not-allowed':
                  !additionalThoughts && !transcript,
              }"
            >
              <Icon icon="mi:send" width="16" height="16" style="color: #fff" />
            </button> -->
          </div>

          <!-- Mobile Permission Help -->
          <div
            v-if="!isRecording && !hasRecording"
            class="mt-3 p-3 bg-[#FEF3C7] border border-[#F59E0B] rounded-[8px]"
          >
            <div class="flex items-start gap-2">
              <Icon
                icon="material-symbols:info"
                width="16"
                height="16"
                style="color: #d97706"
                class="mt-0.5"
              />
              <div class="text-xs text-[#92400E]">
                <p class="font-medium mb-1">Mobile users:</p>
                <p>If recording doesn't work, check your browser settings:</p>
                <ul class="list-disc list-inside mt-1 space-y-1">
                  <li>Allow microphone access for this site</li>
                  <li>Make sure no other apps are using the microphone</li>
                  <li>
                    Try refreshing the page and allowing permissions again
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="space-y-4 w-full">
        <button
          @click="submitForm"
          :disabled="!selectedValue || props.isSubmitting"
          class="flex w-full items-center gap-2 justify-center rounded-full py-4 px-5 font-medium transition-all duration-200"
          :class="{
            'bg-primary text-white': selectedValue && !props.isSubmitting,
            'bg-gray-300 text-gray-500 cursor-not-allowed':
              !selectedValue || props.isSubmitting,
          }"
        >
          <Icon
            v-if="props.isSubmitting"
            icon="material-symbols:refresh"
            width="20"
            height="20"
            class="animate-spin"
            style="color: #fff"
          />
          <span v-if="props.isSubmitting">Submitting...</span>
          <span v-else>I appreciate your honesty</span>
        </button>
        <!-- <h4 class="font-medium text-[#374151] text-center">
          Actually. I'll Continue
        </h4> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref, onMounted, onUnmounted, watch } from "vue";
import { useUpload, useTranscript } from "../hooks/index";

const props = defineProps<{
  onToggle: (item: string) => void;
  isSubmitting?: boolean;
}>();

const emit = defineEmits<{
  select: [value: string];
  extra: [value: string];
  submit: [];
}>();

const selectedValue = ref<string>("");
const additionalThoughts = ref<string>("");

// Voice recording state
const isRecording = ref<boolean>(false);
const hasRecording = ref<boolean>(false);
const isPlaying = ref<boolean>(false);
const recordingTime = ref<number>(0);
const audioDuration = ref<number>(0);
const transcript = ref<string>("");
const mediaRecorder = ref<MediaRecorder | null>(null);
const audioChunks = ref<Blob[]>([]);
const audioBlob = ref<Blob | null>(null);
const audioUrl = ref<string>("");
const audioElement = ref<HTMLAudioElement | null>(null);
const recordingInterval = ref<NodeJS.Timeout | null>(null);
const waveformBars = ref<number[]>([]);

// Initialize waveform bars
const initializeWaveform = () => {
  waveformBars.value = Array.from({ length: 50 }, () => Math.random() * 20 + 4);
};

// Format time helper
const formatTime = (seconds: number): string => {
  // Handle invalid values
  if (!seconds || isNaN(seconds) || !isFinite(seconds) || seconds < 0) {
    return "00:00";
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};

// Check microphone permissions
const checkMicrophonePermission = async () => {
  try {
    if (navigator.permissions) {
      const permission = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });
      return permission.state;
    }
    return "unknown";
  } catch (error) {
    console.log("Permission API not supported");
    return "unknown";
  }
};

// Start recording
const startRecording = async () => {
  try {
    // Check if getUserMedia is supported
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("getUserMedia is not supported in this browser");
    }

    // Check permissions first
    const permissionState = await checkMicrophonePermission();
    console.log("Microphone permission state:", permissionState);

    // Request microphone access with better error handling
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
        sampleRate: 44100,
      },
    });

    // Check if we actually got audio tracks
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      throw new Error("No audio tracks available");
    }

    console.log("Audio tracks:", audioTracks.length);
    console.log("Audio track settings:", audioTracks[0]?.getSettings());

    mediaRecorder.value = new MediaRecorder(stream, {
      mimeType: "audio/webm;codecs=opus", // Better mobile support
    });
    audioChunks.value = [];

    mediaRecorder.value.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data);
      }
    };

    mediaRecorder.value.onstop = async () => {
      if (audioChunks.value.length > 0) {
        audioBlob.value = new Blob(audioChunks.value, { type: "audio/webm" });
        audioUrl.value = URL.createObjectURL(audioBlob.value);
        hasRecording.value = true;

        // Create audio element for playback
        audioElement.value = new Audio(audioUrl.value);

        // Handle audio loading and duration calculation
        audioElement.value.addEventListener("loadedmetadata", () => {
          if (
            audioElement.value &&
            !isNaN(audioElement.value.duration) &&
            isFinite(audioElement.value.duration)
          ) {
            audioDuration.value = Math.floor(audioElement.value.duration);
            console.log("Audio duration loaded:", audioDuration.value);
          } else {
            console.warn(
              "Invalid audio duration, using recording time instead"
            );
            audioDuration.value = recordingTime.value;
          }
        });

        audioElement.value.addEventListener("error", (e) => {
          console.error("Audio loading error:", e);
          audioDuration.value = recordingTime.value;
        });

        // Fallback: if metadata doesn't load within 3 seconds, use recording time
        setTimeout(() => {
          if (audioDuration.value === 0 && recordingTime.value > 0) {
            audioDuration.value = recordingTime.value;
            console.log(
              "Using recording time as fallback duration:",
              audioDuration.value
            );
          }
        }, 3000);

        // Generate transcript (simulated - in real app, use speech-to-text API)
        // After recording stops, upload the audio and request transcript
        await uploadRecordingAndTranscribe();
      }

      // Stop all tracks
      stream.getTracks().forEach((track) => track.stop());
    };

    mediaRecorder.value.onerror = (event) => {
      console.error("MediaRecorder error:", event);
      throw new Error("Recording failed");
    };

    mediaRecorder.value.start(1000); // Collect data every second
    isRecording.value = true;
    recordingTime.value = 0;

    // Start timer
    recordingInterval.value = setInterval(() => {
      recordingTime.value++;
    }, 1000);

    // Animate waveform during recording
    const waveformInterval = setInterval(() => {
      if (isRecording.value) {
        waveformBars.value = waveformBars.value.map(
          () => Math.random() * 20 + 4
        );
      } else {
        clearInterval(waveformInterval);
      }
    }, 150);
  } catch (error) {
    console.error("Error starting recording:", error);

    let errorMessage = "Could not access microphone. ";

    if (error instanceof Error) {
      if (error.name === "NotAllowedError") {
        errorMessage +=
          "Please allow microphone access in your browser settings and try again.";
      } else if (error.name === "NotFoundError") {
        errorMessage +=
          "No microphone found. Please connect a microphone and try again.";
      } else if (error.name === "NotSupportedError") {
        errorMessage +=
          "Microphone recording is not supported in this browser.";
      } else if (error.name === "NotReadableError") {
        errorMessage += "Microphone is being used by another application.";
      } else {
        errorMessage += `Error: ${error.message}`;
      }
    }

    // Show user-friendly error message
    alert(errorMessage);

    // Reset recording state
    isRecording.value = false;
    if (recordingInterval.value) {
      clearInterval(recordingInterval.value);
      recordingInterval.value = null;
    }
  }
};

// Stop recording
const stopRecording = () => {
  if (mediaRecorder.value && isRecording.value) {
    mediaRecorder.value.stop();
    isRecording.value = false;

    if (recordingInterval.value) {
      clearInterval(recordingInterval.value);
      recordingInterval.value = null;
    }
  }
};

// Toggle playback
const togglePlayback = () => {
  if (!audioElement.value) return;

  if (isPlaying.value) {
    audioElement.value.pause();
    isPlaying.value = false;
  } else {
    audioElement.value.play();
    isPlaying.value = true;

    audioElement.value.onended = () => {
      isPlaying.value = false;
    };
  }
};

// Delete recording
const deleteRecording = () => {
  hasRecording.value = false;
  isPlaying.value = false;
  transcript.value = "";
  audioDuration.value = 0;
  recordingTime.value = 0;

  if (audioElement.value) {
    audioElement.value.pause();
    audioElement.value = null;
  }

  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value);
    audioUrl.value = "";
  }

  audioBlob.value = null;
  audioChunks.value = [];
};

// Generate transcript (simulated) - kept for fallback or demo
const generateTranscript = () => {
  const sampleTranscripts = [
    "I think the most important thing is having someone who actually listens and understands what I'm going through. Too often, services feel like they're just going through the motions.",
    "What would really help is if there was a way to find services that are actually available and not just listed but don't exist anymore. I've wasted so much time calling numbers that don't work.",
    "I wish there was more support for people who are struggling but don't fit into neat categories. Sometimes you need help but don't know exactly what kind of help you need.",
    "The biggest barrier for me has been transportation. I can't afford to travel across town to access services, especially when I'm not even sure if they can help me.",
    "I think peer support would be really valuable. People who have been through similar experiences understand things that professionals sometimes miss.",
  ];

  // Simulate processing delay
  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * sampleTranscripts.length);
    transcript.value = sampleTranscripts[randomIndex] || "";
  }, 2000);
};

// Setup upload and transcript mutations
const uploadMutation = useUpload();
const transcriptMutation = useTranscript();

// Upload the recorded audio (FormData) then request transcript
const uploadRecordingAndTranscribe = async () => {
  try {
    if (!audioBlob.value) return;
console.log(audioBlob.value)
    const form = new FormData();
    // append the file - backend expects 'file' (or adjust if different)
    form.append("file", audioBlob.value, "recording.webm");
    form.append("upload_target", "AUDIO");

    // Call useUpload mutation
    const uploadResp = await uploadMutation.mutateAsync(form as any);

    // Try to extract audio url from response
    // Axios responses in hooks return the full response object; check common locations
    const data = uploadResp && uploadResp.data ? uploadResp.data : uploadResp;

    // Possible shapes: { data: { url: '...' } } or { url: '...' } or { data: [{ url: '...' }] }
    let audioUrlFromServer: string | undefined;

    if (typeof data === "string") {
      audioUrlFromServer = data;
    } else if (data && typeof data === "object") {
      if (data.url) audioUrlFromServer = data.url;
      else if (data.file_url) audioUrlFromServer = data.file_url;
      else if (data.data && data.data.url) audioUrlFromServer = data.data.url;
      else if (Array.isArray(data.data) && data.data[0] && data.data[0].url)
        audioUrlFromServer = data.data[0].url;
      else if (data[0] && data[0].url) audioUrlFromServer = data[0].url;
    }

    if (!audioUrlFromServer) {
      console.warn(
        "Could not find audio url in upload response, using local object URL"
      );
      audioUrlFromServer = audioUrl.value; // fallback to object URL
    }

    // Call transcript endpoint
    const transcriptResp = await transcriptMutation.mutateAsync({
      audio_url: audioUrlFromServer,
    });

    const tdata =
      transcriptResp && transcriptResp.data
        ? transcriptResp.data
        : transcriptResp;
    // Try to extract text from response
    if (tdata && typeof tdata === "object") {
      if (tdata.text) transcript.value = tdata.text;
      else if (tdata.transcript) transcript.value = tdata.transcript;
      else if (tdata.data && (tdata.data.text || tdata.data.transcript))
        transcript.value = tdata.data.text || tdata.data.transcript;
      else transcript.value = JSON.stringify(tdata);
    } else if (typeof tdata === "string") {
      transcript.value = tdata;
    }

    // Emit extra once we have transcript
    if (transcript.value && transcript.value.trim()) {
      additionalThoughts.value = transcript.value;
      emit("extra", additionalThoughts.value);
    }
  } catch (err) {
    console.error("Upload/Transcript error:", err);
    // keep the generated transcript as fallback
    if (!transcript.value) generateTranscript();
  }
};

// Apply transcript into the textarea / emit as extra
const applyTranscript = () => {
  additionalThoughts.value = transcript.value;
  // Emit the additional thoughts as extra personal information
  emit("extra", additionalThoughts.value);
};

// Test microphone access
const testMicrophoneAccess = async () => {
  try {
    console.log("Testing microphone access...");
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("Microphone access successful");
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch (error) {
    console.error("Microphone test failed:", error);
    return false;
  }
};

// Watch for changes in additional thoughts and emit them
watch(additionalThoughts, (newValue) => {
  if (newValue && newValue.trim()) {
    emit("extra", newValue.trim());
  }
});

// Component lifecycle
onMounted(async () => {
  initializeWaveform();

  // Test microphone access on component mount
  const hasAccess = await testMicrophoneAccess();
  console.log("Microphone access available:", hasAccess);
});

onUnmounted(() => {
  if (recordingInterval.value) {
    clearInterval(recordingInterval.value);
  }
  if (audioUrl.value) {
    URL.revokeObjectURL(audioUrl.value);
  }
});

const selectItem = (item: string) => {
  selectedValue.value = item;
  emit("select", item);
};

const submitForm = () => {
  // if (props.isSubmitting) return; // Prevent double submi

  // Emit any additional thoughts as extra personal information
  if (additionalThoughts.value.trim()) {
    emit("extra", additionalThoughts.value);
  }

  // Emit submit event
  emit("submit");
};

const permissions = [
  {
    title: "Greggs Vouchers",
    subtitle: "The familiar favourite ",
  },
  {
    title: "Phone Credit",
    subtitle: "Bus/train tickets for accessibility",
  },
  {
    title: "Transport Vouchers",
    subtitle: "Bus/train tickets for accessibility",
  },
  {
    title: "Shopping Vouchers",
    subtitle: "Tesco, ASDA, Sainsbury's",
  },
];
</script>

<style scoped>
input {
  outline: none;
  accent-color: #33339c;
}
</style>

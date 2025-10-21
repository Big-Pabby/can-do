<template>
  <div class="voice-recorder">
    <!-- Normal mic button -->
    <button
      v-if="!isRecording"
      @click="startRecording"
      :disabled="isUploading || isTranscribing"
      :class="[
        'action-btn mic-btn',
        { disabled: isUploading || isTranscribing },
      ]"
    >
      <Icon
        v-if="!isUploading && !isTranscribing"
        icon="ri:mic-line"
        class="w-5 h-5"
      />
      <Icon
        v-else-if="isUploading"
        icon="ri:upload-cloud-line"
        class="w-5 h-5"
      />
      <Icon
        v-else-if="isTranscribing"
        icon="ri:file-text-line"
        class="w-5 h-5"
      />
    </button>

    <!-- WhatsApp-style recording interface -->
    <Transition name="slide-left">
      <div v-if="isRecording" class="recording-container">
        <button @click="cancelRecording" class="cancel-btn">
          <Icon icon="ri:close-line" class="w-5 h-5" />
        </button>

        <div class="recording-info">
          <div class="waveform">
            <span class="wave-dot" v-for="i in 5" :key="i"></span>
          </div>
          <span class="duration">{{ formattedDuration }}</span>
          <p class="hint-text">{{ swipeHint }}</p>
        </div>

        <button
          @click="stopRecording"
          class="send-voice-btn"
        >
          <Icon icon="ic:round-send" class="w-6 h-6" />
        </button>
      </div>
    </Transition>

    <!-- Upload/Transcribe Status Toast -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="isUploading || isTranscribing" class="status-toast">
          <div class="flex items-center gap-2">
            <div class="spinner"></div>
            <span>{{
              isUploading ? "Uploading audio..." : "Transcribing..."
            }}</span>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Error Toast -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="error" class="error-toast">
          <Icon icon="ri:error-warning-line" class="w-5 h-5" />
          <span>{{ error }}</span>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue";
import { Icon } from "@iconify/vue";
import { useUpload, useTranscript } from "~/pages/hooks";

const emit = defineEmits<{
  (e: "audioReady", payload: { fileUrl: string; transcript?: string }): void;
  (e: "error", error: string): void;
}>();

const isRecording = ref(false);
const isUploading = ref(false);
const isTranscribing = ref(false);
const duration = ref(0);
const error = ref("");
const swipeHint = ref("Slide to cancel");

let mediaRecorder: MediaRecorder | null = null;
let audioChunks: Blob[] = [];
let durationInterval: ReturnType<typeof setInterval> | null = null;
let stream: MediaStream | null = null;
let touchStartTime = 0;

const { mutate: uploadFile } = useUpload();
const { mutate: transcribeAudio } = useTranscript();

const formattedDuration = computed(() => {
  const mins = Math.floor(duration.value / 60);
  const secs = duration.value % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
});

const startRecording = async () => {
  try {
    error.value = "";
    touchStartTime = Date.now();

    stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const recordingDuration = Date.now() - touchStartTime;

      // If recording is too short (less than 1 second), don't process
      if (recordingDuration < 1000) {
        cleanupRecording();
        error.value = "Recording too short";
        setTimeout(() => {
          error.value = "";
        }, 2000);
        return;
      }

      const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
      await uploadAudio(audioBlob);

      // Stop all tracks to release the microphone
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
      }
    };

    mediaRecorder.start();
    isRecording.value = true;
    duration.value = 0;

    // Start duration counter
    durationInterval = setInterval(() => {
      duration.value++;
    }, 1000);
  } catch (err: any) {
    error.value = "Microphone access denied. Please grant permission.";
    emit("error", error.value);
    console.error("Error accessing microphone:", err);

    setTimeout(() => {
      error.value = "";
    }, 3000);
  }
};

const stopRecording = () => {
  if (mediaRecorder && isRecording.value) {
    mediaRecorder.stop();
    isRecording.value = false;
    swipeHint.value = "Slide to cancel";

    if (durationInterval) {
      clearInterval(durationInterval);
      durationInterval = null;
    }
  }
};

const cancelRecording = () => {
  if (mediaRecorder && isRecording.value) {
    // Stop the recorder without processing
    mediaRecorder.ondataavailable = null;
    mediaRecorder.onstop = null;
    mediaRecorder.stop();

    cleanupRecording();
  }
};

const cleanupRecording = () => {
  isRecording.value = false;
  swipeHint.value = "Slide to cancel";
  audioChunks = [];

  if (durationInterval) {
    clearInterval(durationInterval);
    durationInterval = null;
  }

  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
};

const uploadAudio = async (audioBlob: Blob) => {
  try {
    isUploading.value = true;
    error.value = "";

    const formData = new FormData();
    formData.append("file", audioBlob, `recording-${Date.now()}.webm`);
    formData.append("upload_target", "AUDIO");

    uploadFile(formData, {
      onSuccess: async (response: any) => {
        const fileUrl = response.data.url;
        isUploading.value = false;

        try {
          isTranscribing.value = true;

          transcribeAudio(
            { audio_url: fileUrl },
            {
              onSuccess: (transcriptResponse: any) => {
                const transcript = transcriptResponse.data.text;
                isTranscribing.value = false;
                emit("audioReady", { fileUrl, transcript });
              },
              onError: (transcriptErr: any) => {
                console.warn(
                  "Transcription failed, sending without transcript:",
                  transcriptErr
                );
                isTranscribing.value = false;
                emit("audioReady", { fileUrl });
              },
            }
          );
        } catch (transcriptErr) {
          console.warn("Transcription error:", transcriptErr);
          isTranscribing.value = false;
          emit("audioReady", { fileUrl });
        }
      },
      onError: (err: any) => {
        error.value = "Failed to upload audio. Please try again.";
        emit("error", error.value);
        console.error("Error uploading audio:", err);
        isUploading.value = false;

        setTimeout(() => {
          error.value = "";
        }, 3000);
      },
    });
  } catch (err: any) {
    error.value = "Failed to process audio. Please try again.";
    emit("error", error.value);
    console.error("Error processing audio:", err);
    isUploading.value = false;
    isTranscribing.value = false;

    setTimeout(() => {
      error.value = "";
    }, 3000);
  }
};

onUnmounted(() => {
  cleanupRecording();
});
</script>

<style scoped>
.voice-recorder {
  position: relative;
}
.action-btn {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  color: white;
  flex-shrink: 0;
}
.mic-btn {
  background: #12a0d8;
}

.mic-btn:hover:not(:disabled) {
  background: #0e7490;
  transform: scale(1.05);
}

.action-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* WhatsApp-style recording container */
.recording-container {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  padding: 0.5rem;
  border-radius: 9999px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 250px;
}

.cancel-btn {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.cancel-btn:hover {
  background: #fecaca;
  transform: scale(1.05);
}

.recording-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  min-width: 0;
}

.waveform {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 20px;
}

.wave-dot {
  width: 3px;
  background: #ef4444;
  border-radius: 2px;
  animation: wave 1.2s ease-in-out infinite;
}

.wave-dot:nth-child(1) {
  animation-delay: 0s;
  height: 8px;
}

.wave-dot:nth-child(2) {
  animation-delay: 0.1s;
  height: 16px;
}

.wave-dot:nth-child(3) {
  animation-delay: 0.2s;
  height: 20px;
}

.wave-dot:nth-child(4) {
  animation-delay: 0.3s;
  height: 16px;
}

.wave-dot:nth-child(5) {
  animation-delay: 0.4s;
  height: 8px;
}

@keyframes wave {
  0%,
  100% {
    transform: scaleY(0.5);
  }
  50% {
    transform: scaleY(1);
  }
}

.duration {
  font-size: 0.875rem;
  font-weight: 600;
  color: #ef4444;
  font-family: monospace;
  white-space: nowrap;
}

.hint-text {
  font-size: 0.75rem;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
}

.send-voice-btn {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #12a0d8;
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.send-voice-btn:hover {
  background: #0e7490;
  transform: scale(1.05);
}

/* Status Toast */
.status-toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
  border-radius: 9999px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 9998;
  font-size: 0.875rem;
  color: #374151;
}

.spinner {
  width: 1rem;
  height: 1rem;
  border: 2px solid #e5e7eb;
  border-top-color: #12a0d8;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error Toast */
.error-toast {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: #fee2e2;
  border: 1px solid #fecaca;
  padding: 1rem 1.5rem;
  border-radius: 9999px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  z-index: 9998;
  font-size: 0.875rem;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Transitions */
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}

.slide-left-enter-from {
  transform: translateX(100%) translateY(-50%);
  opacity: 0;
}

.slide-left-leave-to {
  transform: translateX(100%) translateY(-50%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Mobile adjustments */
@media (max-width: 640px) {
  .recording-container {
    min-width: 200px;
    right: -6px;
  }

  .hint-text {
    display: none;
  }
}
</style>
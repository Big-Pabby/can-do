<template>
  <!-- <div class="md:hidden block"><mobile-nav /></div> -->

  <div class="chat-container">
    <!-- Header -->
    <div class="chat-header">
      <div class="flex items-center gap-3">
        <!-- Back button on mobile when chat is shown -->
        <button
          v-if="showChatOnMobile && chatHistory.length > 0"
          @click="goBackToHistory"
          class="back-btn lg:hidden"
        >
          <Icon icon="mdi:arrow-left" class="w-6 h-6" />
        </button>

        <img
          src="/images/mark.svg"
          alt="Ask Mark"
          class="w-10 h-10 md:w-12 md:h-12"
        />
        <div class="space-y-1">
          <h2 class="text-base md:text-lg text-[#12A0D8] font-medium">
            Ask Mark
          </h2>
          <p class="text-xs md:text-sm text-[#6B7280]">
            Here to help you find support
          </p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <button
          @click="startNewChat"
          class="new-chat-btn"
          title="Start new chat"
        >
          <Icon icon="mdi:plus" class="w-5 h-5" />
          <span class="inline">New</span>
        </button>
        <!-- <button
          @click="showHistory = !showHistory"
          class="history-btn lg:hidden"
        >
          <Icon icon="mdi:history" class="w-4 h-4 md:w-5 md:h-5" />
          <span class="hidden sm:inline">History</span>
        </button> -->
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Desktop Sidebar -->
      <div class="history-sidebar">
        <div class="sidebar-header">
          <div>
            <h3 class="sidebar-title">Chat History</h3>
            <p class="sidebar-subtitle">See your past conversations</p>
          </div>
        </div>

        <div class="sidebar-content bg-white">
          <div v-if="chatHistory.length === 0" class="empty-state">
            <Icon
              icon="mdi:message-text-outline"
              class="w-12 h-12 text-gray-300 mb-2"
            />
            <p class="text-sm text-gray-500">No history yet</p>
          </div>
          <div
            v-for="(session, index) in chatHistory"
            :key="index"
            class="sidebar-item"
            :class="{ active: currentSessionId === session.id }"
          >
            <div @click="loadChatSession(session)" class="sidebar-item-content">
              <p class="sidebar-item-preview">{{ session.preview }}</p>
              <span class="sidebar-item-count"
                >{{ session.messages.length }} messages</span
              >
            </div>
            <button
              @click.stop="deleteSession(session.id)"
              class="delete-btn"
              title="Delete this conversation"
            >
              <Icon icon="mdi:delete-outline" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="sidebar-footer">
          <button @click="clearHistory" class="clear-btn">
            <Icon icon="mdi:delete-outline" class="w-5 h-5" />
            Clear All
          </button>
        </div>
      </div>

      <!-- Mobile History View -->
      <div v-if="!showChatOnMobile" class="mobile-history lg:hidden">
        <div class="mobile-history-header">
          <div>
            <h3 class="mobile-history-title">Chat History</h3>
            <p class="mobile-history-subtitle">
              Your past conversations with Mark
            </p>
          </div>
        </div>

        <div class="mobile-history-content">
          <div v-if="chatHistory.length === 0" class="empty-state">
            <Icon
              icon="mdi:message-text-outline"
              class="w-16 h-16 text-gray-300 mb-2"
            />
            <p class="text-gray-500">No chat history yet</p>
            <button @click="startNewChat" class="start-chat-btn">
              <Icon icon="mdi:plus-circle" class="w-5 h-5" />
              Start New Chat
            </button>
          </div>
          <div
            v-for="(session, index) in chatHistory"
            :key="index"
            class="mobile-history-item"
          >
            <div
              @click="loadChatSession(session)"
              class="mobile-history-item-content"
            >
              <p class="mobile-history-item-preview">{{ session.preview }}</p>
              <span class="mobile-history-item-count"
                >{{ session.messages.length }} messages</span
              >
            </div>
            <button
              @click.stop="deleteSession(session.id)"
              class="delete-btn-mobile"
              title="Delete this conversation"
            >
              <Icon icon="mdi:delete-outline" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div v-if="chatHistory.length > 0" class="mobile-history-footer">
          <button @click="clearHistory" class="clear-btn">
            <Icon icon="mdi:delete-outline" class="w-5 h-5" />
            Clear All History
          </button>
        </div>
      </div>

      <!-- Chat Area -->
      <div
        :class="`flex-col relative flex-1 overflow-hidden ${
          showChatOnMobile ? 'flex' : 'md:flex  hidden'
        }`"
      >
        <!-- Messages Container -->
        <div ref="messagesContainer" class="messages-container">
          <!-- Welcome Message -->
          <div v-if="messages.length === 0" class="welcome-message">
            <!-- <div class="message-wrapper" :class="'message-bot'">
              <div class="message-content">
                <img src="/images/mark.svg" alt="Mark" class="avatar" />
                <div :class="['message-bubble', 'bubble-mark']">
                  <p class="message-text">
                    Welcome! I'm Mark, I'm here to help you find the right
                    support around Suffolk. What's going on for you today?
                  </p>
                 
                </div>
              </div>

            
            </div>
            <div class="flex flex-wrap gap-4">
              <div
                v-for="value in othermessages"
                :key="value"
                class="border border-[#B0B72E] text-sm bg-[#FAFAED] text-[#B0B72E] p-2 rounded-full cursor-pointer"
                @click="
                  input = value;
                  sendMessage();
                "
              >
                {{ value }}
              </div>
            </div> -->
            <img src="/images/mark.svg" alt="Mark" class="w-16 h-16 mb-4" />
            <h3 class="text-lg font-semibold text-gray-800 mb-2">
              Welcome! I'm Mark
            </h3>
            <p class="text-sm text-gray-600 text-center max-w-md">
              I'm here to help you find the right support around Suffolk. What's
              going on for you today?
            </p>
            <div
              class="space-y-2 flex-col items-center text-center justify-center mt-6"
            >
              <p class="text-sm text-[#111827]">
                Tap a category below to get instant support.
              </p>
              <div class="flex flex-wrap items-center justify-center gap-4">
                <div
                  v-for="(value, index) in categories"
                  :key="index"
                  :class="`border ${value.color} ${value.borderColor}  text-sm px-3 py-1.5 rounded-full cursor-pointer`"
                  @click="
                    input = value.message;
                    sendMessage();
                  "
                >
                  {{ value.name }}
                </div>
              </div>
            </div>
          </div>

          <!-- Messages -->
          <div
            v-for="(msg, i) in messages"
            :key="i"
            class="message-wrapper"
            :class="msg.sender === 'user' ? 'message-user' : 'message-bot'"
          >
            <div class="message-content">
              <img
                v-if="msg.sender === 'mark'"
                src="/images/mark.svg"
                alt="Mark"
                class="avatar"
              />
              <div
                :class="[
                  'message-bubble',
                  msg.sender === 'mark' ? 'bubble-mark' : 'bubble-user',
                ]"
              >
                <p class="message-text">{{ msg.text }}</p>
                <span class="message-time">{{
                  formatTime(msg.timestamp)
                }}</span>
              </div>
            </div>

            <!-- Services for this message -->
            <div
              v-if="msg.services && msg.services.length > 0"
              class="services-section"
            >
              <h4 class="services-title">Recommended Services</h4>
              <div class="services-grid">
                <div
                  v-for="service in msg.services.slice(0, 3)"
                  :key="service.id"
                >
                  <ServiceCard
                    :service="service"
                    @directions="handleDirections"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Typing Indicator -->
          <div v-if="isPending" class="message-wrapper message-bot">
            <div class="message-content">
              <img src="/images/mark.svg" alt="Mark" class="avatar" />
              <div class="message-bubble bubble-mark typing-indicator">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Input Area -->
        <div class="input-container">
          <div class="input-wrapper relative">
            <input
              v-model="input"
              type="text"
              placeholder="Type your question..."
              class="chat-input !pr-12"
              @keyup.enter="sendMessage"
              :disabled="isPending"
            />
            <button
              v-if="input !== ''"
              class="absolute right-[6px] top-[6px] action-btn send-btn"
              @click="sendMessage"
              :disabled="!input.trim() || isPending"
            >
              <Icon icon="ic:round-send" class="w-5 h-5" />
            </button>
            <div v-else class="absolute right-[6px] top-[6px]">
              <VoiceRecorder
                @audioReady="handleAudioReady"
                @error="handleRecordingError"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, nextTick, onBeforeUnmount } from "vue";
import { Icon } from "@iconify/vue";
import { useLocationStore } from "~/store/location";
import { UseChatBot } from "./hooks";
import type { Service } from "#imports";
import { useUpload } from "../hooks";

definePageMeta({
  layout: "user",
});

interface Message {
  sender: "user" | "mark";
  text: string;
  timestamp: number;
  services?: Service[];
}

interface ChatSession {
  id: string;
  timestamp: number;
  preview: string;
  messages: Message[];
}

// State
const messages = ref<Message[]>([]);
const input = ref("");
const isPending = ref(false);
const showHistory = ref(false);
const messagesContainer = ref<HTMLElement | null>(null);
const chatHistory = ref<ChatSession[]>([]);
const currentSessionId = ref<string>("");
const showChatOnMobile = ref(false); // Controls mobile view state
const abortController = ref<AbortController | null>(null);
const categories = [
  {
    name: "Employment",
    color: "bg-[#FAFAED] text-[#B0B72E]",
    borderColor: "border-yellow-[#B0B72E]",
    message: "I need employment support services",
  },
  {
    name: "Housing",
    color: "bg-[#EAF8FE] text-[#12A0D8]",
    borderColor: "border-[#12A0D8]",
    message: "I need housing support services",
  },
  {
    name: "Food & Basic Needs",
    color: "bg-[#FFEDF0] text-[#FE4D67]",
    borderColor: "border-[#FE4D67]",
    message: "I need food & basic needs support services",
  },
  {
    name: "Mental Health",
    color: "bg-[#F0FDF4] text-[#16A34A]",
    borderColor: "border-[#16A34A]",
    message: "I need mental health support services",
  },
  {
    name: "Clothes & Essentials",
    color: "bg-[#FFFBEB] text-[#F59E0B]",
    borderColor: "border-[#F59E0B]",
    message: "I need clothes & essentials support services",
  },
  {
    name: "Financial Support",
    color: "bg-[#EEF2FF] text-[#6366F1]",
    borderColor: "border-[#6366F1]",
    message: "I need financial support services",
  },
  {
    name: "Healthcare Help",
    color: "bg-[#F7FEE7] text-[#84CC16]",
    borderColor: "border-[#84CC16]",
    message: "I need healthcare help support services",
  },
  {
    name: "Addiction & Recovery",
    color: "bg-[#FAF5FF] text-[#A855F7]",
    borderColor: "border-[#A855F7]",
    message: "I need addiction & recovery support services",
  },
  {
    name: "Legal assistance",
    color: "bg-[#F0FDFA] text-[#14B8A6]",
    borderColor: "border-[#14B8A6]",
    message: "I need legal assistance support services",
  },
];

// Chat composable
const { mutate } = UseChatBot();

// Load cached data on mount
onMounted(() => {
  loadChatHistory();
  generateSessionId();
  window.addEventListener("beforeunload", saveCurrentChatToHistory);
  // On mobile, show chat if no history exists
  if (chatHistory.value.length === 0) {
    showChatOnMobile.value = true;
  } else {
    loadChatSession(chatHistory.value[0] as ChatSession);
  }
});

onBeforeUnmount(() => {
  // Cancel any pending request before component unmounts
  if (abortController.value) {
    abortController.value.abort();
  }
  saveCurrentChatToHistory();
  window.removeEventListener("beforeunload", saveCurrentChatToHistory);
});

// Auto-scroll to bottom when new messages arrive
watch(
  () => messages.value.length,
  () => {
    nextTick(() => {
      scrollToBottom();
    });
  }
);

function handleDirections(service: any) {
  const destLat = Number(service.details.lat);
  const destLng = Number(service.details.lng);
  if (!destLat || !destLng) {
    alert("Service location not available");
    return;
  }
  useLocationStore().setSelectedServiceLocation(
    { lat: destLat, lng: destLng },
    service
  );
  navigateTo("/explore");
}

const generateSessionId = () => {
  currentSessionId.value = `session_${Date.now()}`;
};

const loadChatHistory = () => {
  try {
    const cachedHistory = localStorage.getItem("chatHistory");
    if (cachedHistory) {
      chatHistory.value = JSON.parse(cachedHistory);
    }
    messages.value = [];

    // Set mobile view based on history
    showChatOnMobile.value = chatHistory.value.length === 0;
  } catch (error) {
    console.error("Error loading chat history:", error);
    showChatOnMobile.value = true;
  }
};

const saveCurrentChatToHistory = () => {
  try {
    if (messages.value.length === 0) return;

    const sessionData: ChatSession = {
      id: currentSessionId.value,
      timestamp: Date.now(),
      preview:
        messages.value[0]?.text.substring(0, 50) + "..." || "New conversation",
      messages: messages.value,
    };

    const cachedHistory = localStorage.getItem("chatHistory");
    let history: ChatSession[] = cachedHistory ? JSON.parse(cachedHistory) : [];

    const existingIndex = history.findIndex(
      (s) => s.id === currentSessionId.value
    );

    if (existingIndex >= 0) {
      history[existingIndex] = sessionData;
    } else {
      history.unshift(sessionData);
    }

    if (history.length > 20) {
      history = history.slice(0, 20);
    }

    localStorage.setItem("chatHistory", JSON.stringify(history));
    console.log("Chat saved to history");
  } catch (error) {
    console.error("Error saving chat to history:", error);
  }
};

const loadChatSession = (session: ChatSession) => {
  messages.value = [...session.messages];
  currentSessionId.value = session.id;
  showHistory.value = false;
  showChatOnMobile.value = true; // Show chat on mobile when session is loaded
  nextTick(() => {
    scrollToBottom();
  });
};

const clearHistory = () => {
  if (confirm("Are you sure you want to clear all chat history?")) {
    chatHistory.value = [];
    localStorage.removeItem("chatHistory");
    showHistory.value = false;
    messages.value = [];
    console.log("Chat history cleared");
  }
};

const deleteSession = (sessionId: string) => {
  if (confirm("Are you sure you want to delete this conversation?")) {
    // Remove session from history
    chatHistory.value = chatHistory.value.filter((s) => s.id !== sessionId);

    // Update localStorage
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory.value));

    // If deleted session is currently active, reset to empty chat
    if (currentSessionId.value === sessionId) {
      messages.value = [];
      generateSessionId();
    }

    // If no history left on mobile, show chat
    if (chatHistory.value.length === 0) {
      showChatOnMobile.value = true;
    }

    console.log("Session deleted");
  }
};

// Go back to history on mobile
const goBackToHistory = () => {
  showChatOnMobile.value = false;
};

const startNewChat = () => {
  // Cancel any pending request
  if (abortController.value) {
    abortController.value.abort();
    abortController.value = null;
    isPending.value = false;
  }

  if (messages.value.length > 0) {
    saveCurrentChatToHistory();
  }
  messages.value = [];
  generateSessionId();
  showHistory.value = false;
  showChatOnMobile.value = true; // Show chat on mobile when starting new chat
};

const sendMessage = () => {
  if (!input.value.trim() || isPending.value) return;

  const userMessage: Message = {
    sender: "user",
    text: input.value,
    timestamp: Date.now(),
  };

  messages.value.push(userMessage);
  const userInput = input.value;
  input.value = "";
  isPending.value = true;

  // Create new abort controller for this request
  abortController.value = new AbortController();

  const locationStore = useLocationStore();
  const location = {
    place: locationStore.district || locationStore.address || "Suffolk, UK",
    lat: locationStore.lat,
    lng: locationStore.lng,
  };
  const allTexts = messages.value.map((msg) => msg.text);
  const combinedText = allTexts.join(",");

  mutate(
    {
      ...location,
      message: `${userInput}`,
      signal: abortController.value?.signal,
    },
    {
      onSuccess: async ({ data }) => {
        const botMessage: Message = {
          sender: "mark",
          text: data.answer,
          timestamp: Date.now(),
          services: data.services || [],
        };
        messages.value.push(botMessage);
        isPending.value = false;
        abortController.value = null;
      },
      onError: (error: any) => {
        // Don't show error message if request was aborted
        if (
          error.name === "AbortError" ||
          error.message === "canceled" ||
          error.code === "ERR_CANCELED"
        ) {
          isPending.value = false;
          abortController.value = null;
          return;
        }

        const errorMessage: Message = {
          sender: "mark",
          text: "Sorry, I couldn't process your request. Please try again.",
          timestamp: Date.now(),
        };
        messages.value.push(errorMessage);
        isPending.value = false;
        abortController.value = null;
      },
    }
  );
};

const handleAudioReady = (payload: {
  fileUrl: string;
  transcript?: string;
}) => {
  const { fileUrl, transcript } = payload;

  // If we have a transcript, use it as the message
  if (transcript && transcript.trim()) {
    input.value = transcript;
    sendMessage();
  } else {
    // If no transcript, you can still send the audio URL or show an error
    console.warn("No transcript available for audio file:", fileUrl);
    // Optionally, you could send the fileUrl to your backend if it accepts audio URLs
  }
};

const handleRecordingError = (errorMessage: string) => {
  console.error("Recording error:", errorMessage);
  // Optionally show a toast notification to the user
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 10vh);
  background: white;
  overflow: hidden;
  border-radius: 12px;
  position: relative;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: white;
  flex-shrink: 0;
  height: 15%;
  z-index: 10;
}

.history-btn,
.new-chat-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid;
}

.history-btn {
  color: #b0b72e;
  background: #fafaed;
  border-color: #b0b72e;
}

.history-btn:hover {
  background: #f5f5e1;
}

.new-chat-btn {
  color: white;
  background: #12a0d8;
  border-color: #12a0d8;
}

.new-chat-btn:hover {
  background: #0e7490;
}

.back-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0.5rem;
}

.back-btn:hover {
  background: #f3f4f6;
}

/* Main Content Layout */
.main-content {
  display: flex;
  flex: 1;
  height: 85%;
  overflow: hidden;
}

/* Desktop Sidebar */
.history-sidebar {
  display: none;
}

@media (min-width: 1024px) {
  .history-sidebar {
    display: flex;
    flex-direction: column;
    width: 320px;
    border-right: 1px solid #e5e7eb;
    background: #f9fafb;
  }
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: white;
}

.sidebar-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.sidebar-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.sidebar-item {
  padding: 0.875rem 1rem;
  margin-bottom: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.sidebar-item:hover,
.sidebar-item.active {
  background: #eff6ff;
  border-color: #12a0d8;
}

.sidebar-item-content {
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.sidebar-item-preview {
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.sidebar-item-count {
  font-size: 0.75rem;
  color: #9ca3af;
}

.delete-btn {
  flex-shrink: 0;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.375rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn:hover {
  background: #fee2e2;
  color: #dc2626;
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background: white;
}

/* Chat Area */

/* Hide chat on mobile when history view is shown */
@media (max-width: 1023px) {
  .chat-area {
    display: none;
  }
}
.chat-area.show-mobile {
  display: flex;
}

/* Mobile History View */
.mobile-history {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  padding-bottom: 2rem;
}

@media (min-width: 1024px) {
  .mobile-history {
    display: none;
  }
}

.mobile-history-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  background: white;
}

.mobile-history-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.mobile-history-subtitle {
  font-size: 0.875rem;
  color: #6b7280;
}

.mobile-history-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.mobile-history-item {
  padding: 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  transition: all 0.2s;
}

.mobile-history-item:hover {
  border-color: #12a0d8;
  box-shadow: 0 2px 8px rgba(18, 160, 216, 0.1);
}

.mobile-history-item-content {
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.mobile-history-item-preview {
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-weight: 500;
}

.mobile-history-item-count {
  font-size: 0.75rem;
  color: #9ca3af;
}

.mobile-history-footer {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background: white;
}

.start-chat-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
  padding: 0.875rem 1.5rem;
  background: #12a0d8;
  color: white;
  border: none;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.start-chat-btn:hover {
  background: #0e7490;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(18, 160, 216, 0.3);
}

/* Chat Area */
.chat-area {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
  position: relative;
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  height: calc(100% - 86px); /* Account for input container */
  padding: 1.5rem;
  padding-bottom: 1rem;
  scroll-behavior: smooth;
}

@media (max-width: 767px) {
  .messages-container {
    padding-bottom: 8rem;
  }
}

.welcome-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: left;
  /* padding: 3rem 1rem;
  margin-top: 2rem; */
}

.message-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  animation: fadeIn 0.3s ease-in;
}

.message-user {
  align-items: flex-end;
}

.message-bot {
  align-items: flex-start;
}

.message-content {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  max-width: 90%;
}

@media (min-width: 768px) {
  .message-content {
    max-width: 75%;
  }
}

.message-user .message-content {
  flex-direction: row-reverse;
}

.avatar {
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
  border-radius: 50%;
}

@media (min-width: 768px) {
  .avatar {
    width: 2.5rem;
    height: 2.5rem;
  }
}

.message-bubble {
  padding: 0.875rem 1rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  word-wrap: break-word;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.bubble-mark {
  background: #eaf8fe;
  border: 1px solid #aae3fa;
  color: #374151;
}

.bubble-user {
  background: #12a0d8;
  border: 1px solid #12a0d8;
  color: white;
}

.message-text {
  margin: 0;
  word-break: break-word;
}

.message-time {
  font-size: 0.625rem;
  opacity: 0.6;
  align-self: flex-end;
}

.typing-indicator {
  flex-direction: row !important;
  gap: 0.375rem;
  padding: 1rem;
}

.dot {
  width: 0.5rem;
  height: 0.5rem;
  background: #d1d5db;
  border-radius: 50%;
  animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}

.dot:nth-child(2) {
  animation-delay: -0.16s;
}

.services-section {
  width: 100%;
  padding-left: 0;
  margin-top: 0.5rem;
}

@media (min-width: 768px) {
  .services-section {
    padding-left: 3rem;
  }
}

.services-title {
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
}

.services-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1280px) {
  .services-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.input-container {
  position: sticky;
  bottom: 0;
  background: white;
  border-top: 1px solid #e5e7eb;
  padding: 1rem 1.5rem;
  z-index: 20;
}

@media (max-width: 767px) {
  .input-container {
    position: fixed;
    bottom: 10vh;
    left: 0;
    right: 0;
  }
}

.input-wrapper {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.chat-input {
  flex: 1;
  padding: 0.875rem 1rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 9999px;
  font-size: 0.875rem;
  outline: none;
  transition: all 0.2s;
}

.chat-input:focus {
  border-color: #12a0d8;
  box-shadow: 0 0 0 3px rgba(18, 160, 216, 0.1);
}

.chat-input:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  gap: 0.5rem;
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

.send-btn {
  background: #12a0d8;
}

.send-btn:hover:not(:disabled) {
  background: #0e7490;
  transform: scale(1.05);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mic-btn {
  background: #12a0d8;
}

.mic-btn:hover:not(:disabled) {
  background: #0e7490;
  transform: scale(1.05);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  text-align: center;
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem;
  background: #fee2e2;
  color: #dc2626;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.clear-btn:hover {
  background: #fecaca;
}

/* Mobile History Modal */
.history-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.history-modal {
  background: white;
  border-radius: 1.5rem;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  gap: 1rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  flex-shrink: 0;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
}

.modal-item {
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  margin-bottom: 0.75rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}

.modal-item:hover {
  background: #f9fafb;
  border-color: #12a0d8;
}

.modal-item-content {
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.modal-item-preview {
  font-size: 0.875rem;
  color: #374151;
  margin-bottom: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.modal-item-count {
  font-size: 0.75rem;
  color: #9ca3af;
}

.delete-btn-mobile {
  flex-shrink: 0;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn-mobile:hover {
  background: #fee2e2;
  color: #dc2626;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>

// composables/useProgressWebSocket.ts
import { ref, onUnmounted } from "vue";
import { useAuthStore } from "~/store/auth";

export interface ProgressUpdate {
  jobId: string;
  progress: number;
  current_process: "Pending" | "Processing" | "Completed" | "Failed";
  message?: string;
}

export const useProgressWebSocket = () => {
  const ws = ref<WebSocket | null>(null);
  const progress = ref(0);
  const status = ref<"idle" | "connecting" | "connected" | "error">("idle");
  const currentJobId = ref<string | null>(null);
  const message = ref<string>("");

  const connect = (jobId: string, wsUrl?: string) => {
    // Close existing connection if any
    disconnect();

    currentJobId.value = jobId;
    status.value = "connecting";

    // Default WebSocket URL - adjust based on your backend
    const socketUrl =
      wsUrl ||
      `wss://app.candopeople.uk/v1/services/data_collection_status/${jobId}`;

    try {
      ws.value = new WebSocket(socketUrl);

      ws.value.onopen = () => {
        status.value = "connected";
        console.log("WebSocket connected for job:", jobId);
      };

      ws.value.onmessage = (event) => {
        try {
          const data: ProgressUpdate = JSON.parse(event.data);
          console.log("Progress update:", data);
           progress.value = data.progress;
            message.value = data.current_process || "";

            console.log("Progress update:", data);

            // Auto-close on completion or failure
            if (data.current_process === "Completed" || data.current_process === "Failed") {
              setTimeout(() => {
                disconnect();
                useAuthStore().setJobId(null);
              }, 1000);
            }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      ws.value.onerror = (error) => {
        status.value = "error";
        console.error("WebSocket error:", error);
      };

      ws.value.onclose = () => {
        status.value = "idle";
        console.log("WebSocket closed");
      };
    } catch (error) {
      status.value = "error";
      console.error("Failed to create WebSocket:", error);
    }
  };

  const disconnect = () => {
    if (ws.value) {
      ws.value.close();
      ws.value = null;
    }
    status.value = "idle";
  };

  const reset = () => {
    disconnect();
    progress.value = 0;
    currentJobId.value = null;
    message.value = "";
  };

  // Cleanup on component unmount
  onUnmounted(() => {
    disconnect();
  });

  return {
    connect,
    disconnect,
    reset,
    progress,
    status,
    message,
    currentJobId,
    isConnected: computed(() => status.value === "connected"),
  };
};

// Alternative: Polling-based approach if WebSocket is not available
// export const useProgressPolling = () => {
//   const progress = ref(0)
//   const status = ref<'idle' | 'polling' | 'error'>('idle')
//   const message = ref<string>('')
//   const intervalId = ref<NodeJS.Timeout | null>(null)

//   const startPolling = async (jobId: string, pollInterval = 2000) => {
//     stopPolling()
//     status.value = 'polling'

//     const poll = async () => {
//       try {
//         // Replace with your actual API endpoint
//         const response = await $fetch(`/api/progress/${jobId}`)

//         progress.value = response.progress
//         message.value = response.message || ''

//         if (response.status === 'completed' || response.status === 'failed') {
//           stopPolling()
//         }
//       } catch (error) {
//         console.error('Polling error:', error)
//         status.value = 'error'
//       }
//     }

//     // Initial poll
//     await poll()

//     // Set up interval
//     intervalId.value = setInterval(poll, pollInterval)
//   }

//   const stopPolling = () => {
//     if (intervalId.value) {
//       clearInterval(intervalId.value)
//       intervalId.value = null
//     }
//     status.value = 'idle'
//   }

//   const reset = () => {
//     stopPolling()
//     progress.value = 0
//     message.value = ''
//   }

//   onUnmounted(() => {
//     stopPolling()
//   })

//   return {
//     startPolling,
//     stopPolling,
//     reset,
//     progress,
//     status,
//     message
//   }
// }

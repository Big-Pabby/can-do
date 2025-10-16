// composables/useProgressWebSocket.ts
import { ref, onUnmounted, computed } from "vue";
import { useAuthStore } from "~/store/auth";
import { toast } from "vue-sonner";

export interface ProgressUpdate {
  progress: number;
  success_count: number;
  failure_count: number;
  status: "Pending" | "Processing" | "Completed" | "Failed";
  message?: string;
}

export const useProgressWebSocket = () => {
  const ws = ref<WebSocket | null>(null);
  const progress = ref(0);
  const status = ref<"idle" | "connecting" | "connected" | "error">("idle");
  const currentJobId = ref<string | null>(null);
  const message = ref<string>("");
  const successCount = ref(0);
  const failureCount = ref(0);

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
          message.value = data.message || data.status || "";
          successCount.value = data.success_count || 0;
          failureCount.value = data.failure_count || 0;

          // Handle completion
          if (data.status === "Completed") {
            setTimeout(() => {
              const totalProcessed = successCount.value + failureCount.value;
              
              toast.success("Data Collection Complete!", {
                description: `Successfully collected: ${successCount.value} | Failed: ${failureCount.value} | Total: ${totalProcessed}`,
                style: {
                  background: "#F0FDF4",
                  border: "1px solid #BBF7D0",
                  color: "#16A34A",
                },
                duration: 5000,
              });
              
              disconnect();
              useAuthStore().setJobId(null);
              reset();
            }, 1000);
          }

          // Handle failure
          if (data.status === "Failed") {
            setTimeout(() => {
              toast.error("Data Collection Failed!", {
                description: data.message || "An error occurred during data collection. Please try again.",
                style: {
                  background: "#FEF2F2",
                  border: "1px solid #FECACA",
                  color: "#DC2626",
                },
                duration: 5000,
              });
              
              disconnect();
              useAuthStore().setJobId(null);
              reset();
            }, 1000);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
          toast.error("Connection Error", {
            description: "Failed to parse progress update",
            style: {
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#DC2626",
            },
          });
        }
      };

      ws.value.onerror = (error) => {
        status.value = "error";
        console.error("WebSocket error:", error);
        toast.error("Connection Error", {
          description: "Lost connection to the server. Progress tracking may be unavailable.",
          style: {
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            color: "#DC2626",
          },
        });
      };

      ws.value.onclose = () => {
        status.value = "idle";
        console.log("WebSocket closed");
      };
    } catch (error) {
      status.value = "error";
      console.error("Failed to create WebSocket:", error);
      toast.error("Connection Failed", {
        description: "Could not establish WebSocket connection",
        style: {
          background: "#FEF2F2",
          border: "1px solid #FECACA",
          color: "#DC2626",
        },
      });
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
    successCount.value = 0;
    failureCount.value = 0;
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
    successCount,
    failureCount,
    currentJobId,
    isConnected: computed(() => status.value === "connected"),
  };
};
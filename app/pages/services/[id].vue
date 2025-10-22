<template>
  <div class="space-y-4">
    <RerunNotification
      v-if="progressState.show"
      :progress="progressState.progress"
      :status="progressState.status"
      :title="progressState.title"
      :message="progressState.message"
      :cancelable="progressState.status === 'loading'"
      @cancel="handleProgressCancel"
      @close="handleProgressClose"
    />
    <nuxt-link
      to="/services"
      class="flex gap-3 items-center font-medium text-[#374151]"
      ><Icon icon="ion:arrow-back-outline" width="20" height="20" /> Go
      back</nuxt-link
    >
    <div
      v-if="showEdit"
      class="fixed inset-0 z-50 flex h-screen items-center justify-center bg-black/40"
    >
      <div
        class="bg-white rounded-xl h-[95vh] overflow-y-auto shadow-lg p-6 w-full max-w-[600px] relative"
      >
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-2xl font-bold">Edit Service Information</h2>
          <button
            @click="showEdit = false"
            class="w-[32px] h-[32px] rounded-full border border-[#EFF1C8] bg-[#FAFAED] text-[#B0B72E] flex items-center justify-center text-lg"
          >
            &times;
          </button>
        </div>

        <form @submit.prevent="submitEdit" class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Service Name</label>
            <input
              v-model="editForm.name"
              type="text"
              class="w-full border rounded-[10px] px-3 py-3.5"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-1">Categories</label>
            <select
              v-model="editForm.category"
              class="w-full border rounded-[10px] px-3 py-3.5"
            >
              <option
                v-for="(value, index) in CORE_SERVICE_CATEGORIES"
                :key="index"
                :value="index"
              >
                {{ index }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium mb-1">Address</label>
            <input
              v-model="editForm.address"
              type="text"
              class="w-full border rounded-[10px] px-3 py-3.5"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Contact</label>
            <input
              v-model="editForm.phone_number"
              type="text"
              class="w-full border rounded-[10px] px-3 py-3.5"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Hours</label>
            <input
              v-model="editForm.opening_hours"
              type="text"
              class="w-full border rounded-[10px] px-3 py-3.5"
            />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Description</label>
            <textarea
              v-model="editForm.description"
              class="w-full border h-[200px] rounded-[10px] px-3 py-3.5"
            ></textarea>
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Eligibility</label>
            <textarea
              v-model="editForm.eligibility_criteria"
              class="w-full border h-[200px] rounded-[10px] px-3 py-3.5"
            ></textarea>
          </div>
          <div class="flex items-center gap-2 mt-4">
            <button
              type="submit"
              :disabled="isPending"
              class="bg-[#12A0D8] text-white w-full p-4 rounded-full font-semibold hover:bg-[#12A0D8]/90 flex items-center gap-2 justify-center disabled:opacity-50"
            >
              <Icon
                v-if="isPending"
                icon="tabler:loader"
                width="20"
                height="20"
                class="animate animate-spin"
                style="color: #fff"
              />
              <span v-if="isPending">Saving...</span>
              <span v-else>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    <div class="border border-[#F3F4F6] rounded-[16px] bg-white p-4 space-y-6">
      <div
        class="flex border border-[#F3F4F6] rounded-[12px] p-4 justify-between md:flex-row flex-col gap-4 md:items-center"
      >
        <div class="space-y-3">
          <h1
            class="md:text-2xl text-xl font-bold md:text-gray-900 text-white mb-2"
          >
            {{ service?.details.name }}
          </h1>
          <div class="flex items-center flex-wrap gap-2 text-sm">
            <div
              class="flex bg-[#FFFBEB] border py-[6px] rounded-full px-[8px] border-[#FDE68A] items-center gap-2"
            >
              <div class="flex">
                <template v-for="i in 5" :key="i">
                  <svg
                    class="w-4 h-4 transition-colors duration-150"
                    :class="getStarFill(service?.details.rating, i)"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                    />
                  </svg>
                </template>
              </div>
              <div class="flex items-center gap-1 text-sm">
                <span class="text-[#D97706] font-medium">
                  ({{ service?.details.rating }})
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex gap-4 items-center">
          <div>
            <InfoDialog :serviceId="service?.id" />
          </div>

          <button
            @click="showEdit = true"
            class="flex gap-2 bg-[#B0B72E] rounded-full px-5 py-2.5 text-white"
          >
            <Icon
              icon="tabler:edit"
              width="20"
              height="20"
              style="color: #fff"
            />
            Edit
          </button>
          <button
            :disabled="rerunPending"
            @click="handleRerun"
            class="flex gap-2 bg-[#12A0D8] rounded-full px-5 py-2.5 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon
              v-if="rerunPending"
              icon="tabler:loader"
              width="20"
              height="20"
              class="animate animate-spin"
              style="color: #fff"
            />
            <span v-if="rerunPending">Re-running...</span>
            <span v-else>Re-run</span>
          </button>
        </div>
      </div>
      <div class="border-b border-[#E5E7EB] flex gap-6">
        <div
        @click="toggleType = 'Info'"
           :class="` ${toggleType === 'Info' ? 'text-[#12A0D8] border-[#12A0D8] border-b-[3px]' : 'text-[#6B7280]'} font-medium hover:border-b-[3px] hover:text-[#12A0D8] hover:border-[#12A0D8]  p-2 cursor-pointer`"
        >
          Service Information
        </div>
        <div
         @click="toggleType = 'Timeline'"
          :class="` ${toggleType === 'Timeline' ? 'text-[#12A0D8] border-[#12A0D8] border-b-[3px]' : 'text-[#6B7280]'} font-medium hover:border-b-[3px] hover:text-[#12A0D8] hover:border-[#12A0D8]  p-2 cursor-pointer`"
        >
          Change Timeline
        </div>
        <div
          class="font-medium hover:border-b-[3px] hover:text-[#12A0D8] hover:border-[#12A0D8] text-[#6B7280] p-2 cursor-pointer"
        >
          Users Feedback
        </div>
      </div>
      <div v-if="toggleType === 'Info'">
        <div
          v-if="isLoading"
          class="text-center py-8 animate-pulse text-lg text-muted-foreground"
        >
          Loading service details...
        </div>
        <div
          v-else-if="isError"
          class="text-center py-8 text-red-500 font-semibold"
        >
          Error loading service.
        </div>

        <div v-else-if="service" class="grid md:grid-cols-2 grid-cols-1 gap-6">
          <!-- Left: main service card (spans 2 cols on md+) -->
          <div class="space-y-6 md:p-0 p-4">
            <!-- Service Information -->
            <div class="space-y-1">
              <h2 class="text-base font-medium text-gray-900 mb-4">
                Service Information
              </h2>
              <div
                class="bg-white border border-[#F3F4F6] rounded-lg p-4 space-y-2 text-sm font-medium text-[#4B5563]"
              >
                <p class="pb-2">
                  {{
                    service.details.description || "No description available."
                  }}
                </p>

                <hr />
                <div class="space-y-1 py-2">
                  <h5 class="text-xs text-[#4B5563]">Service Category</h5>
                  <span class="text-sm font-medium text-[#111827]">
                    {{ service.details.category }}
                  </span>
                </div>
                <hr />

                <div class="space-y-1 py-2">
                  <h5 class="text-xs text-[#4B5563]">Address</h5>
                  <p class="text-sm font-medium text-[#111827]">
                    {{ service.details.address }}
                  </p>
                </div>
                <hr />
                <div class="space-y-4">
                  <div class="flex gap-2 items-center">
                    <div
                      class="w-[30px] h-[30px] flex items-center justify-center bg-[#FAFAED] text-[#B0B72E] rounded-[8px]"
                    >
                      <Icon icon="solar:phone-outline" width="20" height="20" />
                    </div>
                    <div class="space-y-1">
                      <h4 class="text-xs text-[#4B5563]">Phone</h4>
                      <p class="text-sm font-medium">
                        {{
                          service.details.phone_number ||
                          "Phone number not available"
                        }}
                      </p>
                    </div>
                  </div>
                  <hr />
                  <div class="flex gap-2 items-center">
                    <div
                      class="w-[30px] h-[30px] flex items-center justify-center bg-[#FAFAED] text-[#B0B72E] rounded-[8px]"
                    >
                      <Icon
                        icon="material-symbols:mail-outline-sharp"
                        width="20"
                        height="20"
                      />
                    </div>
                    <div class="space-y-1">
                      <h4 class="text-xs text-[#4B5563]">Email</h4>
                      <p class="text-sm font-medium">
                        {{
                          service.details.email === "null"
                            ? "Email not available"
                            : service.details.email
                        }}
                      </p>
                    </div>
                  </div>
                  <hr />
                  <div class="flex gap-2 items-center">
                    <div
                      class="w-[30px] h-[30px] flex items-center justify-center bg-[#FAFAED] text-[#B0B72E] rounded-[8px]"
                    >
                      <Icon icon="akar-icons:globe" width="20" height="20" />
                    </div>
                    <div class="flex-1 space-y-1">
                      <h4 class="text-xs text-[#4B5563]">Website</h4>
                      <a
                        :href="service.details.website"
                        target="_blank"
                        class="text-sm underline max-w-[250px] text-[#12A0D8] font-medium line-clamp-1"
                      >
                        {{ service.details.website || "website not available" }}
                      </a>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </div>

            <!-- Contact Information -->
          </div>

          <!-- Right: timeline card -->
          <div class="lg:col-span-1 space-y-6 md:p-0 p-4">
            <!-- Opening Hours -->
            <div class="space-y-1">
              <h2 class="text-base font-medium text-gray-900 mb-4">
                Opening Hours
              </h2>
              <div
                class="bg-white border border-[#F3F4F6] rounded-lg p-4 space-y-2 text-sm font-medium text-[#4B5563]"
              >
                <div
                  v-for="(item, index) in hours"
                  :key="index"
                  class="space-y-4"
                >
                  <div class="flex gap-2 items-start">
                    <Icon
                      icon="mdi:clock-outline"
                      width="20"
                      height="20"
                      style="color: #b0b72e"
                    />
                    <p class="text-sm flex-1">{{ item }}</p>
                  </div>
                  <hr v-if="index < hours.length - 1" />
                </div>
              </div>
            </div>

            <!-- Eligibility Criteria -->
            <div class="space-y-1">
              <h2 class="text-base font-medium text-gray-900 mb-4">
                Eligibility Criteria
              </h2>
              <div
                class="bg-white border border-[#F3F4F6] rounded-lg p-4 space-y-2 text-sm font-medium text-[#4B5563]"
              >
                <div v-for="(item, index) in eligibility" :key="index">
                  <div class="flex gap-2 items-start">
                    <Icon
                      icon="icon-park-outline:check-one"
                      width="20"
                      height="20"
                      style="color: #b0b72e"
                    />
                    <p class="text-sm flex-1">{{ item }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-muted-foreground">
          Service not found.
        </div>
      </div>
      <div v-else-if="toggleType === 'Timeline'">
        <aside class=" space-y-4 h-fit">
          

          <div
            v-if="isChangesLoading"
            class="text-sm text-muted-foreground animate-pulse"
          >
            Loading changes...
          </div>
          <div v-else-if="isChangesError" class="text-sm text-red-500">
            Error loading changes.
          </div>

          <div v-else class="space-y-4 max-h-screen overflow-y-auto">
            <div
              v-if="sortedChanges.length === 0"
              class="text-sm text-muted-foreground"
            >
              No changes recorded.
            </div>

            <ol class="">
              <li
                v-for="change in sortedChanges"
                :key="change.id"
                class="border-b pb-4 border-[#E5E7EB] last:border-0 last:pb-0"
              >
                <div class="mt-2 space-y-2">
                  <div
                    v-for="(fieldChanges, key) in change.details"
                    :key="String(key)"
                    class="space-y-1"
                  >
                    <div class="font-semibold">
                      {{ formatKey(String(key)) }}
                    </div>
                    <time class="text-xs text-muted-foreground">{{
                      new Date(change.date_updated).toLocaleString()
                    }}</time>
                    <div class="flex items-start flex-col gap-1">
                      <div class="text-sm text-[#EF4444] line-through">
                        {{ fieldChanges.old ?? "—" }}
                      </div>

                      <div class="text-sm text-[#16A34A] font-medium">
                        {{ fieldChanges.new ?? "—" }}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { useServiceEdit } from "../hooks";
import https from "@/utils/https";
import { useFetchServiceUpdates } from "../hooks";
import { Icon } from "@iconify/vue";
import { toast } from "vue-sonner";
import InfoDialog from "../components/InfoDialog.vue";
import ProgressToast from "../components/ProgressToast.vue";
import { UseProgress } from "../hooks";
import { CORE_SERVICE_CATEGORIES } from "#imports";
import type { Service } from "#imports";
definePageMeta({
  layout: "admin",
});

const route = useRoute();
const id = route.params.id as string;

const jobId = ref<string>("");
const toggleType = ref<string>("Info");

const { data: progressData, refetch: progressRefetch } = UseProgress(jobId);

const progressState = ref({
  show: false,
  progress: 0,
  status: "loading" as "loading" | "success" | "error",
  title: "Processing",
  message: "Please wait...",
});

// Watch for progress changes (simpler version)
watch(
  () => progressData.value?.progress,
  (newProgress) => {
    if (newProgress == null) return;

    if (newProgress < 100) {
      progressState.value = {
        show: true,
        progress: newProgress,
        status: "loading",
        title: "Re-running Services",
        message: "Please wait while we re-run the services...",
      };
    } else {
      progressState.value = {
        show: true,
        progress: 100,
        status: "success",
        title: "Complete!",
        message: "Re-run complete! Services have been updated.",
      };

     
      refetch();
    }
  }
);

// Cancel handler
const handleProgressCancel = async () => {
  try {
    await cancelJob(jobId);
    progressState.value = {
      show: true,
      progress: progressData.value?.progress || 0,
      status: "error",
      title: "Cancelled",
      message: "Operation has been cancelled.",
    };
  } catch (error) {
    console.error("Failed to cancel:", error);
  }
};

// Close handler
const handleProgressClose = () => {
  progressState.value.show = false;
};

// Edit modal state
const showEdit = ref(false);
const editForm = ref<{ [key: string]: string }>({
  name: "",
  description: "",
  address: "",
  phone_number: "",
  category: "",
  opening_hours: "",
  eligibility_criteria: "",
});
// Remove editLoading, use mutation state
const editError = ref("");
const editSuccess = ref(false);

// Fetch single service
const { data, isLoading, isError, refetch } = useQuery({
  queryKey: ["service", id],
  queryFn: async () => {
    const res = await https.get(`/v1/services/${id}`);
    return res.data;
  },
  enabled: !!id,
});
const { mutate: rerunMutation, isPending: rerunPending } =
  useFetchServiceUpdates();

const service = computed<Service | null>(() => {
  return data?.value ?? null;
});

const eligibility = computed(() => {
  return service.value?.details.eligibility_criteria
    ? service.value.details.eligibility_criteria
        .split(";")
        .map((item) => item.trim())
    : [];
});

const hours = computed(() => {
  return service.value?.details.opening_hours
    ? service.value.details.opening_hours.split(";").map((item) => item.trim())
    : [];
});
function getStarFill(rating: number | undefined, position: number): string {
  if (!rating) return "text-gray-300";
  const roundedRating = Math.round(rating);
  return position <= roundedRating ? "text-yellow-400" : "text-gray-300";
}
function handleRerun() {
  const selectedIds = [id];
  rerunMutation(selectedIds, {
    onSuccess: ({ data }) => {
      jobId.value = data.job_id;
      toast.success("Re-run Triggered!", {
        style: {
          background: "#F0FDF4",
          border: "1px solid #BBF7D0",
          color: "#16A34A",
        },
        class: "my-toast",
        descriptionClass: "my-toast-description",
      });
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to re-run.";
      toast.error(msg);
    },
  });
}

// When modal opens, prefill form
watch(showEdit, (val) => {
  if (val && service.value) {
    const d = service.value.details;
    editForm.value = {
      name: d.name ?? "",
      description: d.description ?? "",
      category: d.category ?? "",
      address: d.address ?? "",
      phone_number: d.phone_number ?? "",
      opening_hours: d.opening_hours ?? "",
      eligibility_criteria: d.eligibility_criteria ?? "",
    };
    editError.value = "";
    editSuccess.value = false;
  }
});

const { mutate: onUpdate, isPending } = useServiceEdit(
  id,
  async () => {
    editSuccess.value = true;
    showEdit.value = false;
    await refetch();
    await refetchChanges();
  },
  (err: any) => {
    editError.value = err?.response?.data?.message || "Failed to update.";
  }
);

function submitEdit() {
  editError.value = "";
  editSuccess.value = false;
  // Merge all service fields, override with edits
  const base = { ...(service.value?.details ?? {}) };
  for (const k in editForm.value) {
    base[k] = editForm.value[k];
  }
  onUpdate(
    { details: base },
    {
      onSuccess: () => {
        toast.success("Service Updated!", {
          style: {
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            color: "#16A34A",
          },
          class: "my-toast",
          descriptionClass: "my-toast-description",
        });

        refetch();
      },
      onError: (err: any) => {
        const msg = err?.response?.data?.message || "Failed to re-run.";
        toast.error(msg);
      },
    }
  );
}

// Fetch change history for this service
const {
  data: changesData,
  isLoading: isChangesLoading,
  isError: isChangesError,
  refetch: refetchChanges,
} = useQuery({
  queryKey: ["service-changes", id],
  queryFn: async () => {
    const res = await https.get(`/v1/services/${id}/changes`);
    return res.data as any[];
  },
  enabled: !!id,
});

const categoriesArr = computed(() => {
  if (!service?.value) return [];
  const cats = service.value.details.category;
  return typeof cats === "string"
    ? cats
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : [];
});
const subcategoriesArr = computed(() => {
  if (!service?.value) return [];
  const cats = service.value.details.subcategories;
  return typeof cats === "string"
    ? cats
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean)
    : [];
});

function formatKey(k: string) {
  return k.replace(/_/g, " ").replace(/\b\w/g, (s) => s.toUpperCase());
}

// sort changes by date_updated descending
const sortedChanges = computed(() => {
  const arr = (changesData?.value ?? []) as any[];
  return arr.slice().sort((a, b) => {
    const da = new Date(a.date_updated).getTime();
    const db = new Date(b.date_updated).getTime();
    return db - da;
  });
});
</script>

<style scoped>
/* Add any additional custom styles here */
</style>

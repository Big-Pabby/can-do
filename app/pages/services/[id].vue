<template>
  <div class="space-y-4">
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
            <label class="block text-sm font-medium mb-1">Subcategories</label>
            <input
              v-model="editForm.sub_category"
              type="text"
              class="w-full border rounded-[10px] px-3 py-3.5"
            />
            <div class="text-xs text-muted-foreground mt-1">
              Comma separated
            </div>
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
    <div class="border border-[#F3F4F6] rounded-[16px] bg-white p-6 space-y-6">
      <div
        class="flex justify-between md:flex-row flex-col gap-4 md:items-center"
      >
        <div class="space-y-3">
          <h1 class="text-3xl font-bold text-[#12A0D8]">About Service</h1>
          <p class="text-[#6B7280]">
            Here is the information about this service
          </p>
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
          class="font-medium border-b-[3px] text-[#12A0D8] border-[#12A0D8] p-2 cursor-pointer"
        >
          Service Information
        </div>
        <div
          class="font-medium hover:border-b-[3px] hover:text-[#12A0D8] hover:border-[#12A0D8] text-[#6B7280] p-2 cursor-pointer"
        >
          Users Feedback
        </div>
      </div>
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

      <div
        v-else-if="service"
        class="flex gap-6 justify-between md:flex-row flex-col"
      >
        <!-- Left: main service card (spans 2 cols on md+) -->
        <div
          class="md:w-7/12 w-full border bg-[#FEFEFE] rounded-2xl p-6 space-y-4 relative"
        >
          <!-- Card Header -->
          <!-- <span
            :class="{
              'inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors': true,
              'bg-green-50 text-green-900 border-green-200':
                service.details.verification_status === 'Verified',
              'bg-yellow-50 text-yellow-900 border-yellow-200':
                service.details.verification_status === 'Pending',
              'bg-red-50 text-red-900 border-red-200':
                service.details.verification_status === 'Rejected',
            }"
          >
            {{ service.details.verification_status }}
          </span> -->

          <div
            class="flex md:flex-row flex-col-reverse md:items-center items-start justify-between gap-4 mb-2"
          >
            <div class="flex items-center gap-3">
              <div>
                <h1 class="text-2xl font-bold leading-tight">
                  {{ service.details.name }}
                </h1>
                <p class="text-muted-foreground text-sm">
                  {{ service.details.org_name }}
                </p>
              </div>
            </div>
          </div>
          <hr />

          <!-- Description -->
          <div class="mb-6">
            <h2 class="font-semibold text-lg mb-2 text-primary">Description</h2>
            <p class="text-base text-muted-foreground">
              {{ service.details.description }}
            </p>
          </div>
          <hr />

          <!-- Categories -->
          <div class="mb-6">
            <h2 class="font-semibold text-lg mb-2 text-primary">Categories</h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="cat in categoriesArr"
                :key="cat"
                class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-secondary text-secondary-foreground shadow"
                >{{ cat }}</span
              >
            </div>
          </div>

          <hr />
          <div class="mb-6">
            <h2 class="font-semibold text-lg mb-2 text-primary">
              Sub-Categories
            </h2>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="cat in subcategoriesArr"
                :key="cat"
                class="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold bg-secondary text-secondary-foreground shadow"
                >{{ cat }}</span
              >
            </div>
          </div>

          <hr />
          <!-- Info Grid -->
          <div class="grid grid-cols-1 gap-6 mb-6">
            <div class="flex flex-col items-start gap-2">
              <span class="font-semibold">Address:</span>
              <span class="text-muted-foreground">{{
                service.details.address
              }}</span>
            </div>
            <hr />
            <div class="flex flex-col items-start gap-2">
              <span class="font-semibold">Hours:</span>
              <span class="text-muted-foreground">{{
                service.details.opening_hours
              }}</span>
            </div>
            <hr />
            <div class="flex flex-col items-start gap-2">
              <span class="font-semibold">Contact:</span>
              <div class="flex flex-wrap gap-4 text-muted-foreground">
                <p v-if="service.details.phone_number">
                  Phone Number: {{ service.details.phone_number }}
                </p>
                <p v-if="service.details.email">
                  Phone Number: {{ service.details.email }}
                </p>
              </div>
            </div>
            <hr />
            <div class="flex flex-col items-start gap-2">
              <span class="font-semibold">Eligibility:</span>
              <span class="text-muted-foreground">{{
                service.details.eligibility_criteria
              }}</span>
            </div>
          </div>

          <!-- Ratings & Reviews -->
          <div class="flex items-center gap-6 border-t pt-6">
            <div class="flex items-center gap-2">
              <span class="text-yellow-400">★</span>
              <span class="font-semibold">{{ service.details.rating }}</span>
              <span class="text-muted-foreground"
                >({{ service.details.reviews }} reviews)</span
              >
            </div>
          </div>
        </div>

        <!-- Right: timeline card -->
        <aside
          class="md:w-5/12 bg-[#FEFEFE] rounded-2xl p-6 border space-y-4 h-fit"
        >
          <h3 class="text-lg font-semibold">Change Timeline</h3>
          <hr />

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
      <div v-else class="text-center py-8 text-muted-foreground">
        Service not found.
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

const { data: progressData, refetch: progressRefetch } = UseProgress(jobId);

let toastId: string | number | undefined;

watch(
  () => progressData.value?.progress,
  (newProgress) => {
    if (newProgress == null) return;

    if (newProgress < 100) {
      if (!toastId) {
        toastId = toast.custom(
          () => h(ProgressToast, { progress: newProgress }),
          {
            duration: Infinity,
          }
        );
      } else {
        toast.custom(() => h(ProgressToast, { progress: newProgress }), {
          id: toastId,
          duration: Infinity,
        });
      }
    } else {
      if (toastId) toast.dismiss(toastId);
      toast.success("Re-run complete!", {
        style: {
          background: "#F0FDF4",
          border: "1px solid #BBF7D0",
          color: "#16A34A",
        },
      });
      refetch();
      refetchChanges();
    }
  }
);

// Edit modal state
const showEdit = ref(false);
const editForm = ref<{ [key: string]: string }>({
  name: "",
  description: "",
  address: "",
  phone_number: "",
  category: "",
  sub_category: "",
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
      categories: d.category ?? "",
      sub_category: d.subcategories ?? "",
      address: d.address ?? "",
      phone: d.phone ?? "",
      hours: d.opening_hours ?? "",
      eligibility: d.eligibility_criteria ?? "",
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

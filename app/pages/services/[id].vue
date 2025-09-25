<template>
  <div
    class="min-h-screen py-8 bg-gradient-to-br from-background to-secondary/30"
  >
   <span v-if="rerunError" class="ml-4 text-red-600 text-sm"
              >Error: {{ error?.message || "Failed to re-run" }}</span
            >
            <span v-if="isSuccess" class="ml-4 text-green-600 text-sm"
              >Re-run successful!</span
            >
    <div class="max-w-6xl mx-auto px-4">
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

      <div v-else-if="service" class="grid gap-6 md:grid-cols-2 grid-cols-1">
        <!-- Left: main service card (spans 2 cols on md+) -->
        <div class="border bg-white rounded-2xl p-8 space-y-4 relative">
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
          <div class="flex justify-between">
             <button
              @click="showEdit = true"
              class="inline-flex items-center px-3 py-2 rounded-md border bg-[#12A0D8] text-white font-semibold hover:bg-[#12A0D8]/90 transition"
            >
              Edit Service
            </button>
            <button
              class="bg-primary py-3 px-6 rounded-[8px] text-white disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isPending"
              @click="handleRerun"
            >
              <span v-if="rerunPending">Re-running...</span>
              <span v-else>Re-run</span>
            </button>
           
          </div>
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
          <!-- Edit Modal -->
          <div
            v-if="showEdit"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          >
            <div
              class="bg-white rounded-xl h-[95vh] overflow-y-auto shadow-lg p-6 w-full max-w-lg relative"
            >
              <button
                @click="showEdit = false"
                class="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
              >
                &times;
              </button>
              <h2 class="text-lg font-bold mb-4">Edit Service Info</h2>
              <form @submit.prevent="submitEdit" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium mb-1">Name</label>
                  <input
                    v-model="editForm.name"
                    type="text"
                    class="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1"
                    >Organization</label
                  >
                  <input
                    v-model="editForm.org_name"
                    type="text"
                    class="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1"
                    >Description</label
                  >
                  <textarea
                    v-model="editForm.description"
                    class="w-full border rounded px-3 py-2"
                    rows="3"
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1"
                    >Categories</label
                  >
                  <input
                    v-model="editForm.categories"
                    type="text"
                    class="w-full border rounded px-3 py-2"
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
                    class="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Contact</label>
                  <input
                    v-model="editForm.contact"
                    type="text"
                    class="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1">Hours</label>
                  <input
                    v-model="editForm.hours"
                    type="text"
                    class="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium mb-1"
                    >Eligibility</label
                  >
                  <input
                    v-model="editForm.eligibility"
                    type="text"
                    class="w-full border rounded px-3 py-2"
                  />
                </div>
                <div class="flex items-center gap-2 mt-4">
                  <button
                    type="submit"
                    :disabled="isPending"
                    class="bg-[#12A0D8] text-white px-4 py-2 rounded font-semibold hover:bg-[#12A0D8]/90 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <span v-if="isPending" class="text-sm text-muted-foreground"
                    >Saving...</span
                  >
                  <span v-if="editError" class="text-sm text-red-500">{{
                    editError
                  }}</span>
                  <span v-if="editSuccess" class="text-sm text-green-600"
                    >Saved!</span
                  >
                </div>
              </form>
            </div>
          </div>

          <!-- Description -->
          <div class="mb-6">
            <h2 class="font-semibold text-lg mb-2 text-primary">Description</h2>
            <p class="text-base text-muted-foreground">
              {{ service.details.description }}
            </p>
          </div>

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

          <!-- Info Grid -->
          <div class="grid grid-cols-1 gap-6 mb-6">
            <div class="flex flex-col items-start gap-2">
             
              <span class="font-semibold">Address:</span>
              <span class="text-muted-foreground">{{
                service.details.address
              }}</span>
            </div>
            <div class="flex flex-col items-start gap-2">
             
              <span class="font-semibold">Hours:</span> 
              <span class="text-muted-foreground">{{
                service.details.hours
              }}</span>
            </div>
            <div class="flex flex-col items-start gap-2">
              
              <span class="font-semibold">Contact:</span>
              <span class="text-muted-foreground">{{
                service.details.contact
              }}</span>
            </div>
            <div class="flex flex-col items-start gap-2">
             
              <span class="font-semibold">Eligibility:</span> 
              <span class="text-muted-foreground">{{
                service.details.eligibility
              }}</span>
            </div>
          </div>

          <!-- Ratings & Reviews -->
          <div class="flex items-center gap-6 border-t pt-6">
            <div class="flex items-center gap-2">
              <span class="text-yellow-400">★</span>
              <span class="font-semibold">{{ service.details.rating }}</span>
              <span class="text-muted-foreground"
                >({{ service.details.total_ratings }} reviews)</span
              >
            </div>
          </div>
        </div>

        <!-- Right: timeline card -->
        <aside class="rounded-2xl p-6 border h-fit">
          <h3 class="text-lg font-semibold mb-4">Change timeline</h3>

          <div
            v-if="isChangesLoading"
            class="text-sm text-muted-foreground animate-pulse"
          >
            Loading changes...
          </div>
          <div v-else-if="isChangesError" class="text-sm text-red-500">
            Error loading changes.
          </div>

          <div v-else class="space-y-4 max-h-[60vh] pr-2">
            <div
              v-if="sortedChanges.length === 0"
              class="text-sm text-muted-foreground"
            >
              No changes recorded.
            </div>

            <ol class="relative border-l border-gray-200">
              <li
                v-for="change in sortedChanges"
                :key="change.id"
                class="mb-6 ml-4"
              >
                <div
                  class="absolute -left-3 w-6 h-6 bg-white border border-gray-300 rounded-full flex items-center justify-center text-xs text-muted-foreground"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-3 w-3 text-primary"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V5a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0V9h2a1 1 0 100-2h-2z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <time class="mb-1 text-xs text-muted-foreground">{{
                  new Date(change.date_updated).toLocaleString()
                }}</time>
                <h4 class="text-sm font-medium">
                  Change ID: <span class="font-normal">{{ change.id }}</span>
                </h4>
                <div class="mt-2 space-y-2">
                  <div
                    v-for="(fieldChanges, key) in change.details"
                    :key="String(key)"
                    class="bg-gray-50 p-3 rounded"
                  >
                    <div class="text-xs text-muted-foreground">
                      {{ formatKey(String(key)) }}
                    </div>
                    <div class="flex items-center gap-3 mt-1">
                      <div class="text-sm text-rose-600 line-through truncate">
                        {{ fieldChanges.old ?? "—" }}
                      </div>
                      <div class="text-sm text-muted-foreground">→</div>
                      <div
                        class="text-sm text-emerald-600 font-medium truncate"
                      >
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

const route = useRoute();
const id = route.params.id as string;

// Edit modal state
const showEdit = ref(false);
const editForm = ref<{ [key: string]: string }>({
  name: "",
  org_name: "",
  description: "",
  categories: "",
  address: "",
  contact: "",
  hours: "",
  eligibility: "",
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
const {
  mutate: rerunMutation,
  isPending: rerunPending,
  isSuccess,
  isError: rerunError,
  error,
} = useFetchServiceUpdates();

const service = data;
function handleRerun() {
  const selectedIds = [id];
  rerunMutation(selectedIds);
}

// When modal opens, prefill form
watch(showEdit, (val) => {
  if (val && service.value) {
    const d = service.value.details;
    editForm.value = {
      name: d.name ?? "",
      org_name: d.org_name ?? "",
      description: d.description ?? "",
      categories: d.categories ?? "",
      address: d.address ?? "",
      contact: d.contact ?? "",
      hours: d.hours ?? "",
      eligibility: d.eligibility ?? "",
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
  onUpdate({ details: base });
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
  const cats = service.value.details.categories;
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

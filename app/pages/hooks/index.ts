import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { https } from "#imports";
import type { User } from "~/store/auth";

import { useAuthStore } from "~/store/auth";

export function useFetchServiceUpdates() {
  interface Response {
    job_id: string;
  }
  return useMutation({
    mutationFn: async (serviceIds: string[]) => {
      return await https.post<Response>(
        `/v1/services/fetch_updates/`,
        serviceIds
      );
    },
  });
}
export const UseProgress = (jobIdRef: Ref<string>) => {
  interface Response {
    progress: number;
    changes_found: number;
  }

  const queryFn = async () => {
    console.log("Fetching progress for job ID:", jobIdRef.value);
    const response = await https.get<Response>(
      `/v1/services/fetch_updates/status?job_id=${jobIdRef.value}`
    );
    return response.data;
  };

  return useQuery<Response>({
    queryKey: ["progress", jobIdRef], // Pass the ref, vue-query will track it
    queryFn,
    refetchInterval: (query) => {
      // Stop refetching when progress reaches 100%
      return query.state.data?.progress === 100 ? false : 1000;
    },
    enabled: computed(() => !!jobIdRef.value), // Use computed for reactivity
  });
};
export function useConsent() {
  interface Response {
    id: string;
    date_created: string;
    date_updated: string;
  }
  //   const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      last_name: string;
      first_name: string;
      age: number;
      phone_number: string;
      email: string;
      gender: string;
      location: string;
      ethincity: string;
      recovery_status: string[];
    }) => {
      const response = await https.post<Response>(`v1/consents`, payload);
      return response;
    },
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["business_products"] });
    // },
  });
}
export function useServiceEdit(
  serviceId: string,
  onSuccess?: () => void,
  onError?: (err: any) => void
) {
  return useMutation({
    mutationFn: async (payload: Record<string, any>) => {
      return await https.patch(`/v1/services/${serviceId}`, payload);
    },
    onSuccess,
    onError,
  });
}
export function useConsentInsight() {
  //   const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      consent_id: string;
      data: {
        current_feeling: string;
        support_experience: string;
        support_discovery_important: string;
        preferred_support_process: string;
        offered_support_feeling: string;
        preferred_insight_appreciation: string;
        extra_personal_information: string;
      };
    }) => {
      const response = await https.post(
        `v1/consents/${payload.consent_id}/insight`,
        payload.data
      );
      return response;
    },
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["business_products"] });
    // },
  });
}
export function useSignUp() {
  //   const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      username: string;
      phone_number: string;
      email: string;
      password: string;
      service_interest: string[];
    }) => {
      const response = await https.post(`/v1/auth/signup`, payload);
      return response;
    },
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["business_products"] });
    // },
  });
}
export interface AuthTokenResponse {
  token_type: string;
  access_token: string;
  refresh_token: string;
  access_expires_at: string; // ISO timestamp string
  refresh_expires_at: string; // ISO timestamp string
}

export function useSignIn() {
  //   const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: FormData) => {
      const response = await https.post<AuthTokenResponse>(
        `/v1/auth/token`,
        payload, // <-- payload goes here as the body
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      return response;
    },
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["business_products"] });
    // },
  });
}
export function useUpload() {
  //   const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: any) => {
      // If payload is FormData (duck-typed), ensure axios sends multipart boundary and not JSON
      if (payload && typeof (payload as any).append === "function") {
        const response = await https.post(`v1/misc/upload`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        return response;
      }

      const response = await https.post(`v1/misc/upload`, payload);
      return response;
    },
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["business_products"] });
    // },
  });
}
export function useTranscript() {
  //   const queryClient = useQueryClient();
  interface Response {
    text: string;
  }
  return useMutation({
    mutationFn: async (payload: { audio_url: string }) => {
      const response = await https.post<Response>(
        `v1/misc/audio2text`,
        payload
      );
      return response;
    },
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["business_products"] });
    // },
  });
}
export function UseDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service_id: string) => {
      const response = await https.delete(`v1/services/${service_id}`);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function UseCategories() {
  const queryFn = async () => {
    const response = await https.get(`/v1/services/categories`);
    return response.data;
  };

  return useQuery({
    queryKey: ["categories"],
    queryFn,
  });
}
export function UseProfile() {
  const authStore = useAuthStore();

  const queryFn = async () => {
    const response = await https.get<User>("/v1/auth/me");
    return response.data;
  };

  return useQuery<User>({
    queryKey: ["user_profile"],
    queryFn,
   
  });
}

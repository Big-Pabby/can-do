export function useFetchServiceUpdates(
  
) {
  return useMutation({
    mutationFn: async (serviceIds: string[]) => {
      return await https.post(`/v1/services/fetch_updates/`, serviceIds);
    },
   
  });
}

import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { https } from "#imports";

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

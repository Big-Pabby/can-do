import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { https } from "#imports";

export function useConsent() {
  //   const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      last_name: string;
      first_name: string;
      age: number;
      gender: string;
      location: string;
      ethincity: string;
      recovery_status: string;
    }) => {
      const response = await https.post(`v1/consents`, payload);
      return response;
    },
    // onSuccess: () => {
    //   queryClient.invalidateQueries({ queryKey: ["business_products"] });
    // },
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

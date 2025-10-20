import { useQuery, useMutation } from "@tanstack/vue-query";
import https from "@/utils/https";
import type { Service } from "#imports";

interface Response {
  total_pages: number;
  count: number;
  results: Service[];
}

interface Coordinates {
  place: string;
  lat: number;
  lng: number;
  message?: string;
  signal?: AbortSignal;
}

export function UseChatBot() {
  interface Response {
    answer: string;
    services: Service[];
  }
  return useMutation({
    mutationFn: async (query: Coordinates) => {
      return await https.post<Response>(
        `/v1/services/ask-chatbot?place=${query.place}&lat=${query.lat}&lng=${query.lng}`,
        { message: query.message },
        { signal: query.signal }
      );
    },
  });
}

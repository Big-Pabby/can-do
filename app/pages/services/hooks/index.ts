import { useQuery, useMutation } from "@tanstack/vue-query";
import https from "@/utils/https";
import type { Service } from "#imports";

interface Response {
  total_pages: number;
  count: number;
  results: Service[];
}

interface Coordinates {
  location_query: string;
  radius: number;
}

export const UseDistrict = () => {
  const queryFn = async () => {
    const response = await https.get<string[]>(`/v1/services/districts`);
    return response.data;
  };

  return useQuery({
    queryKey: ["district"],
    queryFn,
  });
};
export function UseDataCollection() {
  interface DataCollectionResponse {
    job_id: string;
    detail: string;
  }

  return useMutation({
    mutationFn: async (query: Coordinates) => {
      const locationsParam = query.location_query;
      return await https.post<DataCollectionResponse>(
        `/v1/services/intiate_data_collection`,
        query
      );
    },
  });
}

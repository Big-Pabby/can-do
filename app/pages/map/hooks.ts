import { useQuery } from "@tanstack/vue-query";
import https from "@/utils/https";
import type { Service } from "#imports";

interface Response {
  total_pages: number;
  count: number;
  results: Service[];
}

interface Coordinates {
  lat: number;
  lng: number;
}

export const UseMapServices = (
  page: Ref<number> | ComputedRef<number> = ref(1),
  pageSize: Ref<number> | ComputedRef<number> = ref(100),
  coordinates?: Ref<Coordinates | null> | ComputedRef<Coordinates | null>
) => {
  return useQuery({
    queryKey: computed(() => [
      "map_services",
      page.value,
      pageSize.value,
      coordinates?.value?.lat,
      coordinates?.value?.lng,
    ]),
    queryFn: async (): Promise<Response> => {
      const latLng = coordinates?.value
        ? `${coordinates.value.lat},${coordinates.value.lng}`
        : "";
      const response = await https.get<Response>(
        `v1/services/?page=${page.value}&page_size=${pageSize.value}&lat_lng=${latLng}`
      );
      return response.data;
    },
    enabled: true,
  });
};

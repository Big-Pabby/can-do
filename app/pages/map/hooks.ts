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
  coordinates?: Ref<Coordinates | null> | ComputedRef<Coordinates | null>,
  opts?: {
    search?: Ref<string> | ComputedRef<string> | string;
    category?: Ref<string> | ComputedRef<string> | string;
    distance?: Ref<string> | ComputedRef<string> | string;
    district?: Ref<string> | ComputedRef<string> | string;
    excludedAreas?:
      | Ref<string[] | null>
      | ComputedRef<string[] | null>
      | string[];
  }
) => {
  const getVal = <T>(v: any): T | undefined => {
    if (v === undefined) return undefined;
    if (v === null) return null as any;
    if (typeof v === "string" || Array.isArray(v)) return v as any;
    if (typeof v === "object" && "value" in v) return v.value as any;
    return v as any;
  };

  // Normalize helpers: trim strings and treat whitespace-only as undefined,
  // and filter array entries to remove empty values
  const normalizeStr = (v?: string | null): string | undefined => {
    if (v === undefined || v === null) return undefined;
    const s = String(v).trim();
    return s.length > 0 ? s : undefined;
  };

  const normalizeArr = (v?: string[] | null): string[] => {
    if (!v) return [];
    return (Array.isArray(v) ? v : [])
      .map((s) => String(s ?? "").trim())
      .filter(Boolean);
  };

  return useQuery({
    queryKey: computed(() => {
      // Normalize and don't treat empty/whitespace-only strings as values
      const search = normalizeStr(getVal<string>(opts?.search));
      const category = normalizeStr(getVal<string>(opts?.category));
      const distance = normalizeStr(getVal<string>(opts?.distance));
      const district = normalizeStr(getVal<string>(opts?.district));
      const excluded = normalizeArr(
        getVal<string[] | null>(opts?.excludedAreas)
      );

      return [
        "map_services",
        page.value,
        pageSize.value,
        coordinates?.value?.lat,
        coordinates?.value?.lng,
        search,
        category,
        distance,
        district,
        excluded.length > 0 ? excluded.join(",") : undefined,
      ];
    }),
    queryFn: async (): Promise<Response> => {
      const latLng = coordinates?.value
        ? `${coordinates.value.lat},${coordinates.value.lng}`
        : "";

      const searchRaw = normalizeStr(getVal<string>(opts?.search));
      const categoryRaw = normalizeStr(getVal<string>(opts?.category));
      const distanceRaw = normalizeStr(getVal<string>(opts?.distance));
      const districtRaw = normalizeStr(getVal<string>(opts?.district));
      const excludedArr = normalizeArr(
        getVal<string[] | null>(opts?.excludedAreas)
      );

      const params: string[] = [];
      // always include pagination
      params.push(`page=${encodeURIComponent(String(page.value))}`);
      params.push(`page_size=${encodeURIComponent(String(pageSize.value))}`);

      if (latLng) params.push(`lat_lng=${encodeURIComponent(latLng)}`);
      if (categoryRaw)
        params.push(`category=${encodeURIComponent(categoryRaw)}`);
      if (excludedArr.length > 0)
        params.push(
          `excluded_areas=${encodeURIComponent(excludedArr.join(","))}`
        );
      if (distanceRaw)
        params.push(`distance=${encodeURIComponent(distanceRaw)}`);
      if (districtRaw)
        params.push(`district=${encodeURIComponent(districtRaw)}`);
      if (searchRaw) params.push(`search=${encodeURIComponent(searchRaw)}`);

      const url = `v1/services/?${params.join("&")}`;

      const response = await https.get<Response>(url);
      return response.data;
    },
    enabled: true,
  });
};

import { ref, computed } from "vue";
import { useQuery } from "@tanstack/vue-query";
import https from "@/utils/https";

export interface ServiceLocation {
  lat: number;
  lng: number;
}

export interface Service {
  id: string;
  has_changes: boolean;
  details: {
    service_id: string;
    name: string;
    org_name: string;
    categories: string;
    description: string;
    eligibility: string;
    contact: string;
    address: string;
    phone: string;
    hours: string;
    access: string;
    evidence_links: string[];
    verification_status: string;
    total_ratings: number;
    rating: number;
    confidence: number;
    location?: ServiceLocation;
  };
  date_created: string;
  date_updated: string;
}

export const useServices = () => {
  const currentPage = ref(1);
  const itemsPerPage = ref(6);
  const searchQuery = ref("");
  const selectedCategory = ref("all");
  const selectedVerification = ref("all");

  // Fetch services from API
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const res = await https.get<Service[]>("v1/services?category=all");

      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });

  const services = computed(() => data.value ?? []);
  console.log(services.value);

  // Get unique categories from services
  const categories = computed(() => {
    const cats = new Set<string>();
    services.value.forEach((service) => {
      console.log("Raw categories:", service.details.categories);
      const categoriesArr =
        typeof service.details.categories === "string"
          ? service.details.categories
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          : [];
      categoriesArr.forEach((category) => cats.add(category));
    });
    return Array.from(cats);
  });

  // Get unique verification statuses
  const verificationStatuses = computed(() => {
    const set = new Set<string>();
    services.value.forEach((service) => {
      const v = service.details?.verification_status;
      if (v) set.add(v);
    });
    return ["all", ...Array.from(set)];
  });

  // Filter services based on search query and category
  const filteredServices = computed(() => {
    return services.value.filter((service) => {
      const matchesSearch =
        searchQuery.value === "" ||
        service.details.name
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase()) ||
        service.details.description
          .toLowerCase()
          .includes(searchQuery.value.toLowerCase());

      const categoriesArr =
        typeof service.details.categories === "string"
          ? service.details.categories
              .split(",")
              .map((c) => c.trim())
              .filter(Boolean)
          : [];
      const matchesCategory =
        selectedCategory.value === "all" ||
        categoriesArr.includes(selectedCategory.value);

      const matchesVerification =
        selectedVerification.value === "all" ||
        service.details?.verification_status === selectedVerification.value;

      return matchesSearch && matchesCategory && matchesVerification;
    });
  });

  // Paginate services
  const paginatedServices = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    const end = start + itemsPerPage.value;
    return filteredServices.value.slice(start, end);
  });

  // Calculate total pages
  const totalPages = computed(() => {
    return Math.ceil(filteredServices.value.length / itemsPerPage.value);
  });

  // Navigation methods
  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  };

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  };

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page;
    }
  };

  return {
    services,
    paginatedServices,
    currentPage,
    totalPages,
    categories,
    verificationStatuses,
    searchQuery,
    filteredServices,
    selectedCategory,
    selectedVerification,
    nextPage,
    prevPage,
    goToPage,
    isLoading,
    isError,
    refetch,
  };
};

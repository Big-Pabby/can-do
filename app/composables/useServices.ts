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
    email: string;
    website: string;
    org_name: string;
    categories: string;
    subcategories: string;
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
    lat: string;
    lng: string;
    confidence: number;
    location?: ServiceLocation;
  };
  date_created: string;
  date_updated: string;
}

// Core service categories mapping
export const CORE_SERVICE_CATEGORIES = {
  "Food & Nutrition": [
    "food banks",
    "free hot meals",
    "community kitchens",
    "voucher schemes",
  ],
  "Shelter & Housing": [
    "emergency shelters",
    "temporary accommodation",
    "housing advice",
    "homelessness prevention",
    "tenancy support",
    "day centres",
  ],
  "Clothing & Essentials": [
    "clothing banks",
    "free hygiene",
    "bathing facilities",
    "showers",
    "laundry services",
    "warm spaces",
  ],
  "Addiction & Recovery": [
    "drug services",
    "alcohol services",
    "detox",
    "rehab programmes",
    "peer recovery",
    "aa",
    "na",
    "smart recovery",
    "harm reduction",
    "needle exchange",
  ],
  "Mental Health & Wellbeing": [
    "crisis helplines",
    "samaritans",
    "counselling",
    "therapy",
    "community mental health",
    "peer wellbeing",
  ],
  "Health & Medical": [
    "gp",
    "nhs",
    "walk-in centres",
    "dental clinics",
    "eye clinics",
    "sexual health",
    "vaccination",
    "preventative care",
  ],
  "Justice & Legal Support": [
    "probation services",
    "legal advice",
    "immigration",
    "asylum support",
    "domestic violence",
    "safeguarding",
  ],
  "Financial & Benefits Support": [
    "debt advice",
    "benefits guidance",
    "universal credit",
    "pip",
    "housing benefit",
    "credit unions",
    "emergency grants",
  ],
  "Employment, Training & Education": [
    "job search",
    "employability",
    "skills training",
    "apprenticeships",
    "adult education",
    "literacy",
    "volunteering",
  ],
  "Community & General Support": [
    "faith-based services",
    "churches",
    "mosques",
    "temples",
    "youth clubs",
    "mentoring",
    "refugee support",
    "migrant integration",
    "community",
    "support",
    "general",
  ],
} as const;

export const useServices = () => {
  const currentPage = ref(1);
  const itemsPerPage = ref(20);
  const searchQuery = ref("");
  const selectedCategory = ref("all");
  const selectedVerification = ref("all");
  interface Response {
    total_pages: number;
    count: number;
    results: Service[];
  }

  // Fetch services from API
  const { data, isLoading, isError, refetch } = useQuery({
    // Include pagination in the key so it refetches when page/size change
    queryKey: ["services", currentPage],

    queryFn: async () => {
      const res = await https.get<Response>("v1/services/");
      console.log(res.data.results);
      return res.data.results;
    },

    staleTime: 1000 * 60 * 5,
  });

  const services = computed(() => data.value ?? []);

  // Helper function to normalize and extract categories from service
  const extractServiceCategories = (service: Service): string[] => {
    const categoriesStr = service.details.subcategories;
    if (!categoriesStr || typeof categoriesStr !== "string") return [];

    return categoriesStr
      .split(",")
      .map((c) => c.trim().toLowerCase())
      .filter(Boolean);
  };

  // Helper function to map service categories to core categories
  const mapToCoreCategories = (serviceCategories: string[]): string[] => {
    const coreCategories = new Set<string>();

    for (const [coreCategory, keywords] of Object.entries(
      CORE_SERVICE_CATEGORIES
    )) {
      const hasMatch = serviceCategories.some((serviceCategory) =>
        keywords.some(
          (keyword) =>
            serviceCategory.includes(keyword.toLowerCase()) ||
            keyword.toLowerCase().includes(serviceCategory)
        )
      );

      if (hasMatch) {
        coreCategories.add(coreCategory);
      }
    }

    return Array.from(coreCategories);
  };

  // Get services that fall under core categories only
  const coreServices = computed(() => {
    return services.value.filter((service) => {
      const serviceCategories = extractServiceCategories(service);
     
      const coreCategories = mapToCoreCategories(serviceCategories);
      return coreCategories.length > 0;
    });
  });

  // Get unique core categories from filtered services
  const categories = computed(() => {
    const categoriesSet = new Set<string>();

    coreServices.value.forEach((service) => {
      const serviceCategories = extractServiceCategories(service);
      const coreCategories = mapToCoreCategories(serviceCategories);
      coreCategories.forEach((category) => categoriesSet.add(category));
    });

    return [...Array.from(categoriesSet).sort()];
  });

  // Get unique verification statuses
  const verificationStatuses = computed(() => {
    const set = new Set<string>();
    coreServices.value.forEach((service) => {
      const v = service.details?.verification_status;
      if (v) set.add(v);
    });
    return [...Array.from(set)];
  });

  // Filter services based on search query and category
  const filteredServices = computed(() => {
    return coreServices.value.filter((service) => {
      // Search matching
      const matchesSearch =
        searchQuery.value === "" ||
        [
          service.details.name,
          service.details.description,
          service.details.org_name,
          service.details.categories,
        ].some((field) =>
          field?.toLowerCase().includes(searchQuery.value.toLowerCase())
        );

      // Category matching
      let matchesCategory = true;
      if (selectedCategory.value !== "all") {
        const serviceCategories = extractServiceCategories(service);
        const coreCategories = mapToCoreCategories(serviceCategories);
        matchesCategory = coreCategories.includes(selectedCategory.value);
      }

      // Verification matching
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

  // Reset pagination when filters change
  const resetFilters = () => {
    currentPage.value = 1;
    searchQuery.value = "";
    selectedCategory.value = "all";
    selectedVerification.value = "all";
  };

  // Get services count by category
  const getCategoryCount = (category: string) => {
    if (category === "all") return coreServices.value.length;

    return coreServices.value.filter((service) => {
      const serviceCategories = extractServiceCategories(service);
      const coreCategories = mapToCoreCategories(serviceCategories);
      return coreCategories.includes(category);
    }).length;
  };

  return {
    // Core services (filtered to only include those matching core categories)
    services: coreServices,
    paginatedServices,
    filteredServices,

    // Pagination
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    goToPage,

    // Filters
    categories,
    verificationStatuses,
    searchQuery,
    selectedCategory,
    selectedVerification,
    resetFilters,

    // Utilities
    getCategoryCount,
    mapToCoreCategories,
    extractServiceCategories,

    // API state
    isLoading,
    isError,
    refetch,

    // Constants
    CORE_SERVICE_CATEGORIES,
  };
};

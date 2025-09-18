<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";

declare global {
  interface Window {
    google: any;
  }
}

// Default centre to UK
const center = ref({ lat: 54.526, lng: -3.0 });
const zoom = ref(6);
const address = ref("");
const searchTerm = ref("");

let mapRef: any = null;
const suppressMapClick = ref(false);

// Helper: get pixel position for lat/lng on the map
function getPixelPosition(
  lat: number,
  lng: number
): { x: number; y: number } | null {
  if (!mapRef || !mapRef.$mapObject) return null;
  const map = mapRef.$mapObject;
  if (!map || !map.getProjection) return null;
  const projection = map.getProjection();
  if (!projection) return null;
  const point = projection.fromLatLngToPoint(
    new window.google.maps.LatLng(lat, lng)
  );
  // Get map bounds and size
  const scale = Math.pow(2, map.getZoom());
  const bounds = map.getBounds();
  if (!bounds) return null;
  const nw = projection.fromLatLngToPoint(bounds.getNorthEast());
  const se = projection.fromLatLngToPoint(bounds.getSouthWest());
  const x = ((point.x - se.x) * map.getDiv().offsetWidth) / (nw.x - se.x);
  const y = ((point.y - nw.y) * map.getDiv().offsetHeight) / (se.y - nw.y);
  return { x, y };
}

// Interface for service location
interface ServiceLocation {
  lat: number;
  lng: number;
}

// Interface for service data
interface Service {
  service_id: string;
  name: string;
  org_name: string;
  categories: string[];
  description: string;
  eligibility: string;
  contact: string;
  address: string;
  hours: string;
  access: string;
  evidence_links: string[];
  verification_status: string;
  review_count: number;
  avg_rating: number;
  confidence: number;
  location?: ServiceLocation;
}

// Dummy dataset with proper typing
const services = ref<Service[]>([
  {
    service_id: "svc_001",
    name: "Guy's Hospital",
    org_name: "NHS Foundation Trust",
    categories: ["Health"],
    description: "Major NHS hospital providing healthcare and specialist services.",
    eligibility: "All",
    contact: "+44 20 7188 7188",
    address: "Great Maze Pond, London SE1 9RT, UK",
    hours: "24/7",
    access: "Wheelchair accessible",
    evidence_links: ["https://www.guysandstthomas.nhs.uk"],
    verification_status: "verified",
    review_count: 340,
    avg_rating: 4.3,
    confidence: 0.95,
  },
  {
    service_id: "svc_002",
    name: "Mind in London",
    org_name: "Mind Charity",
    categories: ["Counselling"],
    description: "Mental health support, counselling, and peer groups.",
    eligibility: "Adults 18+",
    contact: "+44 20 7259 8100",
    address: "15-19 Broadway, Stratford, London E15 4BQ, UK",
    hours: "Mon–Fri 9am–6pm",
    access: "By appointment",
    evidence_links: ["https://www.mind.org.uk"],
    verification_status: "verified",
    review_count: 120,
    avg_rating: 4.6,
    confidence: 0.9,
  },
  {
    service_id: "svc_003",
    name: "City Harvest London",
    org_name: "City Harvest",
    categories: ["Food"],
    description: "Redistributes surplus food to charities and community projects.",
    eligibility: "Charity partners",
    contact: "+44 20 7041 8491",
    address: "Unit 8, Acton Park Estate, London W3 7QE, UK",
    hours: "Mon–Fri 8am–6pm",
    access: "Delivery available",
    evidence_links: ["https://www.cityharvest.org.uk"],
    verification_status: "verified",
    review_count: 65,
    avg_rating: 4.8,
    confidence: 0.92,
  },
  {
    service_id: "svc_004",
    name: "Shelter London Hub",
    org_name: "Shelter",
    categories: ["Shelter"],
    description: "Housing advice and homelessness support services.",
    eligibility: "Open to all",
    contact: "+44 345 850 4114",
    address: "88 Old Street, London EC1V 9HU, UK",
    hours: "Mon–Fri 9am–5pm",
    access: "Drop-in",
    evidence_links: ["https://england.shelter.org.uk"],
    verification_status: "verified",
    review_count: 250,
    avg_rating: 4.7,
    confidence: 0.94,
  },
  {
    service_id: "svc_005",
    name: "London Libraries",
    org_name: "London Borough Councils",
    categories: ["Education"],
    description: "Public libraries offering study spaces, books, and learning support.",
    eligibility: "All residents",
    contact: "+44 20 7983 4000",
    address: "Various locations across London",
    hours: "Mon–Sat 9am–7pm",
    access: "Open access",
    evidence_links: ["https://www.london.gov.uk"],
    verification_status: "verified",
    review_count: 500,
    avg_rating: 4.4,
    confidence: 0.9,
  },
  {
    service_id: "svc_006",
    name: "Jobcentre Plus",
    org_name: "Department for Work and Pensions",
    categories: ["Employment"],
    description: "Employment support, benefits, and job-seeking services.",
    eligibility: "Job seekers",
    contact: "+44 800 169 0190",
    address: "High Holborn, London WC1V 7PE, UK",
    hours: "Mon–Fri 9am–5pm",
    access: "Appointment preferred",
    evidence_links: ["https://www.gov.uk/contact-jobcentre-plus"],
    verification_status: "verified",
    review_count: 210,
    avg_rating: 3.8,
    confidence: 0.85,
  },
  {
    service_id: "svc_007",
    name: "Better Gym London",
    org_name: "GLL Better",
    categories: ["Sports"],
    description: "Affordable gyms, swimming pools, and fitness classes.",
    eligibility: "Membership required",
    contact: "+44 20 8317 5000",
    address: "Thomas More Square, London E1W 1YW, UK",
    hours: "Mon–Sun 6am–10pm",
    access: "Membership",
    evidence_links: ["https://www.better.org.uk"],
    verification_status: "verified",
    review_count: 310,
    avg_rating: 4.2,
    confidence: 0.9,
  },
  {
    service_id: "svc_008",
    name: "Recycle for London",
    org_name: "Mayor of London",
    categories: ["Environment"],
    description: "Recycling services and sustainability initiatives across London.",
    eligibility: "All residents",
    contact: "+44 20 7983 4000",
    address: "City Hall, The Queen's Walk, London SE1 2AA, UK",
    hours: "Mon–Fri 9am–5pm",
    access: "Public access",
    evidence_links: ["https://www.recycleforlondon.com"],
    verification_status: "verified",
    review_count: 95,
    avg_rating: 4.5,
    confidence: 0.88,
  },
  {
    service_id: "svc_009",
    name: "Transport for London",
    org_name: "TfL",
    categories: ["Transport"],
    description: "Public transport services including buses, trains, and tube.",
    eligibility: "All passengers",
    contact: "+44 343 222 1234",
    address: "55 Broadway, London SW1H 0BD, UK",
    hours: "24/7",
    access: "Universal",
    evidence_links: ["https://tfl.gov.uk"],
    verification_status: "verified",
    review_count: 1000,
    avg_rating: 4.1,
    confidence: 0.95,
  },
  {
    service_id: "svc_010",
    name: "London Food Bank",
    org_name: "Trussell Trust",
    categories: ["Food"],
    description: "Emergency food parcels and community food support.",
    eligibility: "Referral required",
    contact: "+44 20 3857 3000",
    address: "St. Luke’s Church, Holloway, London N7 9JE, UK",
    hours: "Tue–Sat 10am–4pm",
    access: "Referral only",
    evidence_links: ["https://www.trusselltrust.org"],
    verification_status: "verified",
    review_count: 180,
    avg_rating: 4.9,
    confidence: 0.93,
  },
]);



const selectedService = ref<Record<string, any> | null>(null);

// computed filtered services based on searchTerm
const filteredServices = computed(() => {
  const q = (searchTerm.value || "").toLowerCase().trim();
  if (!q) return services.value;
  return services.value.filter((s) => {
    const hay = (
      (s.name || "") +
      " " +
      (s.org_name || "") +
      " " +
      (s.address || "") +
      " " +
      (Array.isArray(s.categories) ? s.categories.join(" ") : "")
    ).toLowerCase();
    return hay.includes(q);
  });
});

// Services that have a geocoded location (used for rendering markers)
const filteredServicesWithLocation = computed(() =>
  filteredServices.value.filter((s) => s.location)
);

// Fit map to show all locations in an array
function fitBoundsForLocations(locs: ServiceLocation[]) {
  if (!locs || locs.length === 0 || !window.google?.maps) {
    console.log("No locations to fit bounds to or Google Maps not ready");
    return;
  }

  try {
    const bounds = new window.google.maps.LatLngBounds();

    locs.forEach((loc) => {
      if (loc && typeof loc.lat === "number" && typeof loc.lng === "number") {
        bounds.extend(new window.google.maps.LatLng(loc.lat, loc.lng));
      }
    });

    if (!bounds.isEmpty()) {
      if (mapRef?.$mapObject?.fitBounds) {
        console.log("Fitting bounds to locations");
        mapRef.$mapObject.fitBounds(bounds);
      } else if (mapRef?.$mapObject?.panTo) {
        console.log("Falling back to pan to first location");
        mapRef.$mapObject.panTo(locs[0]);
      }
    } else {
      console.log("No valid locations to fit bounds to");
    }
  } catch (e) {
    console.error("Error fitting bounds:", e);
  }
}

// Return a data-URL SVG icon string based on service category/type
function getIconForService(svc: string): string {
  const color = "#10B981"; // Green color for all markers

  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'>
    <path fill='${color}' d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>`;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// Geocode an address string using google maps geocoder
async function geocodeAddress(addr: string) {
  if (!addr || typeof window === "undefined") return null;

  // Ensure google maps is loaded and ready
  if (!window.google?.maps?.Geocoder || !googleMapsReady.value) {
    console.warn("Google Maps not ready yet");
    return null;
  }

  try {
    const geocoder = new window.google.maps.Geocoder();

    const response = await new Promise((resolve, reject) => {
      geocoder.geocode({ address: addr }, (results: any, status: any) => {
        if (status === "OK" && results?.[0]) {
          resolve(results[0]);
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      });
    });

    const result = response as {
      geometry: { location: { lat(): number; lng(): number } };
    };
    const location = result.geometry.location;

    return {
      lat: location.lat(),
      lng: location.lng(),
    };
  } catch (error) {
    console.error(`Error geocoding address "${addr}":`, error);
    return null;
  }
}

// Public method: set map center by address (call when user selects a company)
async function centerMapOnAddress(addr: string) {
  const loc = await geocodeAddress(addr);
  if (loc) {
    center.value = loc;
    zoom.value = 14;
    // If map ref available, pan to
    try {
      if (mapRef && mapRef.panTo) mapRef.panTo(loc);
    } catch (e) {
      // ignore
    }
  }
}

// Called when user selects a service/company
async function selectService(svc: Record<string, any>) {
  // Prevent the map click handler from immediately closing the popup
  suppressMapClick.value = true;
  // Small timeout to allow marker/map events to settle
  setTimeout(() => (suppressMapClick.value = false), 300);

  selectedService.value = svc;
  if (svc?.address) {
    address.value = svc.address;
    await centerMapOnAddress(svc.address);
  }
}

// Close popup when clicking on the map background
function onMapClick() {
  // If we recently selected a marker/sidebar item, ignore this map click
  if (suppressMapClick.value) return;
  selectedService.value = null;
}

// Watch for when Google Maps is loaded and ready
const googleMapsReady = ref(false);

// Function to check if Google Maps is fully loaded and ready
function isGoogleMapsReady(): boolean {
  return Boolean(
    window.google?.maps?.Geocoder &&
      mapRef?.$mapObject?.getProjection &&
      mapRef?.$mapObject?.getBounds
  );
}

// Watch for when map reference is available
watch(
  () => mapRef?.$mapObject,
  async (newRef) => {
    console.log("Map reference changed:", Boolean(newRef));
    if (newRef && !googleMapsReady.value) {
      // Wait a moment for map to initialize fully
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (isGoogleMapsReady()) {
        console.log("Google Maps is ready, starting geocoding...");
        googleMapsReady.value = true;
        await geocodeAllServices();
      } else {
        console.log("Google Maps not fully ready yet");
      }
    }
  }
);

onMounted(async () => {
  console.log("Component mounted, checking Google Maps...");
  // Wait a moment for everything to initialize
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (isGoogleMapsReady() && !googleMapsReady.value) {
    console.log("Google Maps ready on mount, starting geocoding...");
    googleMapsReady.value = true;
    await geocodeAllServices();
  } else {
    console.log("Waiting for Google Maps to be ready...");
  }
});

// Geocode all services and store location on each service record
async function geocodeAllServices() {
  console.log("Starting geocoding process...");
  console.log("Google Maps ready:", window.google?.maps !== undefined);
  console.log("Services to geocode:", services.value.length);

  for (const svc of services.value) {
    if (!svc.location && svc.address) {
      console.log("Geocoding address:", svc.address);
      try {
        const loc = await geocodeAddress(svc.address);
        if (loc) {
          console.log("Successfully geocoded:", loc);
          svc.location = loc;
        } else {
          console.log("Failed to geocode address:", svc.address);
        }
      } catch (e) {
        console.error("Error geocoding service:", svc.name, e);
      }
    } else {
      console.log("Service already has location or no address:", svc.name);
    }
  }

  // After geocoding, fit to all markers
  const locs = services.value
    .filter((s): s is Service & { location: ServiceLocation } =>
      Boolean(s.location)
    )
    .map((s) => s.location);

  console.log("Total locations after geocoding:", locs.length);
  if (locs.length) {
    console.log("Fitting bounds to locations:", locs);
    fitBoundsForLocations(locs);
  }
}

// When filteredServices change, update markers and fit bounds
watch(
  () => filteredServices.value.map((s) => s.service_id).join(","),
  () => {
    const locs = filteredServices.value
      .filter((s): s is Service & { location: ServiceLocation } =>
        Boolean(s.location)
      )
      .map((s) => s.location);

    console.log("Filtered services changed, locations:", locs.length);
    if (locs.length) fitBoundsForLocations(locs);
  }
);
</script>

<template>
  <div class="w-full relative h-screen flex flex-col">
    <!-- Header -->
    <header class="w-full px-4 py-6">
      <h1 class="text-2xl font-bold mb-4">Find Support</h1>
      <div class="relative">
        <div
          class="absolute inset-y-0 left-3 flex items-center pointer-events-none"
        >
          <svg
            class="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          v-model="searchTerm"
          placeholder="Search services..."
          class="w-full bg-white text-black outline-0 rounded-lg pl-10 pr-4 py-3 text-base"
        />
      </div>
      <p class="mt-2 text-sm">{{ filteredServices.length }} services found</p>
    </header>

    <!-- Selected details -->
    <div
      v-if="selectedService && selectedService.location"
      class="bottom-0 w-full h-full p-6 bg-white left-0 text-black"
    >
      <!-- Header with close button -->
      <div class="flex items-start justify-between mb-2">
        <div class="flex items-center gap-2">
          <div
            class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-lg"
          >
            {{ selectedService.name.charAt(0) }}
          </div>
          <div class="flex-1">
            <div class="flex flex-wrap items-center gap-2">
              <div class="font-semibold text-base">
                {{ selectedService.name }}
              </div>
              <div
                v-if="selectedService.verification_status === 'verified'"
                class="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs rounded"
              >
                Community Verified ✓
              </div>
            </div>
          </div>
        </div>
        <button
          @click="selectedService = null"
          class="text-gray-400 hover:text-gray-600"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <!-- Rating -->
      <div class="flex items-center gap-2 mb-3">
        <div class="flex items-center">
          <template v-for="i in 5" :key="i">
            <svg
              class="w-4 h-4"
              :class="
                i <= Math.round(selectedService.avg_rating || 0)
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              "
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              />
            </svg>
          </template>
        </div>
        <span class="text-sm text-gray-600"
          >{{ selectedService.avg_rating?.toFixed(1) || "—" }} ({{
            selectedService.review_count || 0
          }}
          reviews)</span
        >
      </div>

      <!-- Description -->
      <p class="text-sm text-gray-700 mb-4">
        {{ selectedService.description }}
      </p>

      <!-- Eligibility -->
      <div class="mb-4">
        <div class="text-sm font-medium mb-1">Eligibility</div>
        <div class="text-sm text-gray-600">
          {{ selectedService.eligibility }}
        </div>
      </div>

      <!-- Hours -->
      <div
        class="bg-green-50 text-green-800 text-sm px-3 py-2 rounded mb-4"
        v-if="selectedService.hours?.toLowerCase()?.includes('24')"
      >
        Open 24 Hours
      </div>
      <div v-else class="mb-4">
        <div class="text-sm text-gray-600">{{ selectedService.hours }}</div>
      </div>

      <!-- Contact -->
      <div class="mb-4">
        <div class="text-sm font-medium mb-2">Contact</div>
        <div class="text-sm text-gray-600 mb-1">
          {{ selectedService.address }}
        </div>
      </div>

      <!-- Action buttons -->
      <div class="grid grid-cols-2 gap-2">
        <button
          class="bg-blue-500 text-white rounded-[8px] flex items-center justify-center gap-2 py-3 text-sm hover:bg-blue-600"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Directions
        </button>
        <button
          class="bg-green-500 text-white rounded-[8px] flex items-center justify-center gap-2 py-3 text-sm hover:bg-green-600"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          Call
        </button>
        <button
          class="border border-gray-300 text-gray-700 rounded-[8px] flex items-center justify-center gap-2 py-3 text-sm hover:bg-gray-50"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Email
        </button>
        <button
          class="border border-gray-300 text-gray-700 rounded-[8px] flex items-center justify-center gap-2 py-3 text-sm hover:bg-gray-50"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
            />
          </svg>
          Website
        </button>
      </div>
    </div>

    <!-- Map container -->
    <main class="flex-1">
      <GMapMap
        class="w-full h-full"
        :center="center"
        :zoom="zoom"
        style="width: 100%; height: 100%"
        v-bind:ref="(r: any) => (mapRef = r)"
        @click="onMapClick"
      >
        <!-- Render a marker per filtered service -->
        <div v-for="svc in filteredServices" :key="svc.service_id">
          <GMapMarker
            v-if="svc.location"
            :position="svc.location"
            :icon="getIconForService(svc.categories[0] as string)"
            @click="selectService(svc)"
          />
        </div>

        <!-- Info window for selected service -->
        <!-- Custom popup for selected service -->

        <!-- Small center indicator (optional) -->
        <GMapMarker :position="center" />
      </GMapMap>
    </main>

    <!-- Bottom Navigation -->
    <nav class="bg-white border-t flex items-center justify-around py-2">
      <button class="flex flex-col items-center p-2 text-blue-600">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        <span class="text-xs mt-1">Map</span>
      </button>
      <button class="flex flex-col items-center p-2 text-gray-600">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span class="text-xs mt-1">Add Service</span>
      </button>
      <button class="flex flex-col items-center p-2 text-gray-600">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
        <span class="text-xs mt-1">List</span>
      </button>
      <button class="flex flex-col items-center p-2 text-gray-600">
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <span class="text-xs mt-1">Learn</span>
      </button>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { Icon } from "@iconify/vue";
import { UseMapServices } from "./hooks";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../../../components/ui/dialog";

declare global {
  interface Window {
    google: any;
  }
}

interface GooglePlace {
  geometry?: {
    location: {
      lat: () => number;
      lng: () => number;
    }
  };
  formatted_address?: string;
  name?: string;
  place_id?: string;
}

interface MapClickEvent {
  latLng: {
    lat: () => number;
    lng: () => number;
  }
}

// Default centre to UK
const center = ref({ lat: 54.526, lng: -3.0 });
const userLocation = ref<{ lat: number; lng: number } | null>(null);
const zoom = ref(6);
const locationDialogOpen = ref(false);
const userAddress = ref<string>("");
const selectedPlaceLocation = ref<{ lat: number; lng: number } | null>(null);
const mapSelectedLocation = ref<{ lat: number; lng: number } | null>(null);
const mapSelectedAddress = ref<string>("");
const address = ref("");
const searchTerm = ref("");
const autocompleteInput = ref<HTMLInputElement | null>(null);
let autocomplete: any = null;

// Function to initialize Google Places Autocomplete
function initializeAutocomplete() {
  if (!autocompleteInput.value || !window.google?.maps?.places) {
    console.warn("Google Maps Places not available or input not found");
    return;
  }

  if (!autocomplete) {
    try {
      autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteInput.value,
        {
          types: ["address"],
          fields: ["formatted_address", "geometry", "name"],
          componentRestrictions: { country: "GB" }, // Restrict to UK addresses
        }
      );
      console.log(autocomplete.getPlace());

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        console.log("Place selected:", place);

        if (!place?.geometry?.location) {
          console.warn("No location data for selected place");
          return;
        }

        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        selectedPlaceLocation.value = { lat, lng };
        userAddress.value = place.formatted_address || "";

        console.log("Location updated:", {
          lat,
          lng,
          address: userAddress.value,
        });
      });
    } catch (error) {
      console.error("Error initializing Places Autocomplete:", error);
    }
  }
}

let mapRef: any = null;
const suppressMapClick = ref(false);

const { data: services } = UseMapServices();

const selectedService = ref<Record<string, any> | null>(null);

// Fit map to show all locations in an array
function fitBoundsForLocations(locs: Array<{ lat: number; lng: number }>) {
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

// Build marker icon by color
function getMarkerIcon(color: string): string {
  const svg = `
  <svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24'>
    <path fill='${color}' d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

// Map category text to a color
function getCategoryColor(categories: string | undefined): string {
  if (!categories || typeof categories !== "string") return "#3B82F6"; // blue default
  const first =
    categories.split(",").map((c) => c.trim().toLowerCase())[0] || "";
  if (first.includes("food") || first.includes("kitchen")) return "#10B981"; // green
  if (first.includes("shelter") || first.includes("housing")) return "#8B5CF6"; // violet
  if (first.includes("clothing") || first.includes("hygiene")) return "#F59E0B"; // amber
  if (first.includes("addiction") || first.includes("recovery"))
    return "#EC4899"; // pink
  if (first.includes("mental") || first.includes("wellbeing")) return "#06B6D4"; // cyan
  if (
    first.includes("health") ||
    first.includes("medical") ||
    first.includes("clinic")
  )
    return "#22C55E"; // emerald
  if (first.includes("legal") || first.includes("justice")) return "#0EA5E9"; // sky
  if (
    first.includes("benefit") ||
    first.includes("finance") ||
    first.includes("debt")
  )
    return "#A855F7"; // purple
  if (
    first.includes("employment") ||
    first.includes("education") ||
    first.includes("training")
  )
    return "#6366F1"; // indigo
  return "#3B82F6"; // blue fallback
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

// Reverse geocode lat/lng to a human-readable address
async function reverseGeocode(
  lat: number,
  lng: number
): Promise<string | null> {
  if (!window.google?.maps?.Geocoder || !googleMapsReady.value) return null;
  try {
    const geocoder = new window.google.maps.Geocoder();
    const result = await new Promise((resolve, reject) => {
      geocoder.geocode(
        { location: { lat, lng } },
        (results: any, status: any) => {
          if (status === "OK" && results?.[0]) resolve(results[0]);
          else reject(new Error(`Reverse geocoding failed: ${status}`));
        }
      );
    });
    const r = result as { formatted_address?: string };
    return r.formatted_address ?? null;
  } catch (e) {
    return null;
  }
}

// Persist/restore user location and address
const STORAGE_KEYS = {
  location: "user-location",
  address: "user-address",
} as const;

function saveUserLocationToStorage(
  loc: { lat: number; lng: number } | null,
  address?: string | null
) {
  if (typeof window === "undefined") return;
  try {
    if (loc) {
      localStorage.setItem(STORAGE_KEYS.location, JSON.stringify(loc));
    }
    if (address != null) {
      localStorage.setItem(STORAGE_KEYS.address, address);
    }
  } catch {}
}

function loadUserLocationFromStorage() {
  if (typeof window === "undefined") return;
  try {
    const locStr = localStorage.getItem(STORAGE_KEYS.location);
    const addrStr = localStorage.getItem(STORAGE_KEYS.address);
    if (locStr) {
      const parsed = JSON.parse(locStr);
      if (
        parsed &&
        typeof parsed.lat === "number" &&
        typeof parsed.lng === "number"
      ) {
        userLocation.value = parsed;
        center.value = parsed;
        zoom.value = 13;
      }
    }
    if (addrStr) userAddress.value = addrStr;
  } catch {}
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
  // Load any stored user location/address
  loadUserLocationFromStorage();
  // Try to get user geolocation (red marker)
  if (typeof navigator !== "undefined" && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        userLocation.value = loc;
        center.value = loc;
        zoom.value = 13;
        // Attempt reverse geocode for header display
        reverseGeocode(loc.lat, loc.lng).then((addr) => {
          if (addr) userAddress.value = addr;
          // Persist latest known location and address
          saveUserLocationToStorage(
            userLocation.value,
            userAddress.value || null
          );
        });
        // Also persist immediately even if address not yet resolved
        saveUserLocationToStorage(userLocation.value, null);
      },
      () => {
        // ignore geolocation errors
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }
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
  if (services.value) {
    for (const svc of services.value.results) {
      if (!svc.details.location && svc.details.address) {
        try {
          const loc = await geocodeAddress(svc.details.address);
          if (loc) {
            svc.details.location = loc;
          } else {
            console.log("Failed to geocode address:", svc.details.address);
          }
        } catch (e) {
          console.error("Error geocoding service:", svc.details.name, e);
        }
      } else {
        console.log(
          "Service already has location or no address:",
          svc.details.name
        );
      }
    }

    // After geocoding, fit to all markers
    const locs = services.value.results
      .map((s) => s.details.location)
      .filter((loc): loc is { lat: number; lng: number } => Boolean(loc));

    console.log("Total locations after geocoding:", locs.length);
    if (locs.length) {
      console.log("Fitting bounds to locations:", locs);
      fitBoundsForLocations(locs);
    }
  }
}

// When services load/refresh and Google Maps is ready, geocode and render markers
watch(
  () => services.value?.results,
  async (newResults) => {
    if (
      googleMapsReady.value &&
      Array.isArray(newResults) &&
      newResults.length
    ) {
      await geocodeAllServices();
    }
  },
  { immediate: false }
);

// Handle place selection
async function handlePlaceChanged(place) {
  console.log("Place changed handler called with:", place);
  
  if (!place?.geometry?.location) {
    console.warn("No geometry in place object");
    return;
  }

  const lat = place.geometry.location.lat();
  const lng = place.geometry.location.lng();
  
  console.log("Location found:", { lat, lng });

  selectedPlaceLocation.value = { lat, lng };
  userAddress.value = place.formatted_address || "";
  
  if (mapRef?.$mapObject) {
    mapRef.$mapObject.setCenter({ lat, lng });
    mapRef.$mapObject.setZoom(15);
  }
}

// Initialize the place autocomplete
async function initPlaceAutocomplete() {
  if (!autocompleteInput.value || !window.google?.maps?.places) {
    console.warn("Required dependencies not available");
    return;
  }

  try {
    const element = new window.google.maps.places.PlaceAutocompleteElement({
      inputElement: autocompleteInput.value,
      types: ["address"],
      fields: ["formatted_address", "geometry", "name", "place_id"]
    });

    element.addEventListener("place_changed", async () => {
      const place = await element.getPlace();
      handlePlaceChanged(place);
    });

    return element;
  } catch (error) {
    console.error("Error initializing PlaceAutocompleteElement:", error);
    return null;
  }
}

function openLocationDialog() {
  locationDialogOpen.value = true;
  if (window.google && autocompleteInput.value) {
    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteInput.value,
      {
        types: ["(cities)"], // or 'geocode' for all addresses
        // componentRestrictions: { country: 'ng' }, // restrict to Nigeria if needed
      }
    );
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      console.log("Selected place:", place);
      // Optionally, emit or use the place object for more details
    });
  }
}

async function useSelectedAddress() {
  console.log(searchTerm.value);
  // Use map clicked location first, fallback to typed address
  if (!selectedPlaceLocation.value && !mapSelectedLocation.value) {
    console.log("No location selected");
    return;
  }

  // Priority: use map location if available, otherwise use typed address
  const loc = mapSelectedLocation.value || selectedPlaceLocation.value;
  let addr = mapSelectedAddress.value || userAddress.value;

  if (!loc) return;

  userLocation.value = loc;
  center.value = loc;
  zoom.value = 14;

  // If we don't have an address yet, try to get one
  if (!addr) {
    addr = await reverseGeocode(loc.lat, loc.lng);
  }
  if (addr) userAddress.value = addr;

  // Save both location and address
  saveUserLocationToStorage(userLocation.value, userAddress.value || null);

  // Close dialog and reset selection state
  locationDialogOpen.value = false;
  mapSelectedLocation.value = null;
  mapSelectedAddress.value = "";
  selectedPlaceLocation.value = null;
}

async function useCurrentLocation() {
  if (userLocation.value) {
    center.value = userLocation.value;
    zoom.value = 14;
    const addr = await reverseGeocode(
      userLocation.value.lat,
      userLocation.value.lng
    );
    if (addr) userAddress.value = addr;
  }
  saveUserLocationToStorage(
    userLocation.value || null,
    userAddress.value || null
  );
  locationDialogOpen.value = false;
}
</script>

<template>
  <div class="w-full relative h-screen flex flex-col">
    <!-- Header -->
    <header class="w-full px-4 py-6 bg-[#12A0D8] text-white space-y-4">
      <button class="flex gap-1 items-center" @click="openLocationDialog">
        <Icon icon="bx:map" width="20" height="20" style="color: #fff" />
        <p class="underline line-clamp-1">
          {{
            userAddress ||
            (userLocation
              ? `${userLocation.lat.toFixed(5)}, ${userLocation.lng.toFixed(5)}`
              : "Set your location")
          }}
        </p>
      </button>
      <div class="flex items-center justify-between">
        <div class="space-y-2 flex-1">
          <h1 class="text-2xl font-bold">Find Services</h1>
          <p>Find verified support in your area</p>
        </div>
        <div class="flex gap-4">
          <div
            class="w-[38px] h-[38px] bg-[#FAFAED] rounded-full flex items-center justify-center"
          ></div>
          <div
            class="w-[38px] h-[38px] bg-[#FAFAED] rounded-full flex items-center justify-center"
          ></div>
        </div>
      </div>
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
        @click.native="
          async (e) => {
            if (locationDialogOpen) {
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();
              mapSelectedLocation = { lat, lng };
              mapSelectedAddress = (await reverseGeocode(lat, lng)) || '';
            }
          }
        "
      >
        <!-- User current location marker (red) -->
        <GMapMarker
          v-if="userLocation"
          :position="userLocation"
          :icon="getMarkerIcon('#EF4444')"
          @click="openLocationDialog"
        />

        <!-- Render a marker per service with category-based color -->
        <div v-for="svc in services?.results" :key="svc.details.service_id">
          <GMapMarker
            v-if="svc.details.location"
            :position="svc.details.location"
            :icon="getMarkerIcon(getCategoryColor(svc.details.categories))"
            @click="selectService(svc)"
          />
        </div>

        <!-- Small center indicator (optional when no user location) -->
        <GMapMarker v-if="!userLocation" :position="center" />

        <!-- Selected location marker in dialog -->
        <GMapMarker
          v-if="
            locationDialogOpen && (mapSelectedLocation || selectedPlaceLocation)
          "
          :position="mapSelectedLocation || selectedPlaceLocation"
          :icon="getMarkerIcon('#12A0D8')"
        />
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

  <!-- Location selection dialog -->
  <Dialog v-model:open="locationDialogOpen">
    <DialogContent class="sm:max-w-[600px] p-6 rounded-[16px]">
      <DialogHeader>
        <DialogTitle>Set your address</DialogTitle>
        <DialogDescription>
          Type an address or use your current location.
        </DialogDescription>
      </DialogHeader>

      <div class="space-y-3">
        <!-- Google Places Autocomplete -->
        <div class="relative">
          <input
            type="text"
            class="mt-0 w-full px-3 py-2 rounded border border-gray-300 transition"
            placeholder="Search for a city or area"
            id="searchTextField"
            ref="autocompleteInput"
            v-model="searchTerm"
            @focus="initializeAutocomplete"
          />
          <!-- <input
            ref="autocompleteInput"
            type="text"
            placeholder="Search for an address..."
            class="border border-[#757578] p-4 rounded-[8px] w-full"
            @focus="initializeAutocomplete"
            v-model="searchTerm"
          /> -->
        </div>
        <div class="text-sm text-gray-600">
          Current: {{ userAddress || "—" }}
        </div>
        <div
          v-if="mapSelectedLocation || selectedPlaceLocation"
          class="text-sm text-green-600"
        >
          Selected: {{ mapSelectedAddress || userAddress }}
        </div>
      </div>

      <DialogFooter class="mt-4 flex gap-2">
        <button
          class="bg-[#12A0D8] text-white rounded-md px-3 py-2"
          @click="useSelectedAddress"
        >
          Use selected location
        </button>
        <button
          class="border border-gray-300 rounded-md px-3 py-2"
          @click="useCurrentLocation"
        >
          Use current location
        </button>
        <DialogClose as-child>
          <button class="px-3 py-2">Cancel</button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

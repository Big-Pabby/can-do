<template>
  <div class="relative w-full h-full md:rounded-xl">
    <div ref="mapRef" class="w-full h-full md:rounded-xl"></div>

    <!-- Enhanced Directions Info Card -->
    <div v-if="routeDistance && routeDuration" class="directions-card">
      <button
        @click="cancelDirections"
        class="close-btn"
        title="Cancel directions"
      >
        <Icon icon="mdi:close" class="w-5 h-5" />
      </button>

      <div class="directions-content">
        <!-- Route Information -->
        <div class="route-info">
          <div class="info-row">
            <Icon
              icon="mdi:map-marker-distance"
              class="w-5 h-5 text-gray-500"
            />
            <div class="info-content">
              <span class="info-label">Distance</span>
              <span class="info-value">{{ routeDistance }}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="info-row">
            <Icon icon="mdi:clock-outline" class="w-5 h-5 text-gray-500" />
            <div class="info-content">
              <span class="info-label">Duration</span>
              <span class="info-value">{{ routeDuration }}</span>
            </div>
          </div>
        </div>

        <!-- Travel Mode Selector -->
        <div class="travel-mode-selector">
          <button
            v-for="mode in travelModes"
            :key="mode.value"
            @click="changeTravelMode(mode.value)"
            :class="['mode-btn', { active: travelMode === mode.value }]"
            :title="mode.label"
          >
            <Icon :icon="mode.icon" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { Icon } from "@iconify/vue";
import type { Service } from "#imports";
import { useLocationStore } from "~/store/location";

declare global {
  interface Window {
    google: {
      maps: any;
    };
  }
}

const props = defineProps<{
  services: Service[];
  initialLat?: number;
  initialLng?: number;
  origin?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
  preserveView?: boolean;
}>();

const emit = defineEmits<{
  (
    e: "locationSelected",
    coords: { lat: number; lng: number; address: string; district: string }
  ): void;
  (e: "zoom-changed", zoom: number): void;
  (
    e: "bounds-changed",
    bounds: { north: number; south: number; east: number; west: number }
  ): void;
}>();

let map: any = null;
let directionsRenderer: any = null;
let directionsService: any = null;
let originMarker: any = null;
let destinationMarker: any = null;
let currentOpenInfoWindow: any = null; // Track currently open info window
const mapRef = ref<HTMLDivElement | null>(null);
const lat = ref(0);
const lng = ref(0);
const address = ref("");
const district = ref("");
const routeDistance = ref<string>("");
const routeDuration = ref<string>("");
const travelMode = ref<string>("DRIVING");
const isInitialized = ref(false);

// Store existing markers to update them instead of recreating
const serviceMarkersMap = new Map();

const travelModes = [
  { value: "TRANSIT", label: "Transit", icon: "mdi:bus" },
  { value: "BICYCLING", label: "Bicycling", icon: "mdi:bike" },
  { value: "WALKING", label: "Walking", icon: "mdi:walk" },
  { value: "DRIVING", label: "Driving", icon: "mdi:car" },
];

const getTransportIcon = (mode: string) => {
  const modeMap: Record<string, string> = {
    DRIVING: "mdi:car",
    WALKING: "mdi:walk",
    BICYCLING: "mdi:bike",
    TRANSIT: "mdi:bus",
  };
  return modeMap[mode] || "mdi:car";
};

const cancelDirections = () => {
  if (directionsRenderer) {
    directionsRenderer.setDirections({ routes: [] });
  }
  if (originMarker) originMarker.setMap(null);
  if (destinationMarker) destinationMarker.setMap(null);
  routeDistance.value = "";
  routeDuration.value = "";
  useLocationStore().setSelectedServiceLocation(null);
};

const changeTravelMode = (mode: string) => {
  travelMode.value = mode;
  if (props.origin && props.destination) {
    calculateRoute(props.origin, props.destination, mode, serviceMarkersMap);
  }
};

const calculateRoute = (
  origin: any,
  destination: any,
  mode: string = "DRIVING",
  markersMap: any
) => {
  if (!directionsService || !directionsRenderer) return;

  directionsService.route(
    {
      origin,
      destination,
      travelMode: mode,
    },
    (result: any, status: string) => {
      if (status === "OK") {
        directionsRenderer.setDirections(result);
        const leg = result.routes[0]?.legs[0];
        routeDistance.value = leg?.distance?.text || "";
        routeDuration.value = leg?.duration?.text || "";

        // Clear existing custom markers
        if (originMarker) originMarker.setMap(null);
        if (destinationMarker) destinationMarker.setMap(null);

        // Create custom origin marker (Point A)
        originMarker = new google.maps.Marker({
          position: leg.start_location,
          map,
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
            scaledSize: new google.maps.Size(40, 40),
          },
          title: "Your Location",
          label: {
            text: "A",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
          },
          zIndex: 10001,
          optimized: false,
        });

        // Get the actual destination coordinates that were passed
        const destLat =
          typeof destination.lat === "function"
            ? destination.lat()
            : destination.lat;
        const destLng =
          typeof destination.lng === "function"
            ? destination.lng()
            : destination.lng;

        // Find the service by coordinates with a more lenient matching
        let serviceData = null;
        let minDistance = Infinity;

        for (const [key, value] of markersMap.entries()) {
          const [lat, lng] = key.split(",").map(Number);
          const distance = Math.sqrt(
            Math.pow(lat - destLat, 2) + Math.pow(lng - destLng, 2)
          );

          if (distance < minDistance && distance < 0.001) {
            minDistance = distance;
            serviceData = value;
          }
        }

        // Create custom destination marker (Point B) at the exact service location
        if (serviceData) {
          const servicePosition = serviceData.marker.getPosition();

          destinationMarker = new google.maps.Marker({
            position: servicePosition,
            map,
            icon: {
              url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
              scaledSize: new google.maps.Size(40, 40),
            },
            title: "Destination: " + serviceData.service.details.name,
            label: {
              text: "B",
              color: "white",
              fontWeight: "bold",
              fontSize: "16px",
            },
            zIndex: 10000,
            optimized: false,
          });

          destinationMarker.addListener("click", () => {
            // Close any currently open info window
            if (currentOpenInfoWindow) {
              currentOpenInfoWindow.close();
            }
            serviceData.info.open(map, serviceData.marker);
            currentOpenInfoWindow = serviceData.info;
          });

          serviceData.marker.setZIndex(9999);
        }
      } else {
        directionsRenderer.setDirections({ routes: [] });
        routeDistance.value = "";
        routeDuration.value = "";
        if (originMarker) originMarker.setMap(null);
        if (destinationMarker) destinationMarker.setMap(null);
        console.warn("Directions request failed:", status);
      }
    }
  );
};

// Update markers when services change
const updateMarkers = () => {
  if (!map || !isInitialized.value) return;

  const categoryColors: Record<string, string> = {
    "Food & Nutrition":
      "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
    "Shelter & Housing":
      "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
    "Clothing & Essentials":
      "http://maps.google.com/mapfiles/ms/icons/purple-dot.png",
    "Addiction & Recovery":
      "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
    "Mental Health & Wellbeing":
      "http://maps.google.com/mapfiles/ms/icons/pink-dot.png",
    "Health & Medical":
      "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    "Justice & Legal Support":
      "http://maps.google.com/mapfiles/ms/icons/ltblue-dot.png",
    "Financial & Benefits Support":
      "http://maps.google.com/mapfiles/ms/icons/brown-dot.png",
    "Employment, Training & Education":
      "http://maps.google.com/mapfiles/ms/icons/ltgreen-dot.png",
    "Community & General Support":
      "http://maps.google.com/mapfiles/ms/icons/grey-dot.png",
  };

  // Track which services are in the new list
  const currentServiceKeys = new Set<string>();

  props.services.forEach((service) => {
    const serviceLat = Number(service.details.lat);
    const serviceLng = Number(service.details.lng);

    if (!isNaN(serviceLat) && !isNaN(serviceLng)) {
      const key = `${serviceLat},${serviceLng}`;
      currentServiceKeys.add(key);

      // Skip if marker already exists
      if (serviceMarkersMap.has(key)) {
        return;
      }

      const category =
        service.details.categories || "Community & General Support";
      const icon =
        categoryColors[category] ||
        categoryColors["Community & General Support"];

      const marker = new google.maps.Marker({
        position: { lat: serviceLat, lng: serviceLng },
        map,
        title: service.details.name,
        icon,
      });

      const info = new google.maps.InfoWindow({
        content: `
          <div style="max-width: 400px" class="space-y-3">
            <h4 class="font-medium text-[#111827]">${service.details.name}</h4>
            <em>${category}</em>
            <div class="space-y-1">
              <p class="text-sm text-[#6B7280] line-clamp-1">${service.details.address}</p>
              <p class="text-sm text-[#6B7280] line-clamp-1">${service.details.hours}</p>
            </div>
            <div class="flex gap-3 flex-wrap justify-between">
              <button id="call-btn-${service.id}" class="bg-[#12A0D8] rounded-full py-2 px-3.5 text-sm text-white">
                Call Now
              </button>
              <button id="directions-btn-${service.id}" class="border border-[#FE4D67] rounded-full py-2 px-3.5 text-sm text-[#FE4D67]">
                Directions
              </button>
              <a id="details-btn-${service.id}" href="/explore/${service.id}" class="border border-[#B0B72E] rounded-full py-2 px-3.5 text-sm text-[#B0B72E] no-underline inline-block text-center">
                Details
              </a>
            </div>
          </div>
        `,
      });

      serviceMarkersMap.set(key, { marker, info, service });

      marker.addListener("click", () => {
        // Close the previously opened info window
        if (currentOpenInfoWindow) {
          currentOpenInfoWindow.close();
        }

        // Open the new info window
        info.open(map, marker);

        // Update the reference to the currently open window
        currentOpenInfoWindow = info;

        google.maps.event.addListenerOnce(info, "domready", () => {
          const directionsBtn = document.getElementById(
            `directions-btn-${service.id}`
          );
          if (directionsBtn) {
            directionsBtn.addEventListener("click", () => {
              if (props.origin?.lat && props.origin.lng) {
                calculateRoute(
                  { lat: props.origin.lat, lng: props.origin.lng },
                  { lat: serviceLat, lng: serviceLng },
                  travelMode.value,
                  serviceMarkersMap
                );
                info.close();
                currentOpenInfoWindow = null; // Clear reference when closed
              } else {
                alert("Please select your location on the map first.");
              }
            });
          }

          const callBtn = document.getElementById(`call-btn-${service.id}`);
          if (callBtn && service.details.phone) {
            callBtn.addEventListener("click", () => {
              window.location.href = `tel:${service.details.phone}`;
            });
          }

          const detailsBtn = document.getElementById(
            `details-btn-${service.id}`
          );
          if (detailsBtn) {
            detailsBtn.addEventListener("click", (e) => {
              e.preventDefault();
              navigateTo(`/explore/${service.id}`);
            });
          }
        });
      });

      // Listen for info window close event to clear reference
      google.maps.event.addListener(info, "closeclick", () => {
        currentOpenInfoWindow = null;
      });
    }
  });

  // Remove markers that are no longer in the services list (optional - only if you want to clean up)
  // Comment this out if you want to keep all loaded markers on the map
  // for (const [key, value] of serviceMarkersMap.entries()) {
  //   if (!currentServiceKeys.has(key)) {
  //     value.marker.setMap(null);
  //     serviceMarkersMap.delete(key);
  //   }
  // }
};

onMounted(() => {
  if (!window.google) return;

  map = new google.maps.Map(mapRef.value!, {
    zoom: 17,
  });

  map.addListener("zoom_changed", () => {
    const zoom = map.getZoom();
    emit("zoom-changed", zoom);
  });

  map.addListener("bounds_changed", () => {
    const bounds = map.getBounds();
    if (bounds) {
      const boundsData = {
        north: bounds.getNorthEast().lat(),
        south: bounds.getSouthWest().lat(),
        east: bounds.getNorthEast().lng(),
        west: bounds.getSouthWest().lng(),
      };
      emit("bounds-changed", boundsData);
    }
  });

  map.addListener("idle", () => {
    const zoom = map.getZoom();
    const bounds = map.getBounds();

    if (bounds) {
      const center = map.getCenter();
      const ne = bounds.getNorthEast();
      const distance =
        google.maps.geometry.spherical.computeDistanceBetween(center, ne) /
        1000;
    }
  });

  let currentMarker: any = null;
  const geocoder = new google.maps.Geocoder();

  function setMarker(
    latVal: number,
    lngVal: number,
    shouldCenter: boolean = true
  ) {
    lat.value = latVal;
    lng.value = lngVal;

    if (currentMarker) currentMarker.setMap(null);

    currentMarker = new google.maps.Marker({
      position: { lat: latVal, lng: lngVal },
      map,
      icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      title: "Selected Location",
    });

    if (shouldCenter) {
      map.setCenter({ lat: latVal, lng: lngVal });
    }

    geocoder.geocode(
      { location: { lat: latVal, lng: lngVal } },
      (results, status) => {
        if (status === "OK" && results && results[0]) {
          address.value = results[0].formatted_address;
          district.value = results[0].address_components[2]?.short_name || "";
        } else {
          address.value = "Address not found";
        }
      }
    );
  }

  if (props.initialLat && props.initialLng) {
    setMarker(props.initialLat, props.initialLng);
    map.setZoom(17);
  } else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMarker(pos.coords.latitude, pos.coords.longitude);
        map.setZoom(17);
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setMarker(51.5074, -0.1278);
      },
      { enableHighAccuracy: true }
    );
  } else {
    setMarker(51.5074, -0.1278);
  }

  map.addListener("click", (e: any) => {
    if (e.latLng) {
      // Close any open info window when clicking on the map
      if (currentOpenInfoWindow) {
        currentOpenInfoWindow.close();
        currentOpenInfoWindow = null;
      }
      setMarker(e.latLng.lat(), e.latLng.lng());
    }
  });

  directionsRenderer = new window.google.maps.DirectionsRenderer({
    polylineOptions: {
      strokeColor: "#1976D2",
      strokeWeight: 7,
      strokeOpacity: 1,
    },
    suppressMarkers: true,
  });
  directionsService = new window.google.maps.DirectionsService();
  directionsRenderer.setMap(map);

  // Store the map reference for later use
  (map as any).__serviceMarkersMap = serviceMarkersMap;

  isInitialized.value = true;

  // Initial marker creation
  updateMarkers();

  if (props.origin && props.destination) {
    calculateRoute(
      props.origin,
      props.destination,
      travelMode.value,
      serviceMarkersMap
    );
  }
});

// Watch for services changes and update markers
watch(
  () => props.services,
  () => {
    updateMarkers();
  },
  { deep: true }
);

watch(
  () => [props.origin, props.destination],
  ([origin, destination]) => {
    if (
      map &&
      directionsRenderer &&
      directionsService &&
      origin &&
      destination
    ) {
      calculateRoute(origin, destination, travelMode.value, serviceMarkersMap);
    } else if (directionsRenderer) {
      directionsRenderer.setDirections({ routes: [] });
      routeDistance.value = "";
      routeDuration.value = "";
    }
  }
);

watch(
  [lat, lng, address, district],
  ([newLat, newLng, newAddress, newDistrict]) => {
    if (newLat && newLng && newAddress && newDistrict) {
      emit("locationSelected", {
        lat: newLat,
        lng: newLng,
        address: newAddress,
        district: newDistrict,
      });
    }
  }
);

// Watch for initial coordinates changes, but respect preserveView
watch(
  () => [props.initialLat, props.initialLng, props.preserveView],
  ([newLat, newLng, preserve]) => {
    if (map && newLat && newLng && isInitialized.value && !preserve) {
      map.setCenter({ lat: newLat, lng: newLng });
    }
  }
);
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
}

.directions-card {
  position: fixed;
  bottom: 0px;
  left: 0;

  transform: none;
  background: white;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border-radius: 1rem;
  padding: 1.25rem;
  z-index: 60;

  border: 1px solid #e5e7eb;
  min-width: 320px;
  width: 100%;

  max-width: 100vw;
}

@media (min-width: 640px) {
  .directions-card {
    min-width: 400px;
    position: absolute;
    left: 50%;
    bottom: 1rem;
    width: 400px;
    transform: translateX(-50%);
  }
}

.close-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
  transform: scale(1.1);
}

.directions-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.transport-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  background: #eff6ff;
  border-radius: 50%;
  margin: 0 auto;
}

.route-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 0;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.info-label {
  font-size: 0.75rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.info-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1e3a8a;
}

.divider {
  width: 1px;
  height: 2.5rem;
  background: #e5e7eb;
}

.travel-mode-selector {
  display: flex;
  gap: 0.5rem;
}

.mode-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.625rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
}

.mode-btn:hover {
  background: #eff6ff;
  border-color: #3b82f6;
  color: #3b82f6;
}

.mode-btn.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

@media (max-width: 640px) {
  .directions-card {
    bottom: 0.5rem;
    padding: 32px;
    min-width: auto;
  }

  .route-info {
    gap: 0.75rem;
  }

  .info-row {
    width: 100%;
  }

  .transport-icon {
    width: 2.5rem;
    height: 2.5rem;
  }

  .info-value {
    font-size: 0.875rem;
  }
}
</style>

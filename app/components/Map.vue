<template>
  <div class="relative w-full h-full md:rounded-xl">
    <div ref="mapRef" class="w-full h-full md:rounded-xl"></div>
    <div
      v-if="routeDistance && routeDuration"
      class="absolute top-4 left-1/2 -translate-x-1/2 bg-white shadow-lg rounded px-4 py-2 z-10 flex flex-col items-center border border-blue-200"
    >
      <span class="font-semibold text-blue-700"
        >Distance: {{ routeDistance }}</span
      >
      <span class="text-blue-700">Estimated Time: {{ routeDuration }}</span>
    </div>
  </div>

  <!-- <div class="mt-4 text-sm">
    <p><strong>Latitude:</strong> {{ lat }}</p>
    <p><strong>Longitude:</strong> {{ lng }}</p>
    <p><strong>Address:</strong> {{ address }}</p>
  </div> -->
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Service } from "#imports";

// Google Maps type definitions
declare global {
  interface Window {
    google: {
      maps: {
        Map: new (element: HTMLElement, options: any) => any;
        Marker: new (options: any) => any;
        InfoWindow: new (options: any) => any;
        Geocoder: new () => any;
        MapMouseEvent: any;
      };
    };
  }
}

const props = defineProps<{
  services: Service[];
  initialLat?: number;
  initialLng?: number;
  origin?: { lat: number; lng: number };
  destination?: { lat: number; lng: number };
}>();
let map: any = null;
let directionsRenderer: any = null;
let directionsService: any = null;
const mapRef = ref<HTMLDivElement | null>(null);
const lat = ref(0);
const lng = ref(0);
const address = ref("");
const district = ref("");
const routeDistance = ref<string>("");
const routeDuration = ref<string>("");

onMounted(() => {
  if (!window.google) return;

  // Initialize map (fallback center)
  map = new google.maps.Map(mapRef.value!, {
    zoom: 17,
    // Nigeria center
  });

  // 🎨 Category marker colors
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

  // 📍 Add service markers
  props.services.forEach((service) => {
    const lat = Number(service.details.lat);
    const lng = Number(service.details.lng);

    if (!isNaN(lat) && !isNaN(lng)) {
      const category =
        service.details.categories || "Community & General Support";
      const icon =
        categoryColors[category] ||
        categoryColors["Community & General Support"];

      const marker = new google.maps.Marker({
        position: { lat, lng },
        map,
        title: service.details.name,
        icon,
      });

      const info = new google.maps.InfoWindow({
        content: `
          <div
            style="max-width: 400px"
            class=" space-y-3 "
          >
            <h4 class="font-medium text-[#111827]">${service.details.name}</h4>
            <em>${category}</em>
          
            <div class="space-y-1">
              <p class="text-sm text-[#6B7280] line-clamp-1">
                ${service.details.address}
              </p>
              <p class="text-sm text-[#6B7280] line-clamp-1">
                ${service.details.hours}
              </p>
            </div>
            <div class="flex gap-3 justify-between">
              <button
                id="call-btn-${service.id}"
                class="bg-[#12A0D8] rounded-full py-2 px-3.5 text-sm text-white"
              >
                Call Now
              </button>
              <button
                id="directions-btn-${service.id}"
                class="border border-[#FE4D67] rounded-full py-2 px-3.5 text-sm text-[#FE4D67]"
              >
                Directions
              </button>
             <a
                id="details-btn-${service.id}"
                href="/explore/${service.id}"
                class="border border-[#B0B72E] rounded-full py-2 px-3.5 text-sm text-[#B0B72E] no-underline inline-block text-center"
              >
                Details
              </a>
            </div>
          </div>
         
          `,
      });

      marker.addListener("click", () => {
        info.open(map, marker);

        // Wait for InfoWindow to render, then attach event listeners
        google.maps.event.addListenerOnce(info, "domready", () => {
          // Directions button
          const directionsBtn = document.getElementById(
            `directions-btn-${service.id}`
          );
          if (directionsBtn) {
            directionsBtn.addEventListener("click", () => {
              if (props.origin?.lat && props.origin.lng) {
                // Set origin as user's current location, destination as service location
                if (directionsService && directionsRenderer) {
                  directionsService.route(
                    {
                      origin: { lat: props.origin?.lat, lng: props.origin.lng },
                      destination: { lat, lng },
                      travelMode: "DRIVING",
                    },
                    (result: any, status: string) => {
                      if (status === "OK") {
                        directionsRenderer.setDirections(result);
                        const leg = result.routes[0]?.legs[0];
                        routeDistance.value = leg?.distance?.text || "";
                        routeDuration.value = leg?.duration?.text || "";
                        info.close(); // Close info window after showing directions
                      } else {
                        console.warn("Directions request failed:", status);
                        alert("Could not get directions. Please try again.");
                      }
                    }
                  );
                }
              } else {
                alert("Please select your location on the map first.");
              }
            });
          }

          // Call button
          const callBtn = document.getElementById(`call-btn-${service.id}`);
          if (callBtn && service.details.phone) {
            callBtn.addEventListener("click", () => {
              window.location.href = `tel:${service.details.phone}`;
            });
          }

          // Details button
          const detailsBtn = document.getElementById(
            `details-btn-${service.id}`
          );
          if (detailsBtn) {
            detailsBtn.addEventListener("click", (e) => {
              e.preventDefault();
              // Use Nuxt's programmatic navigation
              navigateTo(`/explore/${service.id}`);
            });
          }
        });
      });

      marker.addListener("click", () => info.open(map, marker));
    }
  });

  // 🔴 Single marker for user (either default or clicked)
  let currentMarker: any = null;
  const geocoder = new google.maps.Geocoder();

  // ✅ Function to set or move the red marker
  function setMarker(latVal: number, lngVal: number) {
    lat.value = latVal;
    lng.value = lngVal;

    if (currentMarker) currentMarker.setMap(null);

    currentMarker = new google.maps.Marker({
      position: { lat: latVal, lng: lngVal },
      map,
      icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
      title: "Selected Location",
    });

    map.setCenter({ lat: latVal, lng: lngVal });

    // Reverse geocode for address
    geocoder.geocode(
      { location: { lat: latVal, lng: lngVal } },
      (results, status) => {
        if (status === "OK" && results && results[0]) {
          address.value = results[0].formatted_address;
          console.log(results[0]);
          district.value = results[0].address_components[2]?.short_name || "";
        } else {
          address.value = "Address not found";
        }
      }
    );
  }

  // 🧭 Default to user's current location (if available)
  if (props.initialLat && props.initialLng) {
    setMarker(props.initialLat, props.initialLng);
    map.setZoom(17);
  } else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        setMarker(userLat, userLng);
        map.setZoom(17);
      },
      (err) => {
        console.warn("Geolocation error:", err);
        // fallback to Nigeria center
        setMarker(51.5074, -0.1278);
      },
      { enableHighAccuracy: true }
    );
  } else {
    // fallback if browser doesn't support geolocation
    setMarker(51.5074, -0.1278);
  }

  // 🖱️ Update marker when user clicks map
  map.addListener("click", (e: any) => {
    if (e.latLng) {
      setMarker(e.latLng.lat(), e.latLng.lng());
    }
  });

  // Setup directions renderer and service
  directionsRenderer = new window.google.maps.DirectionsRenderer({
    polylineOptions: {
      strokeColor: "#1976D2", // Thicker blue
      strokeWeight: 7, // Thicker line
      strokeOpacity: 1,
    },
    suppressMarkers: false,
  });
  directionsService = new window.google.maps.DirectionsService();
  directionsRenderer.setMap(map);

  // Initial draw if both origin and destination are present
  if (props.origin && props.destination) {
    directionsService.route(
      {
        origin: props.origin,
        destination: props.destination,
        travelMode: "DRIVING",
      },
      (result: any, status: string) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
          // Polyline style is set via polylineOptions above
          const leg = result.routes[0]?.legs[0];
          routeDistance.value = leg?.distance?.text || "";
          routeDuration.value = leg?.duration?.text || "";
        } else {
          directionsRenderer.setDirections({ routes: [] });
          routeDistance.value = "";
          routeDuration.value = "";
          console.warn("Directions request failed:", status);
        }
      }
    );
  }
});

// Watch for changes to origin and destination and redraw directions
import { watch } from "vue";
watch(
  () => [props.origin, props.destination],
  ([origin, destination]) => {
    if (map && directionsRenderer && directionsService) {
      if (origin && destination) {
        directionsService.route(
          {
            origin,
            destination,
            travelMode: "DRIVING",
          },
          (result: any, status: string) => {
            if (status === "OK") {
              directionsRenderer.setDirections(result);
              // Polyline style is set via polylineOptions above
              const leg = result.routes[0]?.legs[0];
              routeDistance.value = leg?.distance?.text || "";
              routeDuration.value = leg?.duration?.text || "";
            } else {
              directionsRenderer.setDirections({ routes: [] });
              routeDistance.value = "";
              routeDuration.value = "";
              console.warn("Directions request failed:", status);
            }
          }
        );
      } else {
        directionsRenderer.setDirections({ routes: [] }); // Clear directions
        routeDistance.value = "";
        routeDuration.value = "";
      }
    }
  }
);

const emit = defineEmits<{
  (
    e: "locationSelected",
    coords: { lat: number; lng: number; address: string; district: string }
  ): void;
}>();
watch(
  [lat, lng, address, district],
  (
    [newLat, newLng, newAddress, newDistrict],
    [oldLat, oldLng, oldAddress, oldDistrict]
  ) => {
    if (
      newLat &&
      newLng &&
      newAddress &&
      newDistrict &&
      (newLat !== oldLat ||
        newLng !== oldLng ||
        newAddress !== oldAddress ||
        newDistrict !== oldDistrict)
    ) {
      emit("locationSelected", {
        lat: newLat,
        lng: newLng,
        address: newAddress,
        district: newDistrict,
      });
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
</style>

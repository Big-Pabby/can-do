<template>
  <div class="relative z-20 w-full h-full md:rounded-xl">
    <div ref="mapRef" class="w-full h-full md:rounded-xl"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import type { Service } from "#imports";

const loadLeaflet = () => {
  return new Promise((resolve) => {
    if (window.L) {
      resolve(window.L);
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => resolve(window.L);
    document.head.appendChild(script);
  });
};

declare global {
  interface Window {
    L: any;
  }
}

const props = defineProps<{
  services: Service[];
  initialLat?: number;
  initialLng?: number;
}>();

const emit = defineEmits<{
  (
    e: "locationSelected",
    coords: { lat: number; lng: number; address: string; district: string }
  ): void;
}>();

let map: any = null;
let currentMarker: any = null;
const mapRef = ref<HTMLDivElement | null>(null);
const lat = ref(0);
const lng = ref(0);
const address = ref("");
const district = ref("");
const userLocation = ref<{ lat: number; lng: number } | null>(null);

const categoryColors: Record<string, string> = {
  "Food & Nutrition": "#FF8C00",
  "Shelter & Housing": "#1E90FF",
  "Clothing & Essentials": "#9370DB",
  "Addiction & Recovery": "#FFD700",
  "Mental Health & Wellbeing": "#FF69B4",
  "Health & Medical": "#32CD32",
  "Justice & Legal Support": "#87CEEB",
  "Financial & Benefits Support": "#8B4513",
  "Employment, Training & Education": "#90EE90",
  "Community & General Support": "#808080",
};

const getCategoryIcon = (category: string) => {
  const icons: Record<string, string> = {
    "Food & Nutrition": "🍽️",
    "Shelter & Housing": "🏠",
    "Clothing & Essentials": "👕",
    "Addiction & Recovery": "💪",
    "Mental Health & Wellbeing": "🧠",
    "Health & Medical": "🏥",
    "Justice & Legal Support": "⚖️",
    "Financial & Benefits Support": "💰",
    "Employment, Training & Education": "📚",
    "Community & General Support": "🤝",
  };
  return icons[category] || "🤝";
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

const getDirections = (
  serviceLat: number,
  serviceLng: number,
  serviceName: string
) => {
  if (userLocation.value) {
    const origin = `${userLocation.value.lat},${userLocation.value.lng}`;
    const destination = `${serviceLat},${serviceLng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&destination_place_id=${encodeURIComponent(
      serviceName
    )}`;
    window.open(url, "_blank");
  } else {
    alert("Please allow location access to get directions");
  }
};

const reverseGeocode = async (latVal: number, lngVal: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latVal}&lon=${lngVal}&zoom=18&addressdetails=1`
    );
    const data = await response.json();

    if (data && data.address) {
      address.value = data.display_name || "Address not found";
      district.value =
        data.address.suburb ||
        data.address.neighbourhood ||
        data.address.city ||
        data.address.town ||
        "";
    } else {
      address.value = "Address not found";
      district.value = "";
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    address.value = "Address not found";
    district.value = "";
  }
};

const setMarker = async (latVal: number, lngVal: number) => {
  lat.value = latVal;
  lng.value = lngVal;
  userLocation.value = { lat: latVal, lng: lngVal };

  if (currentMarker) {
    map.removeLayer(currentMarker);
  }

  const redIcon = window.L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  currentMarker = window.L.marker([latVal, lngVal], { icon: redIcon }).addTo(
    map
  );
  currentMarker.bindPopup("<b>Your Location</b>").openPopup();

  map.setView([latVal, lngVal], 15);

  await reverseGeocode(latVal, lngVal);

  emit("locationSelected", {
    lat: latVal,
    lng: lngVal,
    address: address.value,
    district: district.value,
  });
};

onMounted(async () => {
  await loadLeaflet();

  map = window.L.map(mapRef.value!, {
    preferCanvas: true,
    zoomControl: false,
  }).setView([51.5074, -0.1278], 13);

  window.L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    }
  ).addTo(map);

  // Add service markers
  props.services.forEach((service) => {
    const serviceLat = Number(service.details.lat);
    const serviceLng = Number(service.details.lng);

    if (!isNaN(serviceLat) && !isNaN(serviceLng)) {
      const category =
        service.details.category || "Community & General Support";
      const color =
        categoryColors[category] ||
        categoryColors["Community & General Support"];
      const categoryEmoji = getCategoryIcon(category);

      const iconHtml = `
        <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="${color}"/>
          <circle cx="12.5" cy="12.5" r="6" fill="white"/>
        </svg>
      `;

      const customIcon = window.L.divIcon({
        html: iconHtml,
        className: "custom-marker",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      const marker = window.L.marker([serviceLat, serviceLng], {
        icon: customIcon,
      }).addTo(map);

      // Calculate distance if user location exists
      let distanceText = "";
      if (userLocation.value) {
        const dist = calculateDistance(
          userLocation.value.lat,
          userLocation.value.lng,
          serviceLat,
          serviceLng
        );
        distanceText = `
          <div style="display: inline-block; background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-size: 11px; font-weight: 600; margin-top: 8px;">
            📍 ${dist} away
          </div>
        `;
      }

      // Get star rating HTML
      const rating =
        service.details?.rating !== "null"
          ? parseFloat(service.details.rating)
          : 0;
      const getStarHTML = () => {
        let starsHTML = "";
        for (let i = 1; i <= 5; i++) {
          const fillClass =
            i <= Math.floor(rating)
              ? "#FCD34D"
              : i - 0.5 <= rating
              ? "#FCD34D"
              : "#D1D5DB";
          starsHTML += `
            <svg class="w-4 h-4" style="color: ${fillClass};" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          `;
        }
        return starsHTML;
      };

      const verifiedBadge =
        service.details.verification_status === "verified"
          ? '<div style="display: inline-flex; align-items: center; gap: 4px; margin-left: 8px; padding: 2px 8px; background: #ECFDF5; color: #047857; font-size: 11px; border-radius: 12px;"><span>✓</span><span>Verified</span></div>'
          : "";

      // Service Card Popup
      const popupContent = `
        <div style="border: 1px solid #F3F4F6; background: white; width: 100%; border-radius: 12px; padding: 16px; font-family: system-ui, -apple-system, sans-serif; width: 300px;">
          <h4 style="font-weight: 500; color: #111827; margin: 0 0 12px 0; font-size: 15px; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">
            ${service.details.name}
          </h4>
          
          <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 12px;">
            <p style="display: inline-block; padding: 4px 12px; border: 1px solid #6BCFF6; background: #EAF8FE; color: #12A0D8; font-size: 11px; border-radius: 16px; font-weight: 500; margin: 0;">
              ${category}
            </p>
          </div>

          <!-- Star Rating -->
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
            <div style="display: flex; gap: 2px;">
              ${getStarHTML()}
            </div>
            <span style="color: #374151; font-weight: 500; font-size: 13px;">
              ${rating > 0 ? rating.toFixed(1) : "N/A"}
            </span>
            ${verifiedBadge}
          </div>

          <div style="margin-bottom: 12px;">
            <p style="font-size: 13px; color: #6B7280; display: flex; gap: 6px; align-items: flex-start; margin: 4px 0;">
              <svg style="width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              <span style="flex: 1; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">
                ${
                  service.details.address === "null" || !service.details.address
                    ? "N/A"
                    : service.details.address
                }
              </span>
            </p>
            <p style="font-size: 13px; color: #6B7280; display: flex; gap: 6px; align-items: flex-start; margin: 4px 0;">
              <svg style="width: 16px; height: 16px; flex-shrink: 0; margin-top: 2px;" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              <span style="flex: 1; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;">
                ${
                  service.details?.opening_hours === "null" ||
                  !service.details.opening_hours
                    ? "N/A"
                    : service.details.opening_hours
                }
              </span>
            </p>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            ${
              service.details.phone && service.details.phone !== "null"
                ? `
              <button onclick="window.location.href='tel:${service.details.phone}'" style="background: #12A0D8; border-radius: 20px; padding: 8px 14px; font-size: 13px; color: white; border: none; cursor: pointer; transition: background 0.2s;">
                Call Now
              </button>
            `
                : ""
            }
            <button id="directions-btn-${
              service.id
            }" style="border: 1px solid #FE4D67; border-radius: 20px; padding: 8px 14px; font-size: 13px; color: #FE4D67; background: white; cursor: pointer; transition: all 0.2s;">
              Directions
            </button>
            <a href="/explore/${
              service.id
            }" style="border: 1px solid #B0B72E; border-radius: 20px; padding: 8px 14px; font-size: 13px; color: #B0B72E; background: white; text-decoration: none; cursor: pointer; transition: all 0.2s;">
              Details
            </a>
          </div>
        </div>
      `;

      const popup = window.L.popup({
        maxWidth: 320,
        className: "service-card-popup",
      }).setContent(popupContent);

      marker.bindPopup(popup);

      // Add event listener for directions button after popup opens
      marker.on("popupopen", () => {
        const directionsBtn = document.getElementById(
          `directions-btn-${service.id}`
        );
        if (directionsBtn) {
          directionsBtn.addEventListener("click", () => {
            getDirections(serviceLat, serviceLng, service.details.name);
          });
        }
      });
    }
  });

  // Set initial location
  if (props.initialLat && props.initialLng) {
    await setMarker(props.initialLat, props.initialLng);
  } else if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await setMarker(pos.coords.latitude, pos.coords.longitude);
      },
      (err) => {
        console.warn("Geolocation error:", err);
        setMarker(51.5074, -0.1278);
      },
      { enableHighAccuracy: true }
    );
  } else {
    await setMarker(51.5074, -0.1278);
  }

  map.on("click", async (e: any) => {
    // Show search button popup at clicked location
    const searchPopup = window.L.popup({
      closeButton: true,
      className: "search-location-popup",
    })
      .setLatLng(e.latlng)
      .setContent(
        `
        <div >
          <button id="search-location-btn" style="display: flex; align-items: center; gap: 8px; background: #12A0D8; color: white; border: none; padding: 14px 24px; border-radius: 50px; font-size: 14px; font-weight: 500; cursor: pointer; transition: background 0.2s;">
            <svg style="width: 18px; height: 18px;" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
            </svg>
            <span>Search in this area</span>
          </button>
        </div>
      `
      )
      .openOn(map);

    // Add click handler for the search button
    setTimeout(() => {
      const searchBtn = document.getElementById("search-location-btn");
      if (searchBtn) {
        searchBtn.addEventListener("click", async () => {
          await setMarker(e.latlng.lat, e.latlng.lng);
          searchPopup.remove();

          // Emit the locationSelected event
          emit("locationSelected", {
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            address: address.value,
            district: district.value,
          });
        });
      }
    }, 100);
    setTimeout(() => {
      map.closePopup(searchPopup);
    }, 10000);
  });
});
</script>

<style scoped>
:deep(.custom-marker) {
  background: none;
  border: none;
}

:deep(.service-card-popup .leaflet-popup-content-wrapper) {
  box-shadow: none;
  background: none;
}
:deep(.search-location-popup .leaflet-popup-content-wrapper) {
  box-shadow: none;
  background: none;
}

:deep(.service-card-popup .leaflet-popup-content) {
  margin: 0;
  width: auto !important;
}
:deep(.search-location-popup .leaflet-popup-content) {
  margin: 0;
}

:deep(.search-location-popup .leaflet-popup-tip) {
  margin-top: -8px;
  background: #12a0d8;
}
:deep(.service-card-popup .leaflet-popup-tip) {
  background: white;
}

:deep(.leaflet-popup-close-button) {
  font-size: 24px !important;

  color: #6b7280 !important;
}
:deep(.search-location-popup .leaflet-popup-close-button) {
  font-size: 24px !important;
  padding-right: 10px;
  display: none;
  color: white !important;
}

:deep(.leaflet-popup-close-button:hover) {
  color: #111827 !important;
}
</style>

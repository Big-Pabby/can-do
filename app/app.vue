<template>
  <!-- <InstallBanner /> -->
  <div>
    <Toaster position="top-right" />
    <div class="bg-[#F9FAFB]">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Toaster } from "vue-sonner";
import "vue-sonner/style.css";
import { useLocationStore } from "@/store/location";

const locationStore = useLocationStore();
locationStore.setLocation(9.082, 8.6753, "Abuja, Nigeria");
console.log(locationStore.lat, locationStore.address);
useHead({
  link: [
    { rel: "manifest", href: "/site.webmanifest" },
    { rel: "apple-touch-icon", href: "/icon-192x192.png" },
  ],
});

import { onMounted } from "vue";

function storeUserLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        // Use Google Maps Geocoder to get address
        if (window.google && window.google.maps) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            let address = "";
            let district = "";
            if (status === "OK" && results && results[0]) {
              console.log(results);
              address = results[0].formatted_address;
              district = results[0].address_components[0]?.short_name || "";
            }

            useLocationStore().setLocation(lat, lng, address, district);
          });
        } else {
          // Fallback: store lat/lng only
          const location = { lat, lng };
          useLocationStore().setLocation(lat, lng, "");
        }
      },
      (err) => {
        console.warn("Geolocation error:", err);
      },
      { enableHighAccuracy: true }
    );
  }
}

onMounted(() => {
  storeUserLocation();
});
</script>

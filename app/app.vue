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
            if (status === "OK" && results && results[0]) {
              address = results[0].formatted_address;
            }
            const location = { lat, lng, address };
            localStorage.setItem("location", JSON.stringify(location));
          });
        } else {
          // Fallback: store lat/lng only
          const location = { lat, lng };
          localStorage.setItem("location", JSON.stringify(location));
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

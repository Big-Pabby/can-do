// plugins/googleMaps.client.ts
export default defineNuxtPlugin(async (nuxtApp) => {
  const config = useRuntimeConfig();
  const apiKey = config.public.googleMapsApiKey;

  // Load script dynamically
  if (!window.google) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDzEZ6bSixzHPfkr9p0keUlVtdbNFkxD2M&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject("Google Maps failed to load");
      document.head.appendChild(script);
    });
  }
});

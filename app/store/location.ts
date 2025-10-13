import { defineStore } from "pinia";
import type { Service } from "#imports";

interface Location {
  lat: number;
  lng: number;
  address: string;
  district: string;
  selectedServiceLocation: { lat: number; lng: number } | null;
  selectedService: Service | null;
}

export const useLocationStore = defineStore("location", {
  state: (): Location => ({
    lat: 51.49977959226897,
    lng: -0.12270774498186032,
    address: "Set Location",
    district: "",
    selectedServiceLocation: null,
    selectedService: null
  }),
  actions: {
    setLocation(lat: number, lng: number, address: string, district?: string) {
      this.lat = lat;
      this.lng = lng;
      this.address = address;
      if (district) this.district = district;
    },
    clearLocation() {
      this.lat = 0;
      this.lng = 0;
      this.address = "";
    },
    setSelectedServiceLocation(data: {lat: number, lng: number} | null, service: Service) {
      this.selectedServiceLocation = data;
    
      this.selectedService = service
    },
  },
  persist: true,
});

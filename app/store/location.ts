import { defineStore } from "pinia";

interface Location {
  lat: number;
  lng: number;
  address: string;
  district: string;
}

export const useLocationStore = defineStore("location", {
  state: (): Location => ({
    lat: 0,
    lng: 0,
    address: "",
    district: "",
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
  },
});

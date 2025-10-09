import { defineStore } from "pinia";

interface Location {
  lat: number;
  lng: number;
  address: string;
}

export const useLocationStore = defineStore("location", {
  state: (): Location => ({
    lat: 0,
    lng: 0,
    address: "",
  }),
  actions: {
    setLocation(lat: number, lng: number, address: string) {
      this.lat = lat;
      this.lng = lng;
      this.address = address;
    },
    clearLocation() {
      this.lat = 0;
      this.lng = 0;
      this.address = "";
    },
  },
});

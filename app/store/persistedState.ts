import type { PiniaPluginContext } from "pinia";

export function persistedStatePlugin({ store }: PiniaPluginContext) {
  const key = `pinia-${store.$id}`;
  const fromStorage = localStorage.getItem(key);
  if (fromStorage) {
    store.$patch(JSON.parse(fromStorage));
  }
  store.$subscribe((_mutation, state) => {
    localStorage.setItem(key, JSON.stringify(state));
  });
}

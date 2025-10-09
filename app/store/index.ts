import { createPinia } from "pinia";
import { persistedStatePlugin } from "./persistedState";

const pinia = createPinia();
pinia.use(persistedStatePlugin);

export default pinia;

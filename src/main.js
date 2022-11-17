import { createApp } from "vue";

import router from "./router";
import store from "./store";

import "./index.css";
import "mosha-vue-toastify/dist/style.css";

import App from "./App.vue";

const app = createApp(App);

store.actions.initializeAuthListener().then(() => {
  app.use(router).mount("#app");
});

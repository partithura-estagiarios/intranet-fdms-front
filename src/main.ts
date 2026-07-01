import { createApp } from "vue";
import { Quasar, Notify } from "quasar";
import { i18n, pinia, router, villus } from "./modules";
import { getLayout } from "./helpers";
import { faviconIcons } from "./composables/layout";
import App from "./App.vue";

import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/mdi-v6/mdi-v6.css";

import "quasar/src/css/index.sass";

import "./style.css";
import "uno.css";

function setFavicon(href: string) {
  let link = document.querySelector<HTMLLinkElement>("link[rel~='icon']");

  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  link.type = href.endsWith(".png") ? "image/png" : "image/x-icon";
  link.href = href;
}

const layoutFavicon = faviconIcons[getLayout()];

if (layoutFavicon) {
  setFavicon(layoutFavicon);
}

createApp(App)
  .use(Quasar, {
    plugins: { Notify },
  })
  .use(villus)
  .use(router)
  .use(pinia)
  .use(i18n)
  .mount("#app");

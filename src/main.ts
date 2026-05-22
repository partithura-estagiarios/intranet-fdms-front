import { createApp } from "vue";
import { Quasar, Notify } from "quasar";
import { i18n, pinia, router, villus } from "./modules";
import App from "./App.vue";

import "@quasar/extras/material-icons/material-icons.css";
import "@quasar/extras/mdi-v6/mdi-v6.css";

import "quasar/src/css/index.sass";

import "./style.css";
import "uno.css";

function getRuntimeEnvironmentVariable(name: string): string | undefined {
  const runtimeConfig = globalThis as typeof globalThis & {
    __APP_CONFIG__?: Record<string, string>;
  };

  return runtimeConfig.__APP_CONFIG__?.[name];
}

function getLayout(): string {
  const value =
    getRuntimeEnvironmentVariable("LAYOUT") ??
    (import.meta.env["LAYOUT"] as string | undefined) ??
    (import.meta.env["VITE_LAYOUT"] as string | undefined) ??
    "";
  return value.trim().toUpperCase();
}

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

if (getLayout() === "CIRON") {
  setFavicon("/ico/ICO_CIRON.png");
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

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import VueI18n from "@intlify/vite-plugin-vue-i18n";
import AutoImport from "unplugin-auto-import/vite";
import graphql from "@rollup/plugin-graphql";
import path from "node:path";
import Pages from "vite-plugin-pages";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import Unocss from "unocss/vite";
import vuePlugin from "@quasar/quasar-ui-qcalendar";
// https://vitejs.dev/config/
export default defineConfig({
  // Expose only env vars that are meant for the client.
  // Allows using `LAYOUT=CIRON` in .env (without needing VITE_ prefix).
  envPrefix: ["VITE_", "LAYOUT"],
  resolve: {
    alias: {
      "~": `${path.resolve(__dirname, "src")}/`,
    },
  },
  plugins: [
    Unocss({
      /* options */
    }),
    vue({
      template: { transformAssetUrls },
    }),
    graphql(),
    quasar({
      sassVariables: "src/quasar-variables.sass",
    }),
    Pages({
      // Here we can add 'md'
      extensions: ["vue"],
      dirs: [{ dir: "src/views", baseRoute: "" }],
    }),
    AutoImport({
      imports: [
        "quasar",
        "vue",
        "vue-router",
        "vue-i18n",
        "vue/macros",
        "@vueuse/head",
        "@vueuse/core",
      ],
      dts: "src/auto-imports.d.ts",
      dirs: ["src/composables", "src/store", "src/helpers", "src/stores"],
      vueTemplate: true,
    }),

    Components({
      // allow auto load markdown components under `./src/components/`
      extensions: ["vue", "md"],
      // allow auto import and register components used in markdown
      include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: "src/components.d.ts",
    }),

    VueI18n({
      runtimeOnly: true,
      compositionOnly: true,
      include: [path.resolve(__dirname, "./locales/**")],
    }),
  ],
});

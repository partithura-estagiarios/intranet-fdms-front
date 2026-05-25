import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import VueI18n from "@intlify/vite-plugin-vue-i18n";
import AutoImport from "unplugin-auto-import/vite";
import graphql from "@rollup/plugin-graphql";
import path from "node:path";
import Pages from "vite-plugin-pages";
import { quasar, transformAssetUrls } from "@quasar/vite-plugin";
import Unocss from "unocss/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ["VITE_", "LAYOUT"]);
  const archivesTarget =
    env.VITE_URL_BACK_SERVER_EXPRESS_FOR_ARCHIVES || "http://localhost:4001";

  // Expose only env vars that are meant for the client.
  // Allows using `LAYOUT=CIRON` in .env (without needing VITE_ prefix).
  return {
    envPrefix: ["VITE_", "LAYOUT"],
    resolve: {
      alias: {
        "~": `${path.resolve(__dirname, "src")}/`,
      },
    },
    server: {
      proxy: {
        // In dev, proxy the archives/files backend to avoid CORS issues with Authorization header.
        "/upload": { target: archivesTarget, changeOrigin: true },
        "/upload-img": { target: archivesTarget, changeOrigin: true },
        "/upload-img-doc": { target: archivesTarget, changeOrigin: true },
        "/update-pdf-metadata": { target: archivesTarget, changeOrigin: true },
        "/serve-pdf": { target: archivesTarget, changeOrigin: true },
        "/serve-image": { target: archivesTarget, changeOrigin: true },
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
  };
});

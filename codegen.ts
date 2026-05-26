import type { CodegenConfig } from "@graphql-codegen/cli";

const schema = process.env.VITE_GRAPHQL_API_URL || "http://localhost:3500/";

const config: CodegenConfig = {
  overwrite: true,
  schema,
  generates: {
    "src/modules/graphql/": {
      preset: "client",
      config: {
        useTypeImports: true,
        dedupeFragments: true,
        withCompositionFunctions: true,
        addDocBlocks: true,
        skipTypename: true,
      },
      plugins: [{ add: { content: "// @ts-nocheck" } }],
    },
    "./graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
  hooks: {
    afterAllFileWrite: ["prettier --write"],
  },
};

export default config;

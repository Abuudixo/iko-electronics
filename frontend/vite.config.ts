import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    // package.json sets "type": "module", so this file is ESM and __dirname
    // does not exist. Resolve against import.meta.url instead.
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: {
    port: 5173,
    // The Express BFF will live here later; this keeps cookies same-origin in dev.
    proxy: {
      "/api": { target: "http://localhost:3000", changeOrigin: true },
    },
  },
});

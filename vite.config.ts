import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import vercelRedirects from "./vite/vercelRedirects";

export default defineConfig({
  plugins: [react(), vercelRedirects()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (
            id.includes("node_modules/@firebase") ||
            id.includes("node_modules/firebase")
          )
            return "firebase";
          if (
            id.includes("node_modules/motion") ||
            id.includes("node_modules/framer-motion")
          )
            return "motion";
        },
      },
    },
  },
});

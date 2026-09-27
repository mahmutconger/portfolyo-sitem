import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
  plugins: [react()],
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

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path"; // ✅ ADD THIS

export default defineConfig({
  plugins: [react()],
  resolve: {              // ✅ ADD THIS BLOCK
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
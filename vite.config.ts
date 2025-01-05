import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  define: {},
  server: {
    hmr: {
      // Disable auto reload entirely
      // overlay: false,
      
      // Or configure the HMR connection
      protocol: 'ws',
      host: 'localhost',
      port: 5173
    }
  },});

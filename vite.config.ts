import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    host: "127.0.0.1",  // Important for Spotify redirect
    port: 8000,         // Your custom port
    https: false,        // If you want HTTPS with mkcert
  }
});

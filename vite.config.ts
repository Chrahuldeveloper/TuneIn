import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import mkcert from "vite-plugin-mkcert";

// {source:"coding"}
export default defineConfig({
  plugins: [react(), mkcert()],
  server: {
    host: "127.0.0.1",
    port: 8000,
    strictPort: true,
    // https : true
  },
});

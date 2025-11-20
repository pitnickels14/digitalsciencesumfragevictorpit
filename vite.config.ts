import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    fs: {
      allow: ["./client", "./shared"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
    middlewareMode: false,
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [
    react(),
    {
      name: "express-plugin",
      apply: "serve",
      async configureServer(server) {
        // Lazy load server only in dev mode
        const { createServer } = await import("./server/index.js");
        const app = createServer();
        server.middlewares.use(app);
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
});

import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const plugins: Plugin[] = [react()];

  // Only include express plugin during development
  if (command === "serve") {
    plugins.push({
      name: "express-plugin",
      configureServer(server) {
        // Use dynamic import with fallback
        (async () => {
          try {
            const mod = await import("./server/index.js");
            const app = mod.createServer();
            server.middlewares.use(app);
          } catch (e) {
            console.warn("Could not load server:", e);
          }
        })();
      },
    } as Plugin);
  }

  return {
    server: {
      host: "::",
      port: 8080,
      fs: {
        allow: ["./client", "./shared"],
        deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
      },
    },
    build: {
      outDir: "dist/spa",
    },
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./client"),
        "@shared": path.resolve(__dirname, "./shared"),
      },
    },
  };
});

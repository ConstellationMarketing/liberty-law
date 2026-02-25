import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 8080,
    fs: {
      allow: ["./client", "./shared", "./vendor"],
      deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
    },
  },
  build: {
    outDir: "dist/spa",
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'],
        },
      },
    },
  },
  plugins: [react(), expressPlugin()],
  resolve: {
  alias: {
    "@": path.resolve(__dirname, "./vendor/cms-core/client"),
    "@shared": path.resolve(__dirname, "./vendor/cms-core/shared"),
    "@site": path.resolve(__dirname, "./client"),
  },
},
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during development (serve mode)
    configureServer(server) {
      // Load Express server in the background so Vite can start
      // listening immediately without waiting for heavy server
      // dependencies (sharp, @supabase/supabase-js, etc.) to load.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let expressApp: any = null;
      let ready = false;

      import("./server").then(({ createServer }) => {
        expressApp = createServer() as any;
        ready = true;
      });

      server.middlewares.use((req, res, next) => {
        if (ready) {
          (expressApp as any)(req, res, next);
        } else {
          // Express not loaded yet — pass through to Vite (serves HTML/JS fine)
          next();
        }
      });
    },
  };
}

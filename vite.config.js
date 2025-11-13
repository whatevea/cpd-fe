import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const proxyTarget =
    env.VITE_API_PROXY || env.VITE_API_URL || "http://localhost:5000";

  return {
    plugins: [
      react({
        jsxRuntime: "automatic",
        include: [/\.jsx?$/],
      }),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    esbuild: {
      loader: "jsx",
    },
    server: {
      port: 3000,
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});

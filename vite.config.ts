import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Fix: Cast process to any to avoid 'Property cwd does not exist on type Process' error
  const env = loadEnv(mode, (process as any).cwd(), "");
  return {
    plugins: [react()],
    server: {
      // 로컬 전용 도메인(/etc/hosts 등)으로 접근할 때 차단되지 않도록 허용
      allowedHosts: ["www.optest.kro.kr", "optest.kro.kr"],
      proxy: {
        "/api": "http://127.0.0.1:3000",
      },
    },
    define: {
      // Node.js style process.env.API_KEY support for the library
      "process.env.API_KEY": JSON.stringify(env.API_KEY || env.VITE_API_KEY),
    },
    optimizeDeps: {
      exclude: ["sql.js"], // sql.js handles its own wasm loading
    },
  };
});

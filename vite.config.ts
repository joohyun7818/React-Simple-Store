import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Fix: Cast process to any to avoid 'Property cwd does not exist on type Process' error
  const env = loadEnv(mode, (process as any).cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Node.js style process.env.API_KEY support for the library
      'process.env.API_KEY': JSON.stringify(env.API_KEY || env.VITE_API_KEY)
    },
    optimizeDeps: {
      exclude: ['sql.js'] // sql.js handles its own wasm loading
    }
  };
});
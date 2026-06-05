import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // 1. Tell Vite your GitHub repository name so links resolve properly on GitHub Pages
  // Replace 'project_002' with your exact GitHub repository name if it differs
  base: '/3DGS_webViewer/', 

  plugins: [tailwindcss()],
  server: {
    port: 3000,
  },
  optimizeDeps: {
    exclude: ["@babylonjs/havok"],
  },
  build: {
    target: 'esnext',
    // 2. Prevent the build engine from stalling on massive Babylon assets
    minify: false, 
    sourcemap: false
  },
});
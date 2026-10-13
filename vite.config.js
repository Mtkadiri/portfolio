import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// base './' : fonctionne sur GitHub Pages (sous-dossier), Vercel et Netlify
export default defineConfig({ plugins: [react()], base: './' })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        allowedHosts: ['automatous-oleta-trigonometric.ngrok-free.dev'],
        proxy: {
            '/api': 'http://localhost:5000',
            '/assets': 'http://localhost:5000'
        }
    }
})

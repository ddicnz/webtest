import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 本地开发时走代理，避免 localhost 被接口 CORS 拒绝
      '/api/form-submit': {
        target: 'https://6gti3uh9lj.execute-api.ap-southeast-2.amazonaws.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/form-submit/, '/default/form-submit'),
      },
    },
  },
})

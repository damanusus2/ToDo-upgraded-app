import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react()],
	build: {
		rolldownOptions: {
			output: {
				// Ta funkcja wyłapuje paczki z node_modules i tworzy z nich osobny chunk o nazwie 'vendor'
				manualChunks(id) {
					if (id.includes('node_modules')) {
						return 'vendor'
					}
				},
			},
		},
		chunkSizeWarningLimit: 1000,
	},
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import glsl from 'vite-plugin-glsl'
import path from 'path'

const dirname = path.resolve()

// https://vitejs.dev/config/
export default defineConfig({
  // optimizeDeps:{
  //   esbuildOptions:{
  //     plugins:[
  //       esbuildCommonjs(['electron']),
  //     ]
  //   }
  // },
  // base: '',
  build: {
    assetsInlineLimit: 0,
  },
  plugins: [vue(), glsl()]
})

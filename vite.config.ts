import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import monkey, { cdn } from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    monkey({
      entry: 'src/main.ts',
      clientAlias: "monkeyClient",
      userscript: {
        name: "煎蛋吐槽记录器",
        description: "煎蛋吐槽记录器，自动记录发送过的主题和评论",
        license: "MIT",
        version: "1.0.0",
        namespace: 'yunyuyuan/jandan-recorder',
        match: ['*://*.jandan.net/*'],
      }, 
      build: {
        fileName: 'jandan-recorder.user.js',
        externalGlobals: {
          vue: cdn.jsdelivr('Vue', 'dist/vue.global.prod.js'),
        },
      },
    }), 
  ],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: "@import 'assets/var';"
      }
    }
  },
});

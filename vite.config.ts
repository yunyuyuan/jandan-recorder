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
        version: "1.0.6",
        namespace: 'yunyuyuan/jandan-recorder',
        icon: "data:image/png;base64,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",
        match: ['*://*.jandan.net/*'],
      }, 
      build: {
        fileName: 'jandan-recorder.user.js',
        externalGlobals: {
          vue: cdn.unpkg('Vue', 'dist/vue.global.prod.js'),
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

import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: "煎蛋吐槽记录器",
        description: "煎蛋吐槽记录器，自动记录发送过的主题和评论",
        license: "MIT",
        version: "0.0.2",
        namespace: 'yunyuyuan/jandan-recorder',
        match: ['*://*.jandan.net/*'],
      },
    }),
  ],
});

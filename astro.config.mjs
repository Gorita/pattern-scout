import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://gorita.github.io',
  // 로컬 공유용: base를 '/'로 설정 (STANDALONE 환경 변수 사용)
  // GitHub Pages용: base를 '/pattern-scout/'로 설정
  base: process.env.STANDALONE ? '/' : '/pattern-scout/',
  integrations: [tailwind()],
  output: 'static',
  build: {
    assets: 'assets'
  }
});

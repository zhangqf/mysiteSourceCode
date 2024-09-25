---
layout: home

hero:
  name: 山坡羊·一个犁牛半块田
  text: 元·张养浩
  tagline: 一个犁牛半块田，收也凭天，
    荒也凭天。粗茶淡饭饱三餐，
    早也香甜，晚也香甜。
    布衣得暖胜丝绵，长也可穿，
    短也可穿。草舍茅屋有几间，
    行也安然，待也安然。
    雨过天青驾小船，鱼在一边，
    酒在一边。夜归儿女话灯前，
    今也有言，古也有言。
    日上三竿我独眠，谁是神仙，
    我是神仙。南山空谷书一卷，
    疯也痴癫，狂也痴癫。
  image:
    src: /images/farmland.jpg
    alt: VitePress
  actions:
    - theme: brand
      text: 笔记
      link: /vueRender
    - theme: brand
      text: linux
      link: /linux
    # - theme: alt
    #   text: View on GitHub
    #   link: https://github.com/vuejs/vitepress

features:
  - icon: 📜
    title: Vite, The DX that can't be beat
    details: Lorem ipsum...
    link: /张养浩
  - icon: 🔱
    title: 经典书籍
    details: 心经 金刚经 坛经
    link: /scriptures
  - icon: 🔱
    title: vite
    details: vite
    link: /vite
---
<style>

    :root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe, #41d1ff);
}
</style>

<script setup>
import clockCanvas from './components/clockCanvas.vue'

</script>

<clockCanvas/>

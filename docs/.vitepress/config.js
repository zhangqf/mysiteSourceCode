module.exports = {
  title: '谦-后花园',
  // base: './',
  description: 'Just playing around.',
  themeConfig: {
    outline: {
      level: [2, 6]
    },
    nav: [
      { text: '主页', link: '/' },
      {
        text: '笔记',
        items: [
          { text: 'vue响应式系统', link: '/vuedocs' },
          { text: 'vue渲染器', link: '/vueRender' }
        ]
      }
    ],
    sidebar: {
      '/vuedocs/': {
        text: 'vue的设计',
        items: [
          { text: 'vue的设计', link: '/vuedocs/' },
          { text: '响应系统', link: '/vuedocs/reactivesystem' },
          { text: '非原始值的响应式方案', link: '/vuedocs/Aresponsiveschemeofnonoriginalvalues' },
          { text: '原始值的响应式方案', link: '/vuedocs/AresponsivesofPrimiteValue' }
        ]
      },
      '/vueRender/': {
        text: '渲染器的设计',
        items: [
          { text: '渲染器的设计', link: '/vueRender/' },
          { text: '挂载与更新', link: '/vueRender/mountedandupdated' },
          { text: '简单Diff算法', link: '/vueRender/simpleDiffAlgorithm' },
          { text: '原始值的响应式方案', link: '/vuedocs/AresponsivesofPrimiteValue' }
        ]
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-present Evan You'
    },
    editLink: {
      pattern: 'https://github.com/vuejs/vitepress/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },

    // carbonAds: {
    //   code: 'your-carbon-code',
    //   placement: 'your-carbon-placement'
    // }
  }
}

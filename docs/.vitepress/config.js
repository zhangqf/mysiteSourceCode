module.exports = {
  title: '谦-后花园',
  base: '/mysite/',
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
          { text: 'vue', link: '/vuedocs' }
        ]
      }
    ],
    sidebar: {
      '/vuedocs/': {
        text: 'vue',
        items: [
          { text: 'vue', link: '/vuedocs/' },
          { text: '响应系统', link: '/vuedocs/reactivesystem' },
          { text: '非原始值的响应式方案', link: '/vuedocs/Aresponsiveschemeofnonoriginalvalues' },
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
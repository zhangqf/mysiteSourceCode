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
          { text: 'vue', link: '/vue' },
          { text: '浏览器', link: '/browse' },
          // { text: 'vue渲染器', link: '/vueRender' },

        ]
      }
    ],
    sidebar: {
      '/vue/': {
        text: 'vue',
        items: [
          { text: 'vue的设计', link: '/vue/vuedocs/index' },
          { text: '响应系统', link: '/vue/vuedocs/reactivesystem' },
          { text: '非原始值的响应式方案', link: '/vue/vuedocs/Aresponsiveschemeofnonoriginalvalues' },
          { text: '原始值的响应式方案', link: '/vue/vuedocs/AresponsivesofPrimiteValue' },
          { text: '渲染器的设计', link: '/vue/vueRender/' },
          { text: '挂载与更新', link: '/vue/vueRender/mountedandupdated' },
          { text: '简单Diff算法', link: '/vue/vueRender/simpleDiffAlgorithm' },
          { text: '组件的实现原理', link: '/vue/components/' },
          { text: '异步组件与函数式组件', link: '/vue/components/asyncComponent' },
          { text: '内建组件和模块', link: '/vue/components/builtInComponentsAndModules' },
          { text: '同构渲染', link: '/vue/compiler' },
        ],
        collapsed: false,
        link: '/vue/vuedocs/index'
      },
      '/browse/': {
        text: '浏览器',
        items: [
          { text: 'javascript运行机制', link: '/browse/' },
          { text: 'V8的工作原理', link: '/browse/v8WorkingPrinciple' },
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
      copyright: 'Copyright © 2024 Qian'
    },
    editLink: {
      pattern: 'https://github.com/zhangqf/mysiteSourceCode/tree/master/docs/:path',
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

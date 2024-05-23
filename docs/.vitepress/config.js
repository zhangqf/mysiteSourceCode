module.exports = {
  title: '谦-后花园',
  base: '/mysite/',
  description: 'Just playing around.',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Example', link: '/张养浩' }
    ],
    sidebar: [
      {
        text: 'Example',
        items: [
          { text: 'Markdown Example', link: '/markdown-examples' },
          { text: 'Runtime API Example', link: '/api-example' }
        ]
      }
    ],

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

    carbonAds: {
      code: 'your-carbon-code',
      placement: 'your-carbon-placement'
    }
  }
}
module.exports = {
  title: 'Hello VitePress1',
  base: '/mysite/',
  description: 'Just playing around.',
  themeConfig: {
    nav: [
      { text: 'Home', link: '/'},
      { text: 'Example', link: 'markdown-examples'}
    ],
    sidebar: [
      {
        text: 'Example',
        items: [
          { text: 'Markdown Example', link: '/markdown-examples'},
          { text: 'Runtime API Example', link: '/api-example'}
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress'}
    ]
  }
}
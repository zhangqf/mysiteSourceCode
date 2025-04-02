import { SearchPlugin } from "vitepress-plugin-search"
import flexSearchIndexOptions from "flexsearch";

var options = {
  encode: false,
  tokenize: 'full',
  previewLength: 80,
  buttonLabel: "搜索",
  placeholder: "输入关键词",
  allow: [],
  ignore: [],
  lang: 'zh',
  ...flexSearchIndexOptions,
};
module.exports = {
  vite: {
    plugins: [SearchPlugin(options)]
  },
  markdown: {
    math: true
  },
  head: [
    ['meta', { name: '谦的后花园', content: '技术博客关于编程和软件开发的最新技术文章' }],
    ['link', { res: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.css', integrity: 'sha384-DyZg8I8h4P1z3kZTAf8cM9Y5hGZ1S1h/8hR9t5dQ2MdP31fYcA2b5fv4vD9JmC9H', crossorigin: 'anonymous' }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/katex.min.js', integrity: 'sha384-DyZg8I8h4P1z3kZTAf8cM9Y5hGZ1S1h/8hR9t5dQ2MdP31fYcA2b5fv4vD9JmC9H', crossorigin: 'anonymous' }],
    ['script', { src: 'https://cdn.jsdelivr.net/npm/katex@0.13.11/dist/contrib/auto-render.min.js', integrity: 'sha384-XXXX', crossorigin: 'anonymous' }]
  ],
  search: {
    provider: 'local'
  },
  title: '谦-后花园',
  // base: './',
  description: 'Just playing around.',
  themeConfig: {
    outline: {
      level: [2, 6]
    },
    search: {
      provider: 'algolia',
      options: {
        appId: '...',
        apiKey: '...',
        indexName: '...',
        locales: {
          zh: {
            placeholder: '搜索文档',
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                searchBox: {
                  resetButtonTitle: '清除查询条件',
                  resetButtonAriaLabel: '清除查询条件',
                  cancelButtonText: '取消',
                  cancelButtonAriaLabel: '取消'
                },
                startScreen: {
                  recentSearchesTitle: '搜索历史',
                  noRecentSearchesText: '没有搜索历史',
                  saveRecentSearchButtonTitle: '保存至搜索历史',
                  removeRecentSearchButtonTitle: '从搜索历史中移除',
                  favoriteSearchesTitle: '收藏',
                  removeFavoriteSearchButtonTitle: '从收藏中移除'
                },
                errorScreen: {
                  titleText: '无法获取结果',
                  helpText: '你可能需要检查你的网络连接'
                },
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                  searchByText: '搜索提供者'
                },
                noResultsScreen: {
                  noResultsText: '无法找到相关结果',
                  suggestedQueryText: '你可以尝试查询',
                  reportMissingResultsText: '你认为该查询应该有结果？',
                  reportMissingResultsLinkText: '点击反馈'
                }
              }
            }
          }
        }
      }
    },
    outlineTitle: '本页目录',
    nav: [
      { text: '主页', link: '/' },
      { text: 'subSite test', link: 'http://abc.zhangqian.cloud/', target: '_blank', rel: 'sponsored' },
      {
        text: '笔记',
        items: [
          { text: 'vue3学习笔记', link: '/vue/vuedocs/index' },
          { text: '浏览器', link: '/browse' },
          // { text: 'vue渲染器', link: '/vueRender' },
          { text: 'webpack', link: '/webpack' },
          { text: 'git', link: '/git' },
          { text: 'vue3面试题', link: '/vue3面试题' },
          { text: 'TypeScript', link: '/TypeScript' },
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
        link: '/vue/vuedocs/index',
      },
      '/browse/': {
        text: '浏览器',
        items: [
          { text: 'javascript运行机制', link: '/browse/' },
          { text: 'V8的工作原理', link: '/browse/v8WorkingPrinciple' },
        ]
      },
      '/linux/': {
        text: 'linux',
        items: [
          { text: 'Linux基础', link: '/linux/' },
          { text: '文件权限和目录配置', link: '/linux/Linux文件权限和目录配置' },
          { text: '文件和目录管理', link: '/linux/文件与目录管理' },
          { text: '文件系统', link: '/linux/文件系统' },
          { text: '文件与文件系统的压缩、打包与备份', link: '/linux/文件与文件系统的压缩、打包与备份' },
          { text: 'vim程序编辑器', link: '/linux/vim程序编辑器' },
          { text: 'BASH与Shell', link: '/linux/BASH与Shell' },
          { text: '正则与文件格式化', link: '/linux/正则与文件格式化' },
          { text: 'Shell Scripts', link: '/linux/ShellScripts' },
          { text: 'Linux 账号管理与ACL权限设定', link: '/linux/Linux 账号管理与ACL权限设定' },
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
      },
      '/webpack/': {
        text: 'webpack',
        items: [
          { text: 'webpack', link: '/webpack/' },
          { text: 'webpack的理解', link: '/webpack/webpack的理解' }
        ]
      },
      '/git/': {
        text: 'git',
        items: [
          { text: 'git', link: '/git/' },
          { text: 'webpack的理解', link: '/webpack/webpack的理解' }
        ]
      },
      '/vue3面试题/': {
        text: 'vue3面试题',
        items: [
          { text: 'vue3面试题1', link: '/vue3面试题/' },
          { text: 'vue3面试题2', link: '/vue3面试题/vue3面试题2' },
        ]
      },
      'WebGL': {
        text: 'WebGL',
        items: [
          { text: '第一章 WebGL', link: '/WebGL/' },
          { text: '第二章 绘制和变换三角形', link: '/WebGL/Chapter2' },
          { text: '第三章 高级变换与动画基础', link: '/WebGL/Chapter3' },
          { text: '第四章 颜色和纹理', link: '/WebGL/Chapter4' },
          { text: '第五章 OpenGL ES 着色器语言', link: '/WebGL/Chapter5' },
          { text: '第六章 进入三维世界', link: '/WebGL/Chapter6' },
          { text: '第七章 光照', link: '/WebGL/Chapter7' },
        ]
      }
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ],
    footer: {
      message: '<a href="https://beian.miit.gov.cn/" target="_blank">陇ICP备2024014026号</a><a href="https://beian.mps.gov.cn/#/query/webSearch?code=62010502001808" rel="noreferrer" target="_blank"><img style="display: inline-block;vertical-align: top;margin: 0 12px 0 20px;width: 20px;height: 20px;line-height: 20px;"src="/head_logo.png"/><span>甘公网安备62010502001808<span></a>',
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

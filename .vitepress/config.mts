import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Hi👋I'm AceDroidX",
  description: "Blog for AceDroidX",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blogs', link: '/notes' }
    ],

    sidebar: [
      {
        text: '前端技术',
        items: [
          { text: '在Vue.js中手动显式指定子组件的泛型', link: '/notes/2025-02-23-specify-generics-child-vue' },
        ]
      },
      {
        text: '项目记录',
        items: [
          { text: '华为笔记本充电控制逆向过程记录', link: 'https://blog.acedroidx.top/HuaweiBatteryControl/' },
        ]
      },
      {
        text: '历史存档',
        items: [
          { text: '【七海/MAD】🦈鲨反射🦈-借物表/相关技术', link: '/notes/2022-01-19-shark-reflection' },
          { text: 'vtuber转播新方案-自建直播服务器', link: '/notes/2020-03-08-a-new-way-to-rebroadcast' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/AceDroidX' }
    ]
  }
})

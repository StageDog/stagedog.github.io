import { InlineLinkPreviewElementTransform } from '@nolebase/vitepress-plugin-inline-link-preview/markdown-it';
import markdownItBlockEmbed from 'markdown-it-block-embed';
import implicitFigures from 'markdown-it-implicit-figures';
import { defineConfig, UserConfig } from 'vitepress';
import { tabsMarkdownPlugin } from 'vitepress-plugin-tabs';
import { withSidebar } from 'vitepress-sidebar';

// https://vitepress.dev/zh/reference/site-config
const vitepress_config: UserConfig = {
  vite: {
    optimizeDeps: {
      exclude: ['@nolebase/vitepress-plugin-inline-link-preview/client', '@nolebase/ui'],
    },
    ssr: {
      noExternal: ['@nolebase/vitepress-plugin-inline-link-preview', '@nolebase/ui'],
    },
  },

  title: '白化蓝染的酒馆',
  description: '一些酒馆相关内容',
  head: [['link', { rel: 'icon', href: 'logo.ico' }]],
  themeConfig: {
    // https://vitepress.dev/zh/reference/default-theme-config
    logo: '/logo.ico',
    nav: [{ text: '主页', link: '/' }],
    search: {
      provider: 'local',
    },
    router: {
      cleanUrls: true,
    },
    outline: {
      label: '目录',
      level: [2, 3],
    },

    socialLinks: [{ icon: 'github', link: 'https://github.com/StageDog/sillytavern_stage_girls_doc' }],
    footer: {
      message: '作者：络络, 青空莉想做舞台少女的狗',
      copyright: '© Copyright 2025, StageDog.<br>Icons by <a href="https://igoutu.cn/">Icons8</a>',
    },
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'short',
      },
    },
  },
  markdown: {
    container: {
      tipLabel: '提示',
      warningLabel: '注意',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息',
    },
    image: {
      lazyLoading: true,
    },
    toc: {
      level: [2, 3],
    },
    breaks: true,
    config(md) {
      md.use(InlineLinkPreviewElementTransform);
      md.use(markdownItBlockEmbed);
      md.use(tabsMarkdownPlugin);
      md.use(implicitFigures, { figcaption: 'title' });
    },
  },
};

// https://vitepress-sidebar.cdget.com/zhHans/guide/getting-started
const vitepress_sidebar_config = {
  documentRootPath: '/',
  scanStartPath: '.',
  collapsed: true,
  collapseDepth: 2,
  useTitleFromFrontmatter: true,
  useTitleFromFileHeading: true,
  useFolderTitleFromIndexFile: true,
  sortMenusByFrontmatterOrder: true,
  useFolderLinkFromIndexFile: true,
  manualSortFileNameByPriority: ['角色卡', '教程', '酒馆使用常见问题', '工具经验'],
};

// @ts-ignore
export default defineConfig(withSidebar(vitepress_config, vitepress_sidebar_config));

import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'VitoDeploy',
  tagline: 'The Ultimate Server Management Tool',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://vitodeploy.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'vitodeploy', // Usually your GitHub org/user name.
  projectName: 'vito', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          includeCurrentVersion: true,
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/vitodeploy/vitodeploy.com/tree/main',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.jpg',
    navbar: {
      title: 'VitoDeploy',
      logo: {
        alt: 'VitoDeploy Logo',
        src: 'img/logo.svg',
      },
      items: [
        // {
        //   type: 'docSidebar',
        //   sidebarId: 'sidebar',
        //   position: 'left',
        //   label: 'Docs',
        //   to: '/docs/getting-started/introduction',
        // },
        {to: '/docs/getting-started/introduction', label: 'Docs', position: 'left'},
        {to: '/blog', label: 'Blog', position: 'left'},
        {to: 'https://demo.vitodeploy.com', label: 'Live Demo', position: 'left'},
        {
          type: 'docsVersionDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/vitodeploy/vito',
          position: 'right',
          className: 'header-github-link',
        },
        {
          href: 'https://discord.gg/uZeeHZZnm5',
          position: 'right',
          className: 'header-discord-link',
        },
        {
          href: 'https://x.com/vitodeploy',
          position: 'right',
          className: 'header-x-link',
        },
        {
          
          href: 'https://youtube.com/saeedvaziry',
          position: 'right',
          className: 'header-youtube-link',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/docs/getting-started/introduction',
            },
            {
              label: 'Installation',
              to: '/docs/getting-started/installation',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.com/invite/uZeeHZZnm5',
            },
            {
              label: 'X',
              href: 'https://x.com/vitodeploy',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/vitodeploy/vito',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} VitoDeploy. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['php']
    },
    algolia: {
      // The application ID provided by Algolia
      appId: 'OSJRVBTWTB',

      // Public API key: it is safe to commit it
      apiKey: 'd37bbbcb5d06e88c415a34892ac3d937',

      indexName: 'vitodeploy',

      // Optional: see doc section below
      contextualSearch: false,

      // Optional: Algolia search parameters
      searchParameters: {},

      // Optional: path for search page that enabled by default (`false` to disable it)
      searchPagePath: 'search',

      // Optional: whether the insights feature is enabled or not on Docsearch (`false` by default)
      insights: false,

      //... other Algolia params
    },
    plugins: [
      ['./src/plugins/tailwind-config.js', {}],
    ]
  } satisfies Preset.ThemeConfig,
};

export default config;

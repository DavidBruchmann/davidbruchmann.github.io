// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).
// There are various equivalent ways to declare your Docusaurus config.
// See: https://docusaurus.io/docs/api/docusaurus-config

import {themes as prismThemes} from 'prism-react-renderer';
//const remarkEmbedder = require('@remark-embedder/core').default;
//const oembedTransformer = require('@remark-embedder/transformer-oembed').default;
import remarkEmbedder from '@remark-embedder/core';
import oembedTransformer from '@remark-embedder/transformer-oembed';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'David Bruchmann',
  tagline: 'Web-Development, TYPO3, Freelancer',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://davidbruchmann.github.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  trailingSlash: false,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'DavidBruchmann', // Usually your GitHub org/user name.
  projectName: 'davidbruchmann', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'de'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: './sidebars.js',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            //'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
            'https://github.com/DavidBruchmann/davidbruchmann/tree/main/',
          // Inject Remark Plugin
          remarkPlugins: [
            [
              remarkEmbedder,
              {
                transformers: [oembedTransformer],
              },
            ],
          ],
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            // 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
            'https://github.com/DavidBruchmann/davidbruchmann/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
          // Inject Remark Plugin
          remarkPlugins: [
            [
              remarkEmbedder,
              {
                transformers: [oembedTransformer],
              },
            ],
          ],
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/docusaurus-social-card.jpg',
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        title: 'Home',
        logo: {
          alt: 'Logo David Bruchmann',
          src: 'img/Logo_DB_140x40.png',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'serviceSidebar',
            position: 'left',
            label: 'Services',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {to: '/open-source', label: 'Open Source', position: 'left'},
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            href: `https://github.com/DavidBruchmann`,
            html: `
                  <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" class="octicon octicon-mark-github" viewBox="0 0 16 16" width="16" height="16" fill="currentColor" display="inline-block" overflow="visible" style="vertical-align:top; margin-top:3px;"><style></style><path d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z"></path></svg>
                  &nbsp;&nbsp;GitHub
                  <svg width="13.5" height="13.5" aria-label="(opens in new tab)" class="iconExternalLink_nPIU"><use href="#theme-svg-external-link"></use></svg>
                `,
            position: 'right',
          },
            /*
              {
                href: 'https://github.com/DavidBruchmann',
                label: 'GitHub',
                position: 'right',
              },
            */
          {
            href: 'https://ko-fi.com/davidbruchmann',
            label: '♥️ Support Me ♥️',
            position: 'right',
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
                label: 'Services',
                to: '/docs/services',
              },
              {
                label: 'Blog',
                to: '/blog',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/DavidBruchmann/',
              },
              {
                label: 'LinkedIn',
                href: 'https://www.linkedin.com/in/david-bruchmann-069b9519/',
              },
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/users/1019850/david',
              },
              {
                label: 'Xing',
                href: 'https://www.xing.com/profile/David_Bruchmann/',
              },
              /*
              {
                label: '♥️ Support Me ♥️',
                href: 'https://www.ko-fi.com/davidbruchmann/',
              },
              */
            ],
          },
          {
            title: 'Sponsoring',
            items: [
              {
                html: `
                      <h2 class="anchor" id="support">🙏 ♥️ Support<a href="#support" class="hash-link" aria-label="Direct link to 🙏 ♥️ Support" title="Direct link to 🙏 ♥️ Support" translate="no">​</a></h2>
                      <a href="https://ko-fi.com/davidbruchmann" target="_blank" rel="noopener noreferrer" class="footer__link-item">
                      <p style="max-width: 18rem;">If you like any of my projects, maybe because it saves you time or helps your work, you can support its continued development.</p>
                      <p><img decoding="async" loading="lazy" alt="Support me on Ko-fi" src="/img/kofi-badge-medium.png" width="160" height="87"></p>
                      </a>
                `,
              }
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} David Bruchmann. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;

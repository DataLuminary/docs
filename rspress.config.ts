import * as path from "node:path";
import { defineConfig } from "@rspress/core";

const DOCS_URL = "https://docs.dataluminary.dev";
const SITE_URL = "https://dataluminary.dev";
const DESCRIPTION =
  "DataLuminary 官方文档：开源 AI 原生 BI 平台的产品、用户指南、交付迁入、权限分享与插件开发。全链路数据洞察，支持私有化部署。";

export default defineConfig({
  root: path.join(__dirname, "docs"),
  title: "DataLuminary Docs",
  description: DESCRIPTION,
  lang: "zh",
  icon: "/brand-logo.png",
  logo: {
    light: "/brand-logo.png",
    dark: "/brand-logo.png",
  },
  logoText: "DataLuminary",
  globalStyles: path.join(__dirname, "docs/styles/index.css"),
  globalUIComponents: [path.join(__dirname, "components/MermaidRuntime.tsx")],
  head: [
    // Search engines may index; generative AI crawlers are restricted via robots.txt + TDM.
    ["meta", { name: "robots", content: "index, follow, noai, noimageai" }],
    ["meta", { name: "tdm-reservation", content: "1" }],
    [
      "meta",
      {
        name: "tdm-policy",
        content: "https://docs.dataluminary.dev/legal/ai-use",
      },
    ],
    ["meta", { name: "author", content: "LuminaryWorks" }],
    [
      "meta",
      {
        name: "keywords",
        content:
          "DataLuminary,开源BI,数据可视化,AI洞察,仪表盘,数据大屏,插件开发,私有化部署,Headless BI,文档",
      },
    ],
    ["meta", { property: "og:site_name", content: "DataLuminary Docs" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:url", content: `${DOCS_URL}/` }],
    ["meta", { property: "og:title", content: "DataLuminary Docs" }],
    ["meta", { property: "og:description", content: DESCRIPTION }],
    ["meta", { property: "og:locale", content: "zh_CN" }],
    [
      "meta",
      {
        property: "og:image",
        content: `${DOCS_URL}/logo_large.png`,
      },
    ],
    ["meta", { name: "twitter:card", content: "summary_large_image" }],
    ["meta", { name: "twitter:title", content: "DataLuminary Docs" }],
    ["meta", { name: "twitter:description", content: DESCRIPTION }],
    [
      "meta",
      {
        name: "twitter:image",
        content: `${DOCS_URL}/logo_large.png`,
      },
    ],
    ["link", { rel: "canonical", href: `${DOCS_URL}/` }],
    ["link", { rel: "alternate", href: SITE_URL, hrefLang: "x-default" }],
  ],
  themeConfig: {
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/DataLuminary",
      },
    ],
    footer: {
      message:
        'DataLuminary · 数据明鉴 · 公开阅读 · 禁止用于 AI 训练或生成同类产品（/legal/ai-use） · <a href="https://dataluminary.dev">官网</a>',
    },
  },
});

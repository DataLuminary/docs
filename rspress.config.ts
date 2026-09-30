import * as path from "node:path";
import { defineConfig } from "@rspress/core";

export default defineConfig({
  head: [
    ["meta", { name: "robots", content: "noai, noimageai, noarchive" }],
    ["meta", { name: "tdm-reservation", content: "1" }],
    ["meta", { name: "tdm-policy", content: "https://docs.dataluminary.dev/legal/ai-use" }],
  ],
  root: path.join(__dirname, "docs"),
  title: "DataLuminary",
  icon: "/brand-logo.png",
  logo: {
    light: "/brand-logo.png",
    dark: "/brand-logo.png",
  },
  globalStyles: path.join(__dirname, "docs/styles/index.css"),
  globalUIComponents: [path.join(__dirname, "components/MermaidRuntime.tsx")],
  themeConfig: {
    socialLinks: [
      {
        icon: "github",
        mode: "link",
        content: "https://github.com/DataLuminary",
      },
    ],
    footer: {
      message: "DataLuminary · 数据明鉴 · 公开阅读 · 禁止用于 AI 训练或生成同类产品（/legal/ai-use）",
    },
  },
});

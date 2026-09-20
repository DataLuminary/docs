# docs

DataLuminary 用户与开发者文档站（[Rspress 2](https://rspress.rs/)）：一套站点、多受众入口。

GitHub：[`DataLuminary/docs`](https://github.com/DataLuminary/docs) · 站点：[docs.dataluminary.dev](https://docs.dataluminary.dev)

## Information architecture

| Top nav | Path | Audience |
|---------|------|----------|
| 开始 | `/start/` | Persona hubs (curated paths, no duplicated body copy) |
| 产品 | `/product/` | Capabilities, vision, whitepaper |
| 指南 | `/guide/` | Task-oriented end-user guides |
| 交付 | `/deliver/` + `/migrate` `/permission` `/share` | Enterprise eval and rollout |
| 开发 | `/develop/` + `/plugins` | Architecture, integration, plugins |

Sibling LuminaryWorks products: bridge only via `/product/ecosystem` → [LuminaryWorks docs](https://github.com/LuminaryWorks/docs).

## Setup

```bash
pnpm install
```

Requires **Node.js >= 24** (see `engines` / `.nvmrc`).

## Get started

```bash
pnpm run dev
```

Dev server: **http://localhost:18182/**

```bash
pnpm run build
pnpm run preview
```

## Deployment

Docs are deployed to [docs.dataluminary.dev](https://docs.dataluminary.dev) via GitHub Pages.

- **Workflow**: `.github/workflows/deploy-pages.yml` (runs on push to `main`)
- **Build output**: `doc_build/`
- **Custom domain**: `docs.dataluminary.dev` (CNAME → `dataluminary.github.io`)

### DNS (Cloudflare / registrar)

| Type  | Name  | Value                    |
|-------|-------|--------------------------|
| CNAME | docs  | dataluminary.github.io   |

After the first deploy, enable **GitHub Pages → Source: GitHub Actions** in repo settings if not already configured.

## License

[Polyform Noncommercial License 1.0.0](LICENSE) (Polyform-NC). See DataLuminary meta repo for commercial licensing.

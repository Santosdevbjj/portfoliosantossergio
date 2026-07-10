# Next.js & TypeScript 7: ALWAYS read docs before coding
Before any Next.js work, find and read the relevant doc in `node_modules/next/dist/docs/`.
Your training data is outdated — the docs are the source of truth for Version 16.2.10+.

## Project Context
- **Framework**: Next.js 16.2.10 (App Router)
- **TypeScript**: Version 7.0.2 (Stable Native Go-Based Compiler / `tsc`)
- **Bundler**: Turbopack (Default)
- **PPR Status**: Fully Enabled via `cacheComponents: true` (Routes render as `◐ Partial Prerender`)
- **AI Debugging**: Browser logs forwarded to terminal via `logging.browserToTerminal: true`

## Sergio Santos Portfolio - Custom Rules
- **Assets**: Multilingual PDFs are in `public/pdf/cv-sergio-santos-[lang].pdf`
- **OG Images**: Multilingual PNGs are in `public/og/og-image-[lang].png`
- **Supported Locales**: pt-BR, en-US, es-ES, es-AR, es-MX.

## Developer & Agent Guidelines (TypeScript 7)
- **Do NOT** use experimental flags or extensions for `@typescript/native-preview` or `tsgo`. The project uses the standard `typescript@7.0.2` package where the Go engine is baked into the default `tsc` binary.
- Respect the incremental cache. Do not delete or force ignore `.tsbuildinfo` files during build loops unless explicitly instructed.
- All routing and localization follow Next.js 16.x Middleware specs (automatic redirection to `/[lang]` with Status 307).

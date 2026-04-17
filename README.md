# 🗂️ Sérgio Santos — Portfólio Técnico

[![Portfolio Live](https://img.shields.io/badge/Portfolio-portfoliosantossergio.vercel.app-111827?style=for-the-badge&logo=vercel&logoColor=00eaff)](https://portfoliosantossergio.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Sérgio_Santos-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/santossergioluiz)
[![GitHub](https://img.shields.io/badge/GitHub-Santosdevbjj-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Santosdevbjj)
[![Medium](https://img.shields.io/badge/Medium-@sergiosantosluiz-12100E?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@sergiosantosluiz)

---

## 🌐 Acesso Multilíngue

| Idioma | URL |
|---|---|
| 🇧🇷 Português (BR) | [portfoliosantossergio.vercel.app/pt-BR](https://portfoliosantossergio.vercel.app/pt-BR) |
| 🇺🇸 English (US) | [portfoliosantossergio.vercel.app/en-US](https://portfoliosantossergio.vercel.app/en-US) |
| 🇪🇸 Español (ES) | [portfoliosantossergio.vercel.app/es-ES](https://portfoliosantossergio.vercel.app/es-ES) |
| 🇦🇷 Español (AR) | [portfoliosantossergio.vercel.app/es-AR](https://portfoliosantossergio.vercel.app/es-AR) |
| 🇲🇽 Español (MX) | [portfoliosantossergio.vercel.app/es-MX](https://portfoliosantossergio.vercel.app/es-MX) |

---

## 1. Problema de Negócio

Recrutadores não têm tempo para analisar código em profundidade.

Por isso, profissionais experientes enfrentam um problema concreto: como demonstrar claramente o valor do que construíram, sem depender de que o avaliador abra cada repositório?

Portfólios tradicionais respondem "quais ferramentas você usa". O mercado quer saber: **qual problema você resolveu, como você decidiu e qual foi o impacto**.

Este portfólio foi construído para responder essas três perguntas de forma direta — permitindo avaliar rapidamente o problema, a solução e o impacto de cada projeto, sem necessidade de leitura de código.

---

## 2. Contexto

Este portfólio consolida mais de 15 anos de atuação em sistemas críticos no setor bancário (Bradesco) e a transição ativa para Ciência de Dados e Engenharia de Dados em ambientes cloud.

A plataforma foi projetada para tornar projetos **legíveis, escaláveis e acessíveis globalmente**:

- Projetos exibidos automaticamente via integração com a API do GitHub.
- Interface disponível em 5 idiomas: Português, Inglês e Espanhol (ES, AR, MX).
- Práticas de segurança e organização inspiradas em ambientes bancários regulados.

Os detalhes técnicos da implementação são apresentados nas seções seguintes.

---

## 3. Premissas da Solução

Para garantir integridade, performance e experiência de quem avalia, as seguintes premissas foram adotadas:

- **O campo `description` de cada repositório no GitHub** é a fonte oficial dos dados de projetos. O padrão `"Problema | Solução | Impacto"` é parseado automaticamente para alimentar o componente `ProjectCard`.
- **Nenhum projeto é exibido sem o tópico `portfolio`** no repositório correspondente — garantindo curadoria intencional do portfólio.
- **O locale `pt-BR` é o dicionário mestre (SSOT)**. Todos os demais idiomas são validados estruturalmente antes de cada deploy via `i18n:validate`.
- **Performance abaixo de 1s (LCP)**: ISR com `revalidate: 3600` e cache tags evitam sobrecarga da API do GitHub.
- **Configurações de segurança inspiradas em ambientes bancários**: headers HSTS, CSP, X-Frame-Options e X-Content-Type-Options configurados no `next.config.ts` e no `vercel.json`.

---

## 4. Estratégia da Solução

**Resumo do fluxo:**
- Os dados vêm do GitHub.
- São estruturados em problema, solução e impacto automaticamente.
- São exibidos no portfólio sem intervenção manual.

---

**Pipeline de projetos (GitHub → ProjectCard) — detalhe técnico:**

1. `getPortfolioRepos()` busca todos os repositórios públicos via GitHub REST API com autenticação por token.
2. `processRepositories()` filtra pelo tópico `portfolio`, exclui forks e divide a `description` pelo separador `|` nos campos `problem`, `solution` e `impact`.
3. Repositórios com tópico `featured` são destacados; tópico `primeiro` posiciona o projeto no topo da grade.
4. Categorias são inferidas dos tópicos (ex: `azure` → `Cloud & Infrastructure`, `python` → `Data Science`) via mapeamento centralizado em `config/categories.ts`.
5. Os dados chegam ao `ProjectCard` tipados, ordenados e prontos — sem lógica de negócio no lado do cliente.

**Pipeline de internacionalização (i18n) — detalhe técnico:**

1. O middleware detecta o locale via cookie `NEXT_LOCALE` ou cabeçalho `Accept-Language`.
2. `getServerDictionary()` carrega e cacheia o dicionário com `React.cache()` por locale.
3. Dicionários são normalizados antes de chegar aos componentes, prevenindo erros em produção.
4. Validação estrutural cross-locale roda em build time via `validateAllLocales()`.

**Pipeline de SEO — detalhe técnico:**

- Dados estruturados JSON-LD (`Person`, `WebSite`, `Article`) gerados por página.
- OG images dinâmicas por locale e por projeto com cache de memória de 1 hora.
- Sitemaps e URLs canônicas geradas automaticamente por locale.

---

## 5. Insights Técnicos

- **O separador `|` na descrição do GitHub é um contrato de dados**, não uma convenção de estilo. Ele padroniza a leitura e reduz o esforço de quem avalia projetos — o `ProjectCard` depende dele para montar o layout em três colunas. Repositórios sem esse padrão exibem apenas o primeiro campo.
- **O Turbopack** (compilador Rust nativo do Next.js 16) reduziu o tempo de build de desenvolvimento em ~70%, tornando viável iterar sobre 5 versões de dicionário e dezenas de componentes em paralelo.
- **`cacheComponents: true`** (PPR estabilizado na v16.2) substituiu flags experimentais e permitiu revalidação granular por rota sem sobrescrita de cache global.
- **A proteção `taint: true`** impede que objetos do servidor (tokens, dados internos) vazem para o bundle do cliente — prática herdada de sistemas com exigência de conformidade regulatória.
- **O MCP helper (`mcp-env.js`)** valida a existência dos 10 assets multilíngues (5 PDFs + 5 OG images) a cada inicialização, evitando deploys com arquivos faltantes.

---

## 6. Resultados

**O que foi entregue:**

- **Legibilidade imediata**: qualquer pessoa abre um card de projeto e lê em segundos o problema resolvido, a solução adotada e o impacto gerado — sem necessidade de abrir o código.
- **Alcance global**: 5 idiomas com CVs e imagens de compartilhamento (OG) dedicados por locale.
- **Consistência de dados**: validação automática dos 5 dicionários garante que nenhuma chave de tradução fique faltando em produção.
- **Segurança ativa**: configurações de proteção (HSTS, CSP, X-Frame-Options) alinhadas às práticas de ambientes corporativos regulados.

### Impacto no Negócio (Business Performance)

| Situação | Antes | Com este portfólio |
|---|---|---|
| Tempo para entender um projeto | Minutos (leitura de código) | Segundos (leitura do card) |
| Ambiguidade na avaliação | Alta — depende do contexto técnico do avaliador | Baixa — estrutura padronizada: problema → solução → impacto |
| Escala de análise | Um repositório por vez | Vários projetos avaliados em sequência |
| Alcance geográfico | Apenas pt-BR | 5 locales com CV e imagem social por idioma |

> Ao padronizar a descrição de cada projeto em `"Problema | Solução | Impacto"`, o portfólio reduz o tempo de avaliação e diminui a dependência de conhecimento técnico para compreender o valor de cada entrega.

---

## 7. Stack Técnica

| Categoria | Tecnologia | Versão |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.3 |
| UI | React | 19.2.5 |
| Linguagem | TypeScript (Strict Mode) | 6.0.2 |
| Estilização | TailwindCSS + PostCSS | 4.2.1 |
| Animações | Framer Motion | 12.34.0 |
| Ícones | Lucide React | ^1.7.0 |
| Runtime | Node.js (Krypton LTS) | 24.x |
| Bundler | Turbopack (Rust nativo) | — |
| GitHub API | Octokit REST | ^22.0.1 |
| i18n | next-intl | ^4.8.3 |
| Tema | next-themes | 0.4.6 |
| PDF CV | @react-pdf/renderer | ^4.3.2 |
| OG Images | @vercel/og | ^0.11.1 |
| Linting | ESLint 10 (Flat Config) | 10.0.0 |
| Formatação | Prettier | ^3.5.0 |
| Deploy | Vercel | — |

**Por que essas escolhas:**

- **Next.js App Router** — suporte a React Server Components mantém o token do GitHub exclusivamente no servidor, sem expô-lo ao cliente.
- **TypeScript 6.0 Strict Mode** com `noUncheckedIndexedAccess` e `exactOptionalPropertyTypes` — garante estabilidade em um projeto com múltiplos locales e contratos de dados críticos.
- **TailwindCSS 4.2 via `@tailwindcss/postcss`** — elimina o arquivo de configuração de conteúdo separado, reduzindo o bundle final.
- **`next-intl`** gerencia o middleware de detecção de locale; dicionários são carregados via `React.cache()` para máxima performance no servidor.

---

## 8. Como Executar

### Pré-requisitos

- Node.js `>= 24.x` ([download](https://nodejs.org))
- GitHub Personal Access Token (Fine-grained, permissão `Contents: Read-only`)

### Configuração

```bash
# 1. Clone o repositório
git clone https://github.com/Santosdevbjj/portfoliosantossergio.git
cd portfoliosantossergio

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Preencha no .env.local:
# GITHUB_TOKEN=seu_token_aqui
# NEXT_PUBLIC_GITHUB_USERNAME=Santosdevbjj
# NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Desenvolvimento

```bash
# Servidor de desenvolvimento com Turbopack
npm run dev

# Validação dos dicionários i18n
npm run i18n:validate

# Verificação de tipos TypeScript
npm run type-check
```

### Produção

```bash
npm run build
npm start

# Análise do bundle (opcional)
npm run analyze
```

### Como exibir um projeto no portfólio

Nos repositórios que você deseja exibir, configure:

1. **Tópico obrigatório**: adicione `portfolio` nos topics do repositório.
2. **Descrição** (campo *About*): use o padrão `"O problema aqui | A solução ali | O impacto final"`.
3. **Destaque**: adicione o tópico `featured` para posicionamento prioritário.
4. **Primeiro item**: adicione o tópico `primeiro` para posicioná-lo no topo da grade.

> ⚠️ O componente `ProjectCard` depende do separador `|` para montar o layout em três colunas. Sem ele, apenas o primeiro campo é exibido.

---

## 9. Aprendizados

O maior aprendizado deste projeto foi entender que **a forma como você comunica uma solução é tão importante quanto a solução em si**.

As mesmas decisões que aplico em pipelines de dados — governança de fontes, contratos de interface, validação de schema, fallbacks seguros — foram transferidas diretamente para a construção deste site.

A decisão de usar a `description` do GitHub como fonte de dados estruturados (`Problema | Solução | Impacto`) foi o ponto de virada: o portfólio deixou de ser uma lista de projetos e passou a ser uma estrutura que organiza cada entrega em problema, solução e impacto.

Em uma próxima iteração, duas mudanças seriam prioritárias: implementar os testes E2E antes do primeiro deploy e adicionar a validação do `i18n` como step obrigatório no workflow de CI/CD.

---

## 10. Próximos Passos

- [ ] **CI/CD**: GitHub Actions com `type-check`, `i18n:validate` e lint obrigatórios em cada PR.
- [ ] **Testes E2E**: Playwright cobrindo as 5 rotas de locale e o pipeline de projetos.
- [ ] **Analytics**: ativação de GA4 ou Plausible com o consentimento LGPD granular já implementado.
- [ ] **Seção de artigos**: integração com o repositório `myArticles` (Markdown/MDX via `getArticleContent`).
- [ ] **Dashboard de ML**: visualização de métricas de performance dos modelos de Data Science do portfólio.
- [ ] **Busca semântica**: integração com `@upstash/vector` (já listado nas dependências) para busca de projetos e artigos.

---

## 📁 Estrutura do Projeto

```
portfoliosantossergio/
├── public/
│   ├── pdf/            # CVs multilíngues (pt-BR, en-US, es-ES, es-AR, es-MX)
│   ├── og/             # OG images por locale
│   ├── images/         # Foto de perfil e troféus DIO
│   └── icons/          # Favicon, apple-touch-icon
├── src/
│   ├── app/            # App Router (layout, pages, opengraph-image)
│   ├── components/     # Componentes React (ProjectCard, Hero, etc.)
│   ├── config/         # Categorias, constantes, mapeamentos de tópicos
│   ├── dictionaries/   # Dicionários i18n (5 locales) + validadores
│   ├── lib/            # Serviços: GitHub API, SEO, i18n, consent, logger
│   │   └── resume/     # Mapeamento de PDFs e conteúdo do CV por locale
│   └── types/          # Interfaces TypeScript (Dictionary, GitHubRepo, etc.)
├── tests/
│   └── i18n.schema.spec.ts  # Validação de placeholders cross-locale
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── vercel.json
└── mcp-env.js          # Validador de assets multilíngues para desenvolvimento
```

---

## 📬 Contato

[![Portfolio](https://img.shields.io/badge/Portfólio-portfoliosantossergio.vercel.app-111827?style=for-the-badge&logo=vercel&logoColor=00eaff)](https://portfoliosantossergio.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Sérgio_Santos-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/santossergioluiz)
[![Medium](https://img.shields.io/badge/Medium-@sergiosantosluiz-12100E?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@sergiosantosluiz)
[![Email](https://img.shields.io/badge/Email-santossergiorealbjj@outlook.com-0078D4?style=for-the-badge&logo=microsoftoutlook&logoColor=white)](mailto:santossergiorealbjj@outlook.com)

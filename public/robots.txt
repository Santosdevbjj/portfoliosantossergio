# Robots.txt - Sérgio Santos Portfolio
# Mission-Critical Data Engineering & Systems

# 1. Proteção de Propriedade Intelectual (Bloqueio de Crawler de IA)
User-agent: GPTBot
Disallow: /

User-agent: CCBot
Disallow: /

# 2. Regras Globais para Buscadores (Google, Bing, DuckDuckGo)
User-agent: *
Allow: /

# Bloqueio de diretórios internos do Next.js e arquivos de configuração
Disallow: /_next/
Disallow: /static/
Disallow: /api/
Disallow: /private/
Disallow: /admin/

# 3. Localização do Sitemap (Essencial para Indexação Multilíngue)
# O Sitemap informará ao Google a existência das rotas /pt, /en e /es
Sitemap: https://portfoliosantossergio.vercel.app/sitemap.xml

# Hosted on Vercel - Optimized for Next.js 15

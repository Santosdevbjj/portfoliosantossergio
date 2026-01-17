import { Inter } from 'next/font/google';
import '../globals.css';
import { Metadata } from 'next';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // Melhora a performance de carregamento da fonte
});

// 1. Geração de Metadados Dinâmicos e SEO Internacional
export async function generateMetadata(props: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang;
  
  const titles: Record<string, string> = {
    pt: "Sérgio Santos | Analista de Ciência de Dados",
    en: "Sérgio Santos | Data Science Analyst",
    es: "Sérgio Santos | Analista de Ciencia de Datos"
  };

  const descriptions: Record<string, string> = {
    pt: "15+ anos de experiência em sistemas críticos e transição para Ciência de Dados e IA.",
    en: "15+ years of experience in mission-critical systems and transition to Data Science & AI.",
    es: "15+ años de experiencia en sistemas críticos y transición a Ciencia de Datos e IA."
  };

  return {
    title: titles[lang] || titles.pt,
    description: descriptions[lang] || descriptions.pt,
    viewport: 'width=device-width, initial-scale=1', // Garante responsividade
    icons: {
      icon: '/icon.png',
      apple: '/icon.png', // Para dispositivos iOS
    },
    // Define a imagem social correta conforme o idioma
    openGraph: {
      title: titles[lang],
      description: descriptions[lang],
      images: [
        {
          url: `/og-image-${lang}.png`,
          width: 1200,
          height: 630,
          alt: `Sérgio Santos Portfolio - ${lang.toUpperCase()}`,
        }
      ],
      type: 'website',
    },
    // Adiciona links alternativos para SEO multilingue (Hreflang)
    alternates: {
      languages: {
        'pt-BR': '/pt',
        'en-US': '/en',
        'es-ES': '/es',
      },
    },
  };
}

// 2. Root Layout Principal
export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const { lang } = params;
  const { children } = props;

  return (
    // Define o atributo lang dinâmico para acessibilidade e leitores de tela
    <html lang={lang} suppressHydrationWarning>
      <body 
        className={`${inter.className} bg-white dark:bg-[#0f172a] text-gray-900 dark:text-slate-200 antialiased`}
      >
        {/* O div min-h-screen garante que o fundo cubra toda a tela.
          Adicionado suporte a cores de fundo para Dark Mode conforme sua page.tsx
        */}
        <div className="min-h-screen relative flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}

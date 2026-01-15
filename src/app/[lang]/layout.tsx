import { Inter } from 'next/font/google';
import '../globals.css';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

// Função para gerar as Metatags dinâmicas (SEO e Redes Sociais)
export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const { lang } = params;
  
  const titles: Record<string, string> = {
    pt: "Sérgio Santos | Analista de Ciência de Dados",
    en: "Sérgio Santos | Data Science Analyst",
    es: "Sérgio Santos | Analista de Ciencia de Datos"
  };

  return {
    title: titles[lang] || titles.pt,
    description: "15+ anos de experiência em sistemas críticos e transição para Ciência de Dados e IA.",
    icons: {
      icon: '/icon.png',
    },
    openGraph: {
      images: [`/og-image-${lang}.png`],
    },
  };
}

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={params.lang}>
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        {/* Aqui você pode futuramente inserir o componente <Header /> */}
        
        <div className="min-h-screen">
          {children}
        </div>

        {/* Aqui você pode futuramente inserir o componente <Footer /> */}
      </body>
    </html>
  );
}

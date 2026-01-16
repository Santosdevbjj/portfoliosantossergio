import { Inter } from 'next/font/google';
import '../globals.css';
import { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

// 1. Correção para Next.js 15: params agora é uma Promise
export async function generateMetadata(props: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const params = await props.params;
  const lang = params.lang;
  
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

// 2. Correção para Next.js 15: O layout deve ser async para dar await no params
export default async function RootLayout(props: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const params = await props.params;
  const children = props.children;

  return (
    <html lang={params.lang}>
      <body className={`${inter.className} bg-white text-gray-900 antialiased`}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}

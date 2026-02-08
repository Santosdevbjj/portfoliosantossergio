// src/components/ProxyPage.tsx
import { getDictionary } from "@/dictionaries";
import { Locale } from "@/types/dictionary";
import { notFound } from "next/navigation";

interface ProxyPageProps {
  lang: Locale;
  children: (dictionary: await ReturnType<typeof getDictionary>) => React.ReactNode;
}

/**
 * ProxyPage: Componente de alta ordem (Server Side) 
 * que injeta o dicionário otimizado.
 */
export default async function ProxyPage({ lang, children }: ProxyPageProps) {
  // 1. Validação de segurança para locales não suportados
  const supportedLocales: Locale[] = ["pt-BR", "en-US", "es-ES", "es-AR", "es-MX"];
  
  if (!supportedLocales.includes(lang)) {
    notFound();
  }

  // 2. Busca o dicionário de forma otimizada (memoizada pelo Next.js)
  try {
    const dictionary = await getDictionary(lang);

    // 3. Renderiza os filhos passando o dicionário como prop/argumento
    return <>{children(dictionary)}</>;
  } catch (error) {
    console.error("Erro ao carregar dicionário:", error);
    notFound();
  }
}

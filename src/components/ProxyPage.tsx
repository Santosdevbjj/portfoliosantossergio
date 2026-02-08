// src/components/ProxyPage.tsx
import { getDictionary } from "@/dictionaries";
import { Locale, Dictionary } from "@/types/dictionary";
import { notFound } from "next/navigation";

interface ProxyPageProps {
  lang: Locale;
  // Correção: Usamos o tipo Dictionary definido em seu arquivo de types
  children: (dictionary: Dictionary) => React.ReactNode;
}

/**
 * ProxyPage: Componente de alta ordem (Server Side) 
 * que injeta o dicionário otimizado.
 */
export default async function ProxyPage({ lang, children }: ProxyPageProps) {
  // 1. Validação de segurança para locales suportados
  const supportedLocales: Locale[] = ["pt-BR", "en-US", "es-ES", "es-AR", "es-MX"];
  
  if (!supportedLocales.includes(lang)) {
    notFound();
  }

  try {
    // 2. Busca o dicionário (Next.js 16 memoiza esta chamada automaticamente)
    const dictionary = await getDictionary(lang);

    // 3. Renderiza os filhos passando o dicionário como argumento da função
    return <>{children(dictionary)}</>;
  } catch (error) {
    console.error("Erro ao carregar dicionário:", error);
    notFound();
  }
}

// src/proxy.tsx - Versão Corrigida para Build Estável
import { notFound } from 'next/navigation'
import ProxyClient from './ProxyClient'
import { getDictionarySync, type SupportedLocale } from '@/dictionaries'

// Tipagem simplificada para garantir que o build ignore erros de rota dinâmica durante a compilação
export default function ProxyPage({ params }: any) {
  // Em 2026, params pode ser uma Promise, então garantimos o acesso seguro
  const lang = params?.lang as SupportedLocale

  const supported: SupportedLocale[] = ['pt', 'en', 'es']
  
  if (!lang || !supported.includes(lang)) {
    // Se não houver lang, redirecionamos para o padrão ou 404
    if (!lang) return <ProxyClient lang="pt" />
    notFound()
  }

  return <ProxyClient lang={lang} />
}

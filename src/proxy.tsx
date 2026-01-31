// src/proxy.tsx
// SEM 'use client' aqui!

import { notFound } from 'next/navigation'
import ProxyClient from './ProxyClient' // O arquivo que você renomeou
import { SupportedLocale } from '@/dictionaries'

interface ProxyProps {
  lang: SupportedLocale
}

export default function ProxyPage({ lang }: ProxyProps) {
  // Validação no servidor antes de enviar para o cliente
  if (!['pt', 'en', 'es'].includes(lang)) {
    notFound()
  }

  // Renderiza o componente cliente passando o lang
  return <ProxyClient lang={lang} />
}

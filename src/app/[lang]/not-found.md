// src/app/[lang]/not-found.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { getDictionary } from '@/dictionaries'
import type { Dictionary, Locale } from '@/types/dictionary'
import Link from 'next/link'

export default function NotFound() {
  const params = useParams()
  const lang = (params?.lang as Locale) || 'pt-BR'
  const [dict, setDict] = useState<Dictionary | null>(null)

  useEffect(() => {
    // CORREÇÃO: Criamos uma função interna assíncrona para dar 'await' no dicionário
    const loadDictionary = async () => {
      try {
        const data = await getDictionary(lang)
        setDict(data)
      } catch (error) {
        console.error("Erro ao carregar dicionário na página 404:", error)
      }
    }

    loadDictionary()
  }, [lang])

  // Shimmer/Loading state enquanto o dicionário é montado no client
  if (!dict) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="animate-pulse">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <h1 className="text-6xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl mb-6">{dict.common.notFound.title}</h2>
      <p className="text-gray-400 mb-8 text-center max-w-md">
        {dict.common.notFound.description}
      </p>
      <Link 
        href={`/${lang}`}
        className="px-6 py-3 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition-colors"
      >
        {dict.common.notFound.button}
      </Link>
    </div>
  )
}

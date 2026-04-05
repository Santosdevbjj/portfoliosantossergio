/**
 * src/mdx-components.tsx
 * Versão: Abril de 2026
 * Stack: Next.js 16.2.2 | React 19 | TS 6.0.2 | Tailwind 4.2 | Node 24
 * Correção: Filtragem rigorosa de props para Link (Incompatibilidade exata de tipos)
 */
import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import type { ImageProps } from 'next/image';
import Link from 'next/link';
import { type ComponentPropsWithoutRef } from 'react';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 1. Títulos Otimizados (Tailwind 4.2 Engine)
    h1: ({ children, ...props }: ComponentPropsWithoutRef<'h1'>) => (
      <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-900 dark:text-white mt-12 mb-6" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }: ComponentPropsWithoutRef<'h2'>) => (
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 mt-10 mb-4" {...props}>
        {children}
      </h2>
    ),

    // 2. Parágrafos e Texto
    p: ({ children, ...props }: ComponentPropsWithoutRef<'p'>) => (
      <p className="text-base md:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 mb-6" {...props}>
        {children}
      </p>
    ),

    // 3. Links (SOLUÇÃO DEFINITIVA PARA O ERRO DE TYPE CHECK)
    a: ({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) => {
      const isInternal = href?.startsWith('/') || href?.startsWith('#');
      const className = "font-medium text-blue-600 dark:text-blue-400 underline decoration-2 underline-offset-4 hover:text-blue-700 transition-colors";
      
      if (isInternal) {
        /** * No TS 6.0.2, não podemos passar o spread {...props} diretamente para o Link 
         * devido a incompatibilidades de eventos (onMouseEnter, onTouchStart, etc) sendo undefined.
         * Extraímos apenas o essencial para o roteamento.
         */
        return (
          <Link 
            href={href as string} 
            className={className}
            title={props.title}
            id={props.id}
          >
            {children}
          </Link>
        );
      }

      // Para links externos, a tag <a> normal aceita todas as props perfeitamente
      return (
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={className} 
          {...props}
        >
          {children}
        </a>
      );
    },

    // 4. Imagens (Otimizadas para Turbopack)
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto', borderRadius: '1rem' }}
        className="my-10 shadow-2xl"
        width={1200}
        height={630}
        {...(props as ImageProps)}
        alt={props.alt || "Ilustração técnica"}
      />
    ),

    // 5. Blocos de Código (Sintaxe Modernizada)
    code: ({ children, ...props }: ComponentPropsWithoutRef<'code'>) => (
      <code className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-sm font-mono text-pink-600 dark:text-pink-400" {...props}>
        {children}
      </code>
    ),
    pre: ({ children, ...props }: ComponentPropsWithoutRef<'pre'>) => (
      <pre className="bg-zinc-950 text-zinc-100 p-6 rounded-2xl overflow-x-auto my-8 border border-zinc-800 shadow-xl" {...props}>
        {children}
      </pre>
    ),

    // 6. Listas e Blockquotes
    ul: ({ children, ...props }: ComponentPropsWithoutRef<'ul'>) => (
      <ul className="list-disc list-inside space-y-2 mb-6 text-zinc-600 dark:text-zinc-400" {...props}>
        {children}
      </ul>
    ),
    blockquote: ({ children, ...props }: ComponentPropsWithoutRef<'blockquote'>) => (
      <blockquote className="border-l-4 border-blue-600 pl-6 italic my-10 text-zinc-500 dark:text-zinc-400" {...props}>
        {children}
      </blockquote>
    ),

    ...components,
  };
}

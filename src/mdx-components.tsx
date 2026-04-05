/**
 * src/mdx-components.tsx
 * Versão: Abril de 2026
 * Stack: Next.js 16.2.2 | React 19 | TS 6.0.2 | Tailwind 4.2 | Node 24
 * Correção: Incompatibilidade de LinkProps com exactOptionalPropertyTypes
 */
import type { MDXComponents } from 'mdx/types';
import Image from 'next/image';
import type { ImageProps } from 'next/image';
import Link from 'next/link';
import { type ComponentPropsWithoutRef } from 'react';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // 1. Títulos Otimizados (Tailwind 4.2)
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
    h3: ({ children, ...props }: ComponentPropsWithoutRef<'h3'>) => (
      <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 mt-8 mb-3" {...props}>
        {children}
      </h3>
    ),

    // 2. Parágrafos e Texto (Node 24 Performance)
    p: ({ children, ...props }: ComponentPropsWithoutRef<'p'>) => (
      <p className="text-base md:text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 mb-6" {...props}>
        {children}
      </p>
    ),

    // 3. Links (CORREÇÃO DO ERRO DE TYPE CHECK)
    a: ({ href, children, ...props }: ComponentPropsWithoutRef<'a'>) => {
      const isInternal = href?.startsWith('/') || href?.startsWith('#');
      const className = "font-medium text-blue-600 dark:text-blue-400 underline decoration-2 underline-offset-4 hover:text-blue-700 transition-colors";
      
      if (isInternal) {
        // CORREÇÃO: Extraímos propriedades que causam conflito com o Link do Next.js
        // Evita erro de 'undefined' em propriedades opcionais estritas
        const { onMouseEnter, onMouseLeave, onClick, ...rest } = props;
        
        return (
          <Link 
            href={href as string} 
            className={className}
            {...(onMouseEnter ? { onMouseEnter } : {})}
            {...(onMouseLeave ? { onMouseLeave } : {})}
            {...(onClick ? { onClick } : {})}
            {...rest}
          >
            {children}
          </Link>
        );
      }
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

    // 4. Imagens (Next.js 16.2 Turbopack optimized)
    img: (props) => (
      <Image
        sizes="100vw"
        style={{ width: '100%', height: 'auto', borderRadius: '1rem' }}
        className="my-10 shadow-2xl"
        width={1200}
        height={630}
        {...(props as ImageProps)}
        alt={props.alt || "Ilustração do artigo técnico"}
      />
    ),

    // 5. Listas
    ul: ({ children, ...props }: ComponentPropsWithoutRef<'ul'>) => (
      <ul className="list-disc list-inside space-y-2 mb-6 text-zinc-600 dark:text-zinc-400" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }: ComponentPropsWithoutRef<'ol'>) => (
      <ol className="list-decimal list-inside space-y-2 mb-6 text-zinc-600 dark:text-zinc-400" {...props}>
        {children}
      </ol>
    ),

    // 6. Blocos de Código e Citações
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
    blockquote: ({ children, ...props }: ComponentPropsWithoutRef<'blockquote'>) => (
      <blockquote className="border-l-4 border-blue-600 pl-6 italic my-10 text-zinc-500 dark:text-zinc-400" {...props}>
        {children}
      </blockquote>
    ),

    ...components,
  };
}

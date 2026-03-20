'use client';

/**
 * JSON-LD SCHEMA COMPONENT - PORTFÓLIO SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔ Stack: Next.js 16.2.0, React 19, TS 6.0, Node 24
 * ✔ SEO: Suporte a Schema.org (Person, Article, SoftwareSourceCode, WebSite)
 * ✔ I18n: Compatível com PT-BR, EN-US, ES-ES, ES-AR, ES-MX
 */

import { useMemo } from 'react';

/**
 * Tipagens Estritas para Schema.org (TS 6.0)
 */
interface BaseSchema {
  readonly '@context': 'https://schema.org';
  readonly '@type': string;
}

export interface PersonSchema extends BaseSchema {
  readonly '@type': 'Person';
  name: string;
  url: string;
  image?: string;
  jobTitle?: string;
  description?: string;
  sameAs?: string[];
}

export interface WebsiteSchema extends BaseSchema {
  readonly '@type': 'WebSite';
  name: string;
  url: string;
  description?: string;
  inLanguage?: string;
}

export interface ArticleSchema extends BaseSchema {
  readonly '@type': 'Article' | 'BlogPosting';
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
  image?: string;
  url: string;
}

export interface ProjectSchema extends BaseSchema {
  readonly '@type': 'SoftwareSourceCode';
  name: string;
  description: string;
  codeRepository: string;
  programmingLanguage?: string | string[];
  runtimePlatform?: string;
  author: {
    '@type': 'Person';
    name: string;
  };
}

export type JsonLdSchema =
  | PersonSchema
  | ArticleSchema
  | ProjectSchema
  | WebsiteSchema
  | Record<string, unknown>;

export interface JsonLdProps {
  readonly schema: JsonLdSchema | JsonLdSchema[];
}

/**
 * Componente JsonLd
 * Injeta dados estruturados de forma segura para SEO de Missão Crítica.
 */
export default function JsonLd({ schema }: JsonLdProps) {
  // Memoização para evitar re-stringify em cada render do React 19
  const serializedSchemas = useMemo(() => {
    const schemas = Array.isArray(schema) ? schema : [schema];
    return schemas.map((item) => {
      try {
        return JSON.stringify(item);
      } catch (e) {
        console.error('[JSON-LD Serialization Error]:', e);
        return null;
      }
    }).filter(Boolean) as string[];
  }, [schema]);

  if (serializedSchemas.length === 0) return null;

  return (
    <>
      {serializedSchemas.map((jsonString, index) => (
        <script
          key={`jsonld-${index}-${jsonString.length}`}
          type="application/ld+json"
          // React 19 lida com dangerouslySetInnerHTML de forma ultra-eficiente
          dangerouslySetInnerHTML={{ __html: jsonString }}
        />
      ))}
    </>
  );
}

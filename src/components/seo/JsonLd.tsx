import React from "react"

/**
 * JSON-LD Schema Types
 */

export type JsonLdSchema =
  | PersonSchema
  | ArticleSchema
  | ProjectSchema
  | WebsiteSchema
  | OrganizationSchema
  | Record<string, unknown>

/**
 * Base Schema
 */

interface BaseSchema {
  "@context": "https://schema.org"
  "@type": string
}

/**
 * Person Schema
 */

export interface PersonSchema extends BaseSchema {
  "@type": "Person"
  name: string
  url: string
  image?: string
  jobTitle?: string
  sameAs?: string[]
}

/**
 * Website Schema
 */

export interface WebsiteSchema extends BaseSchema {
  "@type": "WebSite"
  name: string
  url: string
}

/**
 * Organization Schema
 */

export interface OrganizationSchema extends BaseSchema {
  "@type": "Organization"
  name: string
  url: string
  logo?: string
}

/**
 * Article Schema
 */

export interface ArticleSchema extends BaseSchema {
  "@type": "Article" | "BlogPosting"
  headline: string
  description: string
  datePublished: string
  dateModified?: string
  author: {
    "@type": "Person"
    name: string
  }
  url: string
  image?: string
}

/**
 * Project Schema
 */

export interface ProjectSchema extends BaseSchema {
  "@type": "SoftwareSourceCode"
  name: string
  description: string
  codeRepository: string
  programmingLanguage?: string
  author?: {
    "@type": "Person"
    name: string
  }
}

/**
 * Component Props
 */

export interface JsonLdProps {
  schema: JsonLdSchema | JsonLdSchema[]
}

/**
 * JsonLd Component
 *
 * Safe JSON-LD injection for SEO.
 * Compatible with Next.js App Router.
 */

export default function JsonLd({ schema }: JsonLdProps) {
  const json = Array.isArray(schema) ? schema : [schema]

  return (
    <>
      {json.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item),
          }}
        />
      ))}
    </>
  )
}

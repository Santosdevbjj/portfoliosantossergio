"use client"

import type { JsonLdSchema } from "@/components/seo/JsonLd"
import { personSchema, websiteSchema } from "@/lib/schema"

type Props = {
  schema?: JsonLdSchema | JsonLdSchema[]
}

export default function OpenGraph({ schema }: Props) {
  const schemas: JsonLdSchema[] = [
    personSchema(),
    websiteSchema(),
  ]

  if (schema) {
    if (Array.isArray(schema)) {
      schemas.push(...schema)
    } else {
      schemas.push(schema)
    }
  }

  return (
    <>
      {schemas.map((item, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(item),
          }}
        />
      ))}
    </>
  )
}

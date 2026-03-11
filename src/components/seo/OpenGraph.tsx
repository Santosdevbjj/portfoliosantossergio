"use client"

import { personSchema, websiteSchema } from "@/lib/schema"

type Props = {
  schema?: object
}

export default function OpenGraph({ schema }: Props) {
  const schemas = [personSchema(), websiteSchema()]

  if (schema) {
    schemas.push(schema)
  }

  return (
    <>
      {schemas.map((item, index) => (
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

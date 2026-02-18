import type { ErrorDictionary } from "@/types/error-dictionary"

import ptBR from "./pt-BR.json"
import enUS from "./en-US.json"
import esES from "./es-ES.json"
import esAR from "./es-AR.json"
import esMX from "./es-MX.json"

export const errorDictionaries: Record<string, ErrorDictionary> = {
  "pt-BR": ptBR,
  "en-US": enUS,
  "es-ES": esES,
  "es-AR": esAR,
  "es-MX": esMX,
}

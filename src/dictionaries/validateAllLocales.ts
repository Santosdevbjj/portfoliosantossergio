import pt from "./pt.json";
import en from "./en.json";
import es from "./es.json";
import { validateCrossLocale } from "./validateCrossLocale";

export function validateAllLocales() {
  const errors = [
    ...validateCrossLocale(pt, en, "pt", "en"),
    ...validateCrossLocale(pt, es, "pt", "es")
  ];

  if (errors.length) {
    console.error("❌ i18n validation failed:\n");
    errors.forEach(err => console.error(err));
    process.exit(1);
  }

  console.log("✅ i18n dictionaries are fully aligned");
}

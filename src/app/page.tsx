// src/app/page.tsx
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export default function RootPage() {
  const lang = cookies().get("lang")?.value ?? "pt";
  redirect(`/${lang}`);
}

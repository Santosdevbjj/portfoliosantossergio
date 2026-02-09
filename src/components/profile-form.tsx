// src/components/profile-form.tsx
'use client';

import { updateProfileAction } from "@/actions/user-actions";
import { ErrorDictionary } from "@/types/error-dictionary";
import ptBR from "@/dictionaries/errors/pt-BR.json"; // Ou via Hook de i18n

export function ProfileForm() {
  const dict = ptBR.errors; // Exemplo simplificado

  async function handleSubmit(formData: FormData) {
    const result = await updateProfileAction(formData);

    if (!result.success && result.error) {
      const errorKey = result.error.name as keyof ErrorDictionary;
      const translation = dict[errorKey] || dict.InternalServerError;

      // Exibindo o erro traduzido conforme o dicionário
      alert(`${translation.title}: ${translation.message}\nID: ${result.error.errorId}`);
    }
  }

  return (
    <form action={handleSubmit}>
      <input name="name" />
      <button type="submit">Salvar</button>
    </form>
  );
}

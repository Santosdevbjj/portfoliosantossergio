'use client'; // Obrigatório para usar hooks como useActionState

import { useActionState } from 'react';
import { updateProfileAction } from '@/actions/user-actions';
import type { Dictionary, Locale } from '@/types/dictionary';

interface ProfileFormProps {
  readonly dict: Dictionary;
  readonly lang: Locale;
}

export default function ProfileForm({ dict, lang }: ProfileFormProps) {
  /**
   * 1. Onde colocar o Hook:
   * [state] -> Retorno da action (sucesso ou erro)
   * [formAction] -> Função que você passará para o atributo 'action' do <form>
   * [isPending] -> Booleano que indica se o servidor está processando
   */
  const [state, formAction, isPending] = useActionState(updateProfileAction, null);

  return (
    <div className="max-w-md mx-auto p-4">
      {/* 2. Vincular a action ao formulário */}
      <form action={formAction} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            {dict.about.title}
          </label>
          <input
            name="name" // O 'name' deve ser igual ao que você busca no formData.get("name")
            type="text"
            className="w-full p-2 border rounded dark:bg-zinc-900"
            disabled={isPending}
          />
        </div>

        {/* 3. Exibição do Erro Crítico (Multilingue) */}
        {state?.success === false && (
          <div className="p-3 rounded bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400 font-bold">
              {/* Aqui acessamos o dicionário de erros usando a chave vinda do servidor */}
              {dict.states.error}: {dict.common.error}
            </p>
            <p className="text-xs text-red-500">
              {/* Mapeamento dinâmico: busca a tradução exata da chave ValidationError, etc */}
              {/* @ts-ignore - Garantindo que a chave existe no dicionário de erros */}
              {dict.errors?.[state.error.name]?.message || state.error.message}
            </p>
          </div>
        )}

        {/* 4. Feedback de Sucesso */}
        {state?.success === true && (
          <p className="text-sm text-green-600">
            {state.message || "Sucesso!"}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          {isPending ? dict.common.loading : dict.contact.buttonText}
        </button>
      </form>
    </div>
  );
}

'use client';

import { useActionState } from "react";
import { updateProfileAction } from "@/actions/user-actions";
import { ErrorDictionary } from "@/types/error-dictionary";
import ErrorBox from "@/components/ErrorBox";
import { Loader2, Save } from "lucide-react";

// Simulando a importação do dicionário (Em produção, use seu Hook de i18n)
import ptBR from "@/dictionaries/errors/pt-BR.json";

export function ProfileForm() {
  // 1. Hook de estado da Server Action (Padrão Next.js 16)
  const [state, formAction, isPending] = useActionState(updateProfileAction, null);

  // No seu sistema real, 'dict' viria de um Contexto de Idioma
  const dict = ptBR.errors as ErrorDictionary;

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-6">
      <form action={formAction} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label 
            htmlFor="name" 
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            Nome Completo
          </label>
          <input
            id="name"
            name="name"
            disabled={isPending}
            placeholder="Digite seu nome..."
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 outline-none transition-all disabled:opacity-50"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-slate-400"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isPending ? "Salvando..." : "Salvar Alterações"}
        </button>
      </form>

      {/* 2. Exibição Consistente de Erros */}
      {state?.success === false && state.error && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <ErrorBox
            errorKey={state.error.name as keyof ErrorDictionary}
            dictionary={dict}
            errorId={state.error.errorId}
            onRetry={() => {
              // Lógica opcional de limpar erro ou focar no campo
              const input = document.getElementById('name');
              input?.focus();
            }}
            retryLabel="Corrigir agora"
          />
        </div>
      )}

      {/* 3. Feedback de Sucesso */}
      {state?.success && (
        <p className="text-center text-sm text-green-600 font-medium animate-bounce">
          Perfil atualizado com sucesso!
        </p>
      )}
    </div>
  );
}

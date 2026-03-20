'use client';

import { useActionState } from 'react';
import { updateProfileAction } from '@/actions/user-actions';
import type { Dictionary, Locale } from '@/types/dictionary';
import type { ErrorDictionary } from '@/types/error-dictionary';

interface ProfileFormProps {
  readonly dict: Dictionary & { errors: ErrorDictionary }; // Integrando o dicionário de erros
  readonly lang: Locale;
}

export default function ProfileForm({ dict, lang }: ProfileFormProps) {
  /**
   * React 19 useActionState: 
   * Gerencia pendência e estado sem necessidade de useEffect ou useState manual.
   */
  const [state, formAction, isPending] = useActionState(updateProfileAction, null);

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 lg:p-8 transition-all duration-300">
      <form action={formAction} className="flex flex-col gap-6">
        
        {/* Campo de Nome */}
        <div className="flex flex-col gap-2">
          <label 
            htmlFor="name" 
            className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
          >
            {dict.about.title}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            disabled={isPending}
            placeholder="Seu nome técnico"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 
                     bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     disabled:opacity-50 disabled:cursor-not-allowed transition-all outline-hidden"
          />
        </div>

        {/* ÁREA DE ERROS (Totalmente Integrada ao Dicionário) */}
        {state?.success === false && (
          <div className="flex flex-col gap-2 p-4 rounded-xl border border-red-200 dark:border-red-900/30 
                        bg-red-50 dark:bg-red-950/20 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold">
              <span className="text-lg">⚠️</span>
              {/* Tradução Dinâmica do Título do Erro */}
              <h3>{dict.errors[state.error.name].title}</h3>
            </div>
            <p className="text-sm text-red-600 dark:text-red-300">
              {/* Tradução Dinâmica da Mensagem de Erro */}
              {dict.errors[state.error.name].message}
            </p>
            <div className="mt-1 text-xs text-red-500/80 italic">
              {/* Sugestão de Ação do Dicionário */}
              <strong>Ação:</strong> {dict.errors[state.error.name].action}
            </div>
            <span className="text-[10px] opacity-50 font-mono">ID: {state.error.errorId}</span>
          </div>
        )}

        {/* FEEDBACK DE SUCESSO */}
        {state?.success === true && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 
                        dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
            ✅ {dict.states.loading === 'Carregando...' ? 'Perfil atualizado!' : 'Profile updated!'}
          </div>
        )}

        {/* Botão de Submissão */}
        <button
          type="submit"
          disabled={isPending}
          className="relative w-full py-3 px-6 rounded-xl font-bold text-white
                   bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500
                   active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100
                   shadow-lg shadow-blue-500/20 transition-all cursor-pointer overflow-hidden"
        >
          <span className={isPending ? "opacity-0" : "opacity-100"}>
            {dict.contact.buttonText || 'Salvar Alterações'}
          </span>
          
          {isPending && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </button>
      </form>
    </div>
  );
}

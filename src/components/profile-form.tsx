'use client';

import { useActionState } from 'react';
import { updateProfileAction } from '@/actions/user-actions';
import type { ErrorDictionary } from '@/types/error-dictionary';
import ErrorBox from '@/components/ErrorBox';
import { Loader2, Save } from 'lucide-react';

import ptBR from '@/dictionaries/errors/pt-BR.json';

export function ProfileForm() {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    null,
  );

  const dict = ptBR.errors as ErrorDictionary;

  return (
    <div className="max-w-md mx-auto space-y-6">
      <form action={formAction} className="space-y-4">
        <input
          id="name"
          name="name"
          placeholder="Nome completo"
          className="w-full rounded-lg border px-4 py-2"
          required
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-slate-400"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {isPending ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>

      {state?.success === false && state.error && (       
        <ErrorBox
         errorKey={state.error.name}
         dictionary={dict}
         errorId={state.error.errorId}
         onRetry={() =>
         document.getElementById("name")?.focus()
      }
     retryLabel="Corrigir agora"
    />
      )}

      {state?.success && (
        <p className="text-center text-green-600 font-medium">
          Perfil atualizado com sucesso!
        </p>
      )}
    </div>
  );
}

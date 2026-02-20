'use client';

import { useActionState, useMemo } from 'react';
import { updateProfileAction } from '@/actions/user-actions';
import type { ErrorDictionary } from '@/types/error-dictionary';
import type { SupportedLocale } from '@/lib/i18n/locale';
import { isSupportedLocale } from '@/lib/i18n/locale';
import { getErrorDictionary } from '@/dictionaries/errors';
import ErrorBox from '@/components/ErrorBox';
import { Loader2, Save } from 'lucide-react';

interface ProfileFormProps {
  locale: string;
}

export function ProfileForm({ locale }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    null,
  );

  const resolvedLocale: SupportedLocale = useMemo(() => {
    return isSupportedLocale(locale) ? locale : 'pt-BR';
  }, [locale]);

  const dict: ErrorDictionary = useMemo(() => {
    return getErrorDictionary(resolvedLocale);
  }, [resolvedLocale]);

  return (
    <div className="w-full max-w-md mx-auto px-4 sm:px-0 space-y-6">
      <form action={formAction} className="space-y-4">
        <input
          id="name"
          name="name"
          placeholder={
            resolvedLocale.startsWith('en')
              ? 'Full name'
              : resolvedLocale.startsWith('es')
              ? 'Nombre completo'
              : 'Nome completo'
          }
          className="w-full rounded-lg border px-4 py-2 text-sm sm:text-base"
          required
        />

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg disabled:bg-slate-400 transition active:scale-95"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}

          {isPending
            ? resolvedLocale.startsWith('en')
              ? 'Saving...'
              : resolvedLocale.startsWith('es')
              ? 'Guardando...'
              : 'Salvando...'
            : resolvedLocale.startsWith('en')
            ? 'Save Changes'
            : resolvedLocale.startsWith('es')
            ? 'Guardar Cambios'
            : 'Salvar Alterações'}
        </button>
      </form>

      {state?.success === false && state.error && (
        <ErrorBox
          errorKey={state.error.name}
          dictionary={dict}
          errorId={state.error.errorId}
          onRetry={() =>
            document.getElementById('name')?.focus()
          }
          retryLabel={
            resolvedLocale.startsWith('en')
              ? 'Fix now'
              : resolvedLocale.startsWith('es')
              ? 'Corregir ahora'
              : 'Corrigir agora'
          }
        />
      )}

      {state?.success && (
        <p className="text-center text-green-600 font-medium text-sm sm:text-base">
          {resolvedLocale.startsWith('en')
            ? 'Profile updated successfully!'
            : resolvedLocale.startsWith('es')
            ? '¡Perfil actualizado con éxito!'
            : 'Perfil atualizado com sucesso!'}
        </p>
      )}
    </div>
  );
}

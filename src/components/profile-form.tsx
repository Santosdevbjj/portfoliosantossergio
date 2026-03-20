'use client';

import { useActionState, useMemo, useRef } from 'react';
import { updateProfileAction } from '@/actions/user-actions';
import type { ErrorKey } from '@/types/error-dictionary';
import type { Locale } from '@/types/dictionary';
import { getErrorDictionary } from '@/dictionaries/errors';
import ErrorBox from '@/components/ErrorBox';
import { Loader2, Save, User } from 'lucide-react';

/**
 * PROFILE FORM COMPONENT - SÉRGIO SANTOS PORTFOLIO
 * -----------------------------------------------------------------------------
 * ✔ React 19: useActionState para gerenciamento de formulários nativo
 * ✔ Next.js 16.2: Server Actions com feedback de UI pendente
 * ✔ Tailwind 4.2: Input ring focus e transições suaves
 * ✔ Fix: Removido retryLabel (agora gerenciado internamente pelo ErrorBox via prop lang)
 */

interface ProfileFormProps {
  readonly locale: string;
}

export function ProfileForm({ locale }: ProfileFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Cast seguro para o tipo Locale do dicionário
  const lang = locale as Locale;

  // React 19 Hook para Server Actions
  const [state, formAction, isPending] = useActionState(
    updateProfileAction,
    null
  );

  // Memoiza o dicionário de erros para performance (Node 24 / React 19)
  const errorDict = useMemo(() => {
    return getErrorDictionary(lang);
  }, [lang]);

  /**
   * TRADUÇÕES DO FORMULÁRIO (I18N REGIONAL)
   */
  const i18n = useMemo(() => {
    const isEn = lang.startsWith('en');
    const isEs = lang.startsWith('es');
    const isAr = lang === 'es-AR';
    const isMx = lang === 'es-MX';

    return {
      placeholder: isEn ? 'Full name' : isEs ? 'Nombre completo' : 'Nome completo',
      save: isPending 
        ? (isEn ? 'Saving...' : isEs ? 'Guardando...' : 'Salvando...') 
        : (isEn ? 'Save Changes' : isEs ? (isAr || isMx ? 'Guardar Cambios' : 'Guardar') : 'Salvar Alterações'),
      success: isEn 
        ? 'Profile updated successfully!' 
        : isEs ? '¡Perfil actualizado con éxito!' : 'Perfil atualizado com sucesso!'
    };
  }, [lang, isPending]);

  return (
    <div className="w-full max-w-lg mx-auto p-1 sm:p-0 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <form action={formAction} className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-premium">
        
        <div className="space-y-2">
          <label 
            htmlFor="name" 
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1"
          >
            {i18n.placeholder}
          </label>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              ref={inputRef}
              id="name"
              name="name"
              type="text"
              placeholder={i18n.placeholder}
              className="w-full bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 pl-11 pr-4 py-3.5 text-sm sm:text-base focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-3 bg-slate-900 dark:bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.97] shadow-lg shadow-blue-500/20"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span className="tracking-tight">{i18n.save}</span>
        </button>
      </form>

      {/* FEEDBACK DE ERRO */}
      {state?.success === false && state.error && (
        <div className="mt-6">
          <ErrorBox
            errorKey={state.error.name as ErrorKey}
            dictionary={errorDict}
            lang={lang} // Prop necessária para as traduções internas do ErrorBox
            errorId={state.error.errorId}
            onRetry={() => inputRef.current?.focus()}
          />
        </div>
      )}

      {/* FEEDBACK DE SUCESSO */}
      {state?.success && (
        <div className="mt-6 p-4 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800/50 flex items-center justify-center gap-3 text-green-700 dark:text-green-400 font-bold text-sm animate-in zoom-in duration-300">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          {i18n.success}
        </div>
      )}
    </div>
  );
}

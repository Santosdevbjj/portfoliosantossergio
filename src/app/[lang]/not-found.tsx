import {
  getErrorDictionary,
} from '@/dictionaries/errors';
import {
  isSupportedLocale,
} from '@/lib/i18n/locale';
import { ErrorDisplay } from '@/components/error-display';

export default function NotFound({
  params,
}: {
  params: { lang: string };
}) {
  const locale = isSupportedLocale(params.lang)
    ? params.lang
    : 'pt-BR';

  const dictionary =
    getErrorDictionary(locale);

  return (
    <ErrorDisplay
      errorKey="NotFoundError"
      dictionary={dictionary}
      reset={() => {}}
    />
  );
}

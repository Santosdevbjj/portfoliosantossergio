import { errorDictionaries } from '@/dictionaries/errors';

export default function NotFound({
  params,
}: {
  params: { lang: string };
}) {
  const dictionary =
    errorDictionaries[params.lang] ??
    errorDictionaries['pt-BR'];

  return (
    <ErrorDisplay
      errorKey="NotFoundError"
      dictionary={dictionary}
      reset={() => {}}
    />
  );
}

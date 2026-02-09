"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <html>
      <body className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Algo deu errado</h1>
        <p className="mt-4 text-gray-500">
          {error.message}
        </p>
        <button
          onClick={reset}
          className="mt-6 rounded bg-blue-600 px-4 py-2 text-white"
        >
          Tentar novamente
        </button>
      </body>
    </html>
  );
}

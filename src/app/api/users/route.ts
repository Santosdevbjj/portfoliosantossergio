import { NextRequest, NextResponse } from "next/server";
import { NotFoundError } from "@/lib/errors";
import { handleApiError } from "@/lib/http/handleApiError";

/**
 * GET /api/users
 *
 * ✔ Next.js 16 App Router
 * ✔ TypeScript 6 strict safe
 * ✔ Alinhado com BaseError
 * ✔ Integrado ao ErrorDictionary multilíngue
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse> {
  try {
    /**
     * Simulação de busca de usuário
     * (Substituir por DB real futuramente)
     */
    const user: null | {
      id: string;
      name: string;
    } = null;

    if (!user) {
      /**
       * A mensagem aqui funciona como fallback.
       * A tradução real virá do ErrorDictionary
       * via handleApiError.
       */
      throw new NotFoundError("API_USERS_GET_001");
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error: unknown) {
    return handleApiError(error, request);
  }
}

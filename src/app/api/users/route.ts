// src/app/api/users/route.ts

import { NextRequest, NextResponse } from "next/server";
import {
  NotFoundError,
  MethodNotAllowedError,
} from "@/lib/errors";
import { handleApiError } from "@/lib/http/handleApiError";

/**
 * Entity type (strict TS 6 safe)
 */
interface User {
  readonly id: string;
  readonly name: string;
}

/**
 * GET /api/users
 *
 * ✔ Next.js 16 App Router
 * ✔ TypeScript 6 strict safe
 * ✔ Multilíngue via handleApiError
 * ✔ Integrado ao ErrorDictionary
 * ✔ Arquitetura preparada para DB real
 */
export async function GET(
  request: NextRequest
): Promise<NextResponse> {
  try {
    /**
     * Simulação de busca
     * (Substituir por banco futuramente)
     */
    const user: User | null = null;

    if (!user) {
      /**
       * A chave real será resolvida
       * pelo ErrorDictionary via handleApiError
       */
      throw new NotFoundError();
    }

    return NextResponse.json(
      { data: user },
      {
        status: 200,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error: unknown) {
    return handleApiError(error, request);
  }
}

/**
 * Bloqueia outros métodos explicitamente
 * Boa prática REST + alinhado ao seu MethodNotAllowedError
 */
export async function POST(): Promise<NextResponse> {
  return handleApiError(
    new MethodNotAllowedError(),
    undefined
  );
}

export async function PUT(): Promise<NextResponse> {
  return handleApiError(
    new MethodNotAllowedError(),
    undefined
  );
}

export async function DELETE(): Promise<NextResponse> {
  return handleApiError(
    new MethodNotAllowedError(),
    undefined
  );
}

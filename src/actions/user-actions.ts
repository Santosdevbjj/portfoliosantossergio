'use server';

import { logger } from "@/lib/logger";
import {
  ValidationError,
  InternalServerError,
  BaseError,
} from "@/lib/errors";
import type { ErrorKey } from "@/types/error-dictionary";

export type UpdateProfileActionState =
  | { success: true }
  | {
      success: false;
      error: {
        name: ErrorKey;
        message: string;
        errorId: string;
      };
    };

export async function updateProfileAction(
  _: UpdateProfileActionState | null,
  formData: FormData
): Promise<UpdateProfileActionState> {
  try {
    const rawName = formData.get("name");
    const name =
      typeof rawName === "string"
        ? rawName.trim()
        : "";

    if (!name || name.length < 3) {
      throw new ValidationError("Nome muito curto");
    }

    return { success: true };

  } catch (error: unknown) {
    const err =
      error instanceof BaseError
        ? error
        : new InternalServerError(
            error instanceof Error
              ? error.message
              : "Unexpected error"
          );

    logger.error(err);

    const errorKey: ErrorKey =
      err.name as ErrorKey;

    return {
      success: false,
      error: {
        name: errorKey,
        message: err.message,
        errorId: err.errorId,
      },
    };
  }
}

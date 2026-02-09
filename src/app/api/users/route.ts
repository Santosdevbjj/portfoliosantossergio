import { NextRequest, NextResponse } from "next/server";
import { NotFoundError } from "@/lib/errors";
import { handleApiError } from "@/lib/http/handleApiError";

export async function GET(req: NextRequest) {
  try {
    const user = null;

    if (!user) {
      throw new NotFoundError({
        errorLocationCode: "API_USERS_GET_001",
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    return handleApiError(error);
  }
}

import { BaseError } from "@/lib/errors";

export const logger = {
  error: (error: unknown) => {
    const env =
      process.env.NODE_ENV ?? "development";

    if (error instanceof BaseError) {
      const payload = {
        level: "ERROR",
        timestamp: new Date().toISOString(),
        name: error.name,
        message: error.message,
        errorId: error.errorId,
        env,
      };

      if (env === "development") {
        console.error(payload);
      } else {
        console.log(JSON.stringify(payload));
      }

      return;
    }

    console.error(error);
  },
};

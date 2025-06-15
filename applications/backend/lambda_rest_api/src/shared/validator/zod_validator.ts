import { errorMessages } from "../../application/domain/constants/error_messages/error.messages";
import { BadRequestError } from "../../application/domain/errors";
import { ZodError, ZodSchema } from "zod";

export function useZodValidator<T>({
  schema,
  data,
}: {
  schema: ZodSchema<T>;
  data: any;
}): T {
  try {
    return schema.parse(data);
  } catch (error) {
    console.error({
      message: `[ZOD] useZodValidator:`,
      context: { error: error },
    });
    if (error instanceof ZodError) {
      throw new BadRequestError({
        traceCode: errorMessages.required.schemaValidation.code,
        message: `${
          errorMessages.required.schemaValidation.errorMessage
        }: ${error.errors.map((e) => e.message).join(", ")}`,
      });
    }
    throw error;
  }
}

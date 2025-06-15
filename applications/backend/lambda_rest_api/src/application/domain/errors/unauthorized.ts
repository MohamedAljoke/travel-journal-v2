import { DomainError } from "./domain-error";

export class Unauthorized extends DomainError {
  constructor(traceCode?: string) {
    super({
      message: "Unauthorized",
      statusCode: 401,
      traceCode,
    });
  }
}

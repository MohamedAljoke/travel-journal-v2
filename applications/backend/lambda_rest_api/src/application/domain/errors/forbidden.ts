import { DomainError } from "./domain-error";

export class ForbiddenError extends DomainError {
  constructor(traceCode?: string) {
    super({ message: `Forbidden`, statusCode: 403, traceCode });
  }
}

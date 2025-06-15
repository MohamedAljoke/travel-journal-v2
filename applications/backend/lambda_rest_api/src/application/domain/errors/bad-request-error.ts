import { DomainError } from "./domain-error";

export class BadRequestError extends DomainError {
  constructor({
    message,
    isReportable,
    traceCode,
  }: {
    message: string;
    traceCode?: string;
    isReportable?: boolean;
  }) {
    super({ message, statusCode: 400, traceCode, isReportable });
  }
}

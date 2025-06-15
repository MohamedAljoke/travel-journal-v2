import { DomainError } from "./domain-error";

export class NotFoundError extends DomainError {
  constructor({
    message,
    isReportable,
    traceCode,
  }: {
    message: string;
    traceCode?: string;
    isReportable?: boolean;
  }) {
    super({ message, statusCode: 404, traceCode, isReportable });
  }
}

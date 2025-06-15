/*
the error types that extend domain will be sent to the client
this error type is to throw but it just returns 500 to the client
*/
export class ServerError extends Error {
  statusCode: number;
  traceCode?: string;
  isReportable?: boolean;
  tags?: { [key: string]: string };
  constructor({
    message,
    statusCode,
    traceCode,
    isReportable,
    tags,
  }: {
    message: string;
    statusCode?: number;
    traceCode?: string;
    isReportable?: boolean;
    tags?: { [key: string]: string };
  }) {
    super(message);
    this.statusCode = statusCode ?? 500;
    this.traceCode = traceCode;
    this.isReportable = isReportable;
    this.tags = tags;
  }
}

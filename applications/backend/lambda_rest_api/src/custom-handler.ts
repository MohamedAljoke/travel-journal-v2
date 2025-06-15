import { APIGatewayProxyResult } from "aws-lambda";
import { DomainError } from "./application/domain/errors";
import { logger } from "./shared/logger/logger";
import { SentryExceptionCatcher } from "./shared/observability/sentry/execption.handler";

export interface ILambdaHandlerResponse {
  body: any;
  headers?: { [header: string]: string };
  statusCode?: number;
}

const defaultHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT,DELETE",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, apiToken",
  "Content-Type": "application/json",
};

export const customHandler = async <TEvent>(
  handler: (event: TEvent) => Promise<ILambdaHandlerResponse>,
  event: TEvent
): Promise<APIGatewayProxyResult> => {
  const exceptionCatcher = new SentryExceptionCatcher();
  try {
    const handlerResponse = await handler(event);
    return {
      statusCode: handlerResponse.statusCode ?? 200,
      body: JSON.stringify(handlerResponse.body),
      headers: {
        ...defaultHeaders,
        ...handlerResponse.headers,
      },
    };
  } catch (error) {
    console.log(error);
    // Return DomainError for any event type
    if (error instanceof DomainError) {
      logger.error({
        message: `[APPLICATION-DOMAIN-ERROR]`,
        context: { error: error },
      });
      return {
        statusCode: error.statusCode,
        body: JSON.stringify({
          message: error.message,
          code: error.traceCode,
        }),
        headers: {
          ...defaultHeaders,
        },
      };
    }
    logger.error({
      message: `[INTERNAL-SERVER-ERROR]`,
      context: { error: error },
    });
    exceptionCatcher.catchException({
      exception: error as Error,
      tags: {
        functionName: "travel-journal",
      },
    });
    //todo: send to sentry? some place to get errors
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
        code: 500,
      }),
      headers: {
        ...defaultHeaders,
      },
    };
  }
};

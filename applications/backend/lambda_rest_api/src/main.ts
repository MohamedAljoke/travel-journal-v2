import { config } from "dotenv";
config();
import * as SentryServerless from "@sentry/aws-serverless";
import { APIGatewayProxyEvent } from "aws-lambda";
import { customHandler, ILambdaHandlerResponse } from "./custom-handler";
import { logger } from "./shared/logger/logger";
import { TravelRoutes } from "./application/routes/routes";
import { DynamodbClient } from "./connections/database/dynamodb/dynamodb";
import { ServerError } from "./application/domain/errors";

export interface IUserTokenData {
  cognitoId: string;
  email: string;
  username: string;
}
class TravelJournalHandler {
  public async handler(
    event: APIGatewayProxyEvent
  ): Promise<ILambdaHandlerResponse> {
    logger.info({
      message: "[INCOMING EVENT]:",
      context: event as unknown as Record<string, unknown>,
    });

    if (!process.env.DYNAMODB_TABLE_NAME) {
      throw new ServerError({
        message: "Erro no sistema",
        traceCode: "505",
        statusCode: 500,
      });
    }

    const body = JSON.parse(event.body || "{}");
    const method = event.httpMethod;
    const path = event.path;
    const queryParams = event.queryStringParameters || {};
    const userData = this.extractLoggedUserData(event);
    const db = new DynamodbClient();
    const routes = new TravelRoutes(db);
    const response = await routes.handler({
      path,
      body,
      method,
      queryParams,
      userData,
    });
    return {
      body: response,
    };
  }

  private extractLoggedUserData(event: APIGatewayProxyEvent): IUserTokenData {
    const userId = event.requestContext.authorizer?.claims?.sub;
    const username = event.requestContext.authorizer?.claims?.name;
    const email = event.requestContext.authorizer?.claims?.email;

    return {
      cognitoId: userId,
      username,
      email,
    };
  }
}

const travelJournalHandler = new TravelJournalHandler();

export const handler = SentryServerless.wrapHandler(
  async (event: APIGatewayProxyEvent, context) => {
    return customHandler(
      travelJournalHandler.handler.bind(travelJournalHandler),
      event
    );
  }
);

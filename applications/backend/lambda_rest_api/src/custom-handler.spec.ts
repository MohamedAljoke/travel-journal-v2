import { APIGatewayProxyResult } from "aws-lambda";
import { DomainError } from "./application/domain/errors";
import { logger } from "./shared/logger/logger";
import { SentryExceptionCatcher } from "./shared/observability/sentry/execption.handler";
import { customHandler } from "./custom-handler";

// Mock dependencies
jest.mock("./shared/logger/logger", () => ({
  logger: {
    error: jest.fn(),
  },
}));

jest.mock("./shared/observability/sentry/execption.handler", () => ({
  SentryExceptionCatcher: jest.fn().mockImplementation(() => ({
    catchException: jest.fn(),
  })),
}));

describe("customHandler", () => {
  let mockHandler: jest.Mock;

  beforeEach(() => {
    mockHandler = jest.fn();
  });

  it("should return success response when handler is successful", async () => {
    const event = { someData: "test" };
    const response = { body: { message: "success" }, statusCode: 200 };
    mockHandler.mockResolvedValue(response);

    const result: APIGatewayProxyResult = await customHandler(
      mockHandler,
      event
    );

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe(JSON.stringify(response.body));
    expect(result.headers).toHaveProperty("Content-Type", "application/json");
  });

  it("should return DomainError response when DomainError is thrown", async () => {
    const event = { someData: "test" };
    const error = new DomainError({
      message: "[APPLICATION-DOMAIN-ERROR]",
      statusCode: 400,
    });
    mockHandler.mockRejectedValue(error);

    const result: APIGatewayProxyResult = await customHandler(
      mockHandler,
      event
    );

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe(
      JSON.stringify({ message: error.message, code: error.traceCode })
    );
    expect(result.headers).toHaveProperty("Content-Type", "application/json");
    expect(logger.error).toHaveBeenCalledWith({
      message: "[APPLICATION-DOMAIN-ERROR]",
      context: { error },
    });
  });

  it("should return internal server error response when other error is thrown", async () => {
    const event = { someData: "test" };
    const error = new Error("Unexpected Error");
    mockHandler.mockRejectedValue(error);

    const result: APIGatewayProxyResult = await customHandler(
      mockHandler,
      event
    );

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe(
      JSON.stringify({ message: "Internal Server Error", code: 500 })
    );
    expect(result.headers).toHaveProperty("Content-Type", "application/json");
    expect(logger.error).toHaveBeenCalledWith({
      message: "[INTERNAL-SERVER-ERROR]",
      context: { error },
    });
    expect(SentryExceptionCatcher).toHaveBeenCalled();
  });
});

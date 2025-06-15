import { NotFoundError } from "../domain/errors";
import { errorMessages } from "../domain/constants/error_messages/error.messages";
import { BaseRouter, RouterPathsType } from "./base.router";

// Mock the handler function
const mockHandler = jest.fn();

// Define mock paths
const mockPaths: RouterPathsType = {
  "/test": {
    method: "GET",
    path: "/test",
    handler: mockHandler,
  },
  "/test/regex": {
    method: "POST",
    pattern: /^\/test\/regex\/\d+$/,
    handler: mockHandler,
  },
};

describe("BaseRouter", () => {
  let baseRouter: BaseRouter;

  beforeEach(() => {
    baseRouter = new BaseRouter();
    mockHandler.mockClear(); // Clear mock calls before each test
  });

  test("should handle exact path match", async () => {
    const path = "/test";
    const body = { key: "value" };
    const method = "GET";
    const queryParams = {};

    mockHandler.mockResolvedValueOnce({ success: true });

    const response = await baseRouter.baseRouteHandler({
      paths: mockPaths,
      path,
      body,
      method,
      queryParams,
    });

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockHandler).toHaveBeenCalledWith({
      path,
      body,
      method,
      queryParams,
    });
    expect(response).toEqual({ success: true });
  });

  test("should handle regex path match", async () => {
    const path = "/test/regex/123";
    const body = { key: "value" };
    const method = "POST";
    const queryParams = { param1: "value" };

    mockHandler.mockResolvedValueOnce({ success: true });

    const response = await baseRouter.baseRouteHandler({
      paths: mockPaths,
      path,
      body,
      method,
      queryParams,
    });

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockHandler).toHaveBeenCalledWith({
      path,
      body,
      queryParams,
      method,
    });
    expect(response).toEqual({ success: true });
  });

  test("should throw NotFoundError for invalid path", async () => {
    const path = "/invalid-path";
    const body = { key: "value" };
    const method = "GET";
    const queryParams = {};

    try {
      await baseRouter.baseRouteHandler({
        paths: mockPaths,
        path,
        body,
        method,
        queryParams,
      });
    } catch (error: any) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toEqual(errorMessages.invalidPath.errorMessage);
      expect(error.traceCode).toEqual(errorMessages.invalidPath.code);
    }
  });

  test("should throw NotFoundError for invalid method", async () => {
    const path = "/test";
    const body = { key: "value" };
    const method = "POST"; // invalid method for the path
    const queryParams = {};

    try {
      await baseRouter.baseRouteHandler({
        paths: mockPaths,
        path,
        body,
        method,
        queryParams,
      });
    } catch (error: any) {
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toEqual(errorMessages.invalidPath.errorMessage);
      expect(error.traceCode).toEqual(errorMessages.invalidPath.code);
    }
  });
});

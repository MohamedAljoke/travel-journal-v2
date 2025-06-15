import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";
import { NotFoundError } from "../domain/errors";
import { errorMessages } from "../domain/constants/error_messages/error.messages";
import { IUserTokenData } from "../../main";

export type RouteParams = {
  path: string;
  body?: any;
  queryParams?: APIGatewayProxyEventQueryStringParameters;
  method: string;
  userData?: IUserTokenData;
};
export type RouterPathsType = {
  [k: string]: {
    path?: string;
    pattern?: RegExp;
    method: string;
    handler: ({
      path,
      body,
      queryParams,
      method,
      userData,
    }: RouteParams) => Promise<any>;
  };
};

export class BaseRouter {
  public async baseRouteHandler({
    paths,
    path,
    body,
    method,
    queryParams,
    userData,
  }: {
    paths: RouterPathsType;
    path: string;
    body: any;
    method: string;
    queryParams?: APIGatewayProxyEventQueryStringParameters;
    userData?: IUserTokenData;
  }): Promise<any> {
    for (const route of Object.values(paths)) {
      if (route.path && route.path === path && route.method === method) {
        return await route.handler.bind(this)({
          path,
          body,
          queryParams,
          method,
          userData,
        });
      } else if (
        route.pattern &&
        route.pattern.test(path) &&
        route.method === method
      ) {
        return await route.handler.bind(this)({
          path,
          body,
          queryParams,
          method,
          userData,
        });
      }
    }
    throw new NotFoundError({
      message: errorMessages.invalidPath.errorMessage,
      traceCode: errorMessages.invalidPath.code,
    });
  }
}

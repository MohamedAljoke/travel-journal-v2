import { BaseRouter, RouteParams, RouterPathsType } from "./base.router";
import { IDatabase } from "../../connections/database/interface";
import { GetPresignedUrlController } from "../controllers/get_presigned_url.controller";
import { PreSignedS3Url } from "../usecases/pre_signed_url";
import { Environment } from "../../environment";
import { z } from "zod";
import { useZodValidator } from "../../shared/validator/zod_validator";
import { Unauthorized } from "../domain/errors";
import { GetAllUserFilesController } from "../controllers/get_all_user_files.controller";

export const basePath = `/v1`;

export class TravelRoutes extends BaseRouter {
  private database: IDatabase;
  paths: RouterPathsType;

  constructor(database: IDatabase) {
    super();
    this.database = database;
    this.paths = {
      GET_VERSION: {
        path: `${basePath}/version`,
        method: "GET",
        handler: this.getVersion,
      },
      GET_PRESIGNED_URL: {
        path: `${basePath}/get-upload-url`,
        method: "POST",
        handler: this.getPresignedUrl,
      },
      GET_USER_FILES: {
        path: `${basePath}/user/files`,
        method: "GET",
        handler: this.getUserFiles,
      },
    };
  }
  private async getVersion({}: RouteParams) {
    return { version: "1.0.0" };
  }
  private async getUserFiles({ userData }: RouteParams) {
    if (!userData?.cognitoId) {
      throw new Unauthorized();
    }

    new PreSignedS3Url(Environment.S3_ASSET_TABLE);
    const getAllUserFilesController = new GetAllUserFilesController(
      this.database
    );
    const url = await getAllUserFilesController.handler({
      userData,
    });
    return url;
  }
  private async getPresignedUrl({ body, userData }: RouteParams) {
    if (!userData?.cognitoId) {
      throw new Unauthorized();
    }
    const presignedUrlBodySchema = z.object({
      objectKey: z
        .string({ message: "objectKey must be a non-empty string" })
        .min(1, { message: "objectKey must be a non-empty string" }),
      contentType: z
        .string({ message: "contentType must be a non-empty string" })
        .min(1, { message: "contentType must be a non-empty string" }),
    });
    const validatedBody = useZodValidator({
      schema: presignedUrlBodySchema,
      data: body,
    });
    const presignedUrlUseCase = new PreSignedS3Url(Environment.S3_ASSET_TABLE);
    const getPresignedUrlController = new GetPresignedUrlController(
      presignedUrlUseCase
    );
    const url = await getPresignedUrlController.handler({
      objectKey: validatedBody.objectKey,
      contentType: validatedBody.contentType,
      userData,
    });
    return url;
  }
  public async handler({
    path,
    body,
    method,
    queryParams,
    userData,
  }: RouteParams): Promise<any> {
    return this.baseRouteHandler.bind(this)({
      paths: this.paths,
      path,
      body,
      method,
      queryParams,
      userData,
    });
  }
}

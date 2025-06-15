import { IUserTokenData } from "../../main";
import { PreSignedS3Url } from "../usecases/pre_signed_url";

export class GetPresignedUrlController {
  private preSignedS3Url: PreSignedS3Url;

  constructor(preSignedS3Url: PreSignedS3Url) {
    this.preSignedS3Url = preSignedS3Url;
  }

  public async handler({
    objectKey,
    contentType,
    userData,
  }: {
    objectKey: string;
    contentType: string;
    userData: IUserTokenData;
  }): Promise<{ objectKey: string; uploadUrl: string }> {
    const presignedData = await this.preSignedS3Url.generatePresignedUrl({
      contentType: contentType,
      objectKey: `${userData.cognitoId}/${objectKey}`,
    });
    return {
      objectKey: presignedData.objectKey,
      uploadUrl: presignedData.uploadUrl,
    };
  }
}

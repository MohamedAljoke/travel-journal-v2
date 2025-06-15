import { IUserTokenData } from "../../main";
import { PreSignedS3Url } from "../usecases/pre_signed_url";
import { GetPresignedUrlController } from "./get_presigned_url.controller";
import { DeepMockProxy, mockDeep } from "jest-mock-extended";

describe("GetPresignedUrlController", () => {
  let controller: GetPresignedUrlController;
  let presignedUrlUseCase: DeepMockProxy<PreSignedS3Url>;
  beforeEach(() => {
    process.env.S3_ASSET_TABLE = "mock-bucket-name";
    jest.clearAllMocks();
    presignedUrlUseCase = mockDeep<PreSignedS3Url>();
    controller = new GetPresignedUrlController(presignedUrlUseCase);
  });

  it("should return a presigned URL", async () => {
    const mockUrl = {
      objectKey: "https://mock-s3-url.com",
      uploadUrl: "https://mock-s3-url.com",
    };
    const userData: IUserTokenData = {
      cognitoId: "112312",
      email: "email@email.com",
      username: "name",
    };
    const mockRequest = {
      objectKey: "https://mock-s3-url.com",
      contentType: "https://mock-s3-url.com",
      userData,
    };
    presignedUrlUseCase.generatePresignedUrl.mockResolvedValueOnce(mockUrl);
    const url = await controller.handler(mockRequest);
    expect(url).toStrictEqual(mockUrl);

    // expect(PreSignedS3Url).toHaveBeenCalledWith("mock-bucket-name");
    expect(presignedUrlUseCase.generatePresignedUrl).toHaveBeenCalledWith({
      contentType: mockRequest.contentType,
      objectKey: mockRequest.objectKey,
    });
  });
});

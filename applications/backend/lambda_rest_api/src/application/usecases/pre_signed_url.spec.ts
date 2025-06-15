import { Mock } from "vitest";
import { PreSignedS3Url } from "./pre_signed_url";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

vi.mock("@aws-sdk/client-s3");
vi.mock("@aws-sdk/s3-request-presigner", () => ({
  getSignedUrl: vi.fn(),
}));

describe("PreSignedS3Url", () => {
  const bucketName = "test-bucket";
  let preSignedS3Url: PreSignedS3Url;
  beforeEach(() => {
    preSignedS3Url = new PreSignedS3Url(bucketName);
  });
  afterAll(() => {
    vi.clearAllMocks();
  });

  it("should generate a presigned URL", async () => {
    const mockUrl = "https://mocked-url.com";
    (getSignedUrl as Mock).mockResolvedValue(mockUrl);

    const mockRequest = {
      objectKey: "test.txt",
      contentType: "text/plain",
    };
    const mockResult = {
      objectKey: mockRequest.objectKey,
      uploadUrl: mockUrl,
    };
    const result = await preSignedS3Url.generatePresignedUrl(mockRequest);

    expect(getSignedUrl).toHaveBeenCalledWith(
      expect.any(S3Client),
      expect.any(PutObjectCommand),
      { expiresIn: 3600 }
    );
    expect(result).toEqual(mockResult);
  });

  it("should use default expiration if not provided", async () => {
    (getSignedUrl as Mock).mockResolvedValue("https://mock-url.com");

    await preSignedS3Url.generatePresignedUrl({
      objectKey: "file.png",
      contentType: "image/png",
    });

    expect(getSignedUrl).toHaveBeenCalledWith(
      expect.any(S3Client),
      expect.any(PutObjectCommand),
      { expiresIn: 3600 } // Default value
    );
  });

  it("should use provided expiration time", async () => {
    (getSignedUrl as Mock).mockResolvedValue("https://mock-url.com");

    await preSignedS3Url.generatePresignedUrl({
      objectKey: "file.png",
      contentType: "image/png",
      expiresIn: 1800, // Custom expiration
    });

    expect(getSignedUrl).toHaveBeenCalledWith(
      expect.any(S3Client),
      expect.any(PutObjectCommand),
      { expiresIn: 1800 }
    );
  });
});

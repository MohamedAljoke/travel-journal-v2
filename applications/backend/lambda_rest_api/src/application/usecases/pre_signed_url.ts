import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class PreSignedS3Url {
  private s3: S3Client;
  private bucketName: string;
  constructor(bucketName: string) {
    this.bucketName = bucketName;
    this.s3 = new S3Client({
      region: "us-east-1",
    });
  }

  public async generatePresignedUrl({
    objectKey,
    contentType,
    expiresIn = 3600,
  }: {
    objectKey: string;
    contentType: string;
    expiresIn?: number;
  }) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: objectKey,
    });

    const signedUrl = await getSignedUrl(this.s3, command, {
      expiresIn: expiresIn,
    });
    return { objectKey, uploadUrl: signedUrl };
  }
}

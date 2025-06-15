import { ProtoUserImages } from "../../shared/types";
import {
  baseTableName,
  IDynamoPutItem,
} from "../../connections/database/dynamodb/dynamodb";

export class UserImage {
  PK: string;
  SK: string;
  image_id: string;
  image_url: string;
  image_description: string;

  constructor({
    imageId,
    imageUrl,
    imageDescription,
    email,
  }: Omit<ProtoUserImages, "PK" | "SK" | "$typeName"> & { email: string }) {
    this.PK = `USER#${email}`;
    this.image_id = imageId;
    this.SK = `IMAGE#${imageId}`;
    this.image_url = imageUrl;
    this.image_description = imageDescription;
  }

  static fromDynamoDB(item: Record<string, any>): UserImage {
    return new UserImage({
      email: item.PK?.S.split("#")?.[1],
      imageId: item.imageId?.S || item.SK?.S.split("#")[1], // Get image ID
      imageUrl: item.imageUrl?.S || "",
      imageDescription: item.imageDescription?.S || "",
    });
  }

  toDynamoDB(): IDynamoPutItem {
    return {
      TableName: baseTableName,
      Item: {
        PK: this.PK,
        SK: this.SK,
        image_url: this.image_url,
        image_description: this.image_description,
      },
    };
  }
}

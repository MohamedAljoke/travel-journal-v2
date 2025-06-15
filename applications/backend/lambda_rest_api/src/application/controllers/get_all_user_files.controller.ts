import { IUserTokenData } from "../../main";
import {
  IDatabase,
  userImagesTableName,
} from "../../connections/database/interface";
import { UserImage } from "../models/users_images.models";

export class GetAllUserFilesController {
  private database: IDatabase;
  constructor(database: IDatabase) {
    this.database = database;
  }

  public async handler({
    userData,
  }: {
    userData: IUserTokenData;
  }): Promise<UserImage[] | undefined> {
    const dynamoUserFiles = await this.database.queryItems({
      tableName: userImagesTableName,
      expressionValues: {
        ":userId": userData.cognitoId,
      },
      keyConditionExpression: "PK = :userId",
    });
    const userFiles = dynamoUserFiles?.map((file) => {
      return UserImage.fromDynamoDB(file);
    });
    return userFiles;
  }
}

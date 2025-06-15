import { ProtoUser } from "../../shared/types";
import {
  baseTableName,
  IDynamoPutItem,
} from "../../connections/database/dynamodb/dynamodb";

export class User {
  PK: string;
  SK: string;
  email: string;
  name: string;
  password: string;

  constructor({
    email,
    name,
    password,
  }: Omit<ProtoUser, "PK" | "SK" | "$typeName">) {
    this.PK = `USER#${email}`;
    this.SK = `PROFILE`;
    this.email = email;
    this.name = name;
    this.password = password;
  }

  static fromDynamoDB(item: Record<string, any>): User {
    return new User({
      email: item.email,
      name: item.name,
      password: item.password,
    });
  }

  toDynamoDB(): IDynamoPutItem {
    return {
      TableName: baseTableName,
      Item: {
        PK: this.PK,
        SK: this.SK,
        email: this.email,
        name: this.name,
        password: this.password,
      },
    };
  }
}

import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import {
  DynamoDBClient,
  QueryCommand,
  ScanCommand,
} from "@aws-sdk/client-dynamodb";
import { IDatabase } from "../interface";

export interface IDynamoPutItem {
  TableName: string;
  Item: Record<string, any>;
}

export const baseTableName = process.env.DYNAMODB_TABLE_NAME ?? "";
export class DynamodbClient implements IDatabase {
  private dbClient: DynamoDBDocumentClient;
  constructor() {
    const client = new DynamoDBClient({});
    this.dbClient = DynamoDBDocumentClient.from(client);
  }
  async getItem(tableName: string, key: Record<string, any>) {
    const command = new GetCommand({
      TableName: tableName,
      Key: key,
    });
    const response = await this.dbClient.send(command);
    return response.Item;
  }
  async putItem(params: IDynamoPutItem) {
    const command = new PutCommand(params);
    await this.dbClient.send(command);
  }
  async deleteItem(tableName: string, key: Record<string, any>) {
    const command = new DeleteCommand({
      TableName: tableName,
      Key: key,
    });
    await this.dbClient.send(command);
  }

  async updateItem(
    tableName: string,
    key: Record<string, any>,
    updateExpression: string,
    expressionAttributes: Record<string, any>
  ) {
    const command = new UpdateCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributes,
      ReturnValues: "UPDATED_NEW",
    });
    const response = await this.dbClient.send(command);
    return response.Attributes;
  }

  async queryItems({
    tableName,
    keyConditionExpression,
    expressionValues,
  }: {
    tableName: string;
    keyConditionExpression: string;
    expressionValues: Record<string, any>;
  }) {
    const formattedExpressionValues = Object.entries(expressionValues).reduce(
      (acc, [key, value]) => {
        acc[key] = { S: value }; // DynamoDB expects { S: "string" } for strings
        return acc;
      },
      {} as Record<string, { S: string }>
    );

    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: formattedExpressionValues,
    });
    const response = await this.dbClient.send(command);
    return response?.Items;
  }
  async scanItems(tableName: string) {
    const command = new ScanCommand({ TableName: tableName });
    const response = await this.dbClient.send(command);
    return response.Items;
  }
}

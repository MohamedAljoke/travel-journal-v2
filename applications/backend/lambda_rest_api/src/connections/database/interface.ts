import { IDynamoPutItem } from "./dynamodb/dynamodb";

export const userImagesTableName = process.env.DYNAMODB_TABLE_NAME ?? "";

export interface IDatabase {
  getItem(
    tableName: string,
    key: Record<string, any>
  ): Promise<Record<string, any> | undefined>;
  putItem(params: IDynamoPutItem): Promise<void>;
  deleteItem(tableName: string, key: Record<string, any>): Promise<void>;
  updateItem(
    tableName: string,
    key: Record<string, any>,
    updateExpression: string,
    expressionAttributes: Record<string, any>
  ): Promise<Record<string, any> | undefined>;
  queryItems({
    tableName,
    keyConditionExpression,
    expressionValues,
  }: {
    tableName: string;
    keyConditionExpression: string;
    expressionValues: Record<string, any>;
  }): Promise<Record<string, any>[] | undefined>;
  scanItems(tableName: string): Promise<Record<string, any>[] | undefined>;
}

export class Environment {
  private static getEnvVariable(name: string): string {
    const value = process.env[name];
    if (!value) {
      throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
  }

  public static readonly SENTRY_DSN = Environment.getEnvVariable("SENTRY_DSN");
  public static readonly DYNAMODB_TABLE_NAME = Environment.getEnvVariable(
    "DYNAMODB_TABLE_NAME"
  );
  public static readonly S3_ASSET_TABLE =
    Environment.getEnvVariable("S3_ASSET_TABLE");
  public static readonly NODE_ENVIRONMENT =
    Environment.getEnvVariable("NODE_ENVIRONMENT");
}

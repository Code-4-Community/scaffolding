import { DynamoDBClient, GetItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import { Injectable, Put } from "@nestjs/common";
import { table } from "console";

@Injectable()
export class DynamoDbService {
  private readonly dynamoDbClient: DynamoDBClient;

  constructor() {
    this.dynamoDbClient = new DynamoDBClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  public async getItem(tableName: string, key: { [key: string]: any }): Promise<any> {
    const params = {
      TableName: tableName,
      Key: key,
    };

    try {
      const data = await this.dynamoDbClient.send(new GetItemCommand(params));
      return data.Item || null;
    } catch (error) {
      console.error('DynamoDB GetItem Error:', error);
      throw new Error(`Unable to get item from ${tableName}`);
    }
  }

  public async postItem(tableName: string, item) {
    const command = new PutItemCommand({
      TableName: tableName,
      Item: item,
    });

    console.log(item);
    try {
      const result = await this.dynamoDbClient.send(command);
      return result;
    } catch (error) {
      console.log(`Error posting item to table ${tableName}`);
      throw new Error(error);
    }
  }
}

import { DynamoDBClient, GetItemCommand, PutItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { Injectable } from "@nestjs/common";

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

  public async scanTable(tableName: string, filterExpression?: string, expressionAttributeValues?: { [key: string]: any }): Promise<any[]> {
    // By default, scan the entire table
    const params: any = {
      TableName: tableName,
    };
    // Conditionally add FilterExpression and ExpressionAttributeValues if they exist
    if (filterExpression) {
      params.FilterExpression = filterExpression;
    }
    if (expressionAttributeValues) {
      params.ExpressionAttributeValues = expressionAttributeValues;
    }
    try {
      const data = await this.dynamoDbClient.send(new ScanCommand(params));
      return data.Items || [];
    } catch (error) {
      console.error('DynamoDB Scan Error:', error);
      throw new Error(`Unable to scan table ${tableName}`);
    }
  }

  public async getHighestUserId(tableName: string): Promise<number | undefined> {
    const params: any = {
      TableName: tableName,
      ProjectionExpression: "userId" // Project only the userId attribute
    };

    try {
      const data = await this.dynamoDbClient.send(new ScanCommand(params));
      const userIds = data.Items.map(item => parseInt(item.userId.N, 10)); // Convert to numbers

      // Handle potential parsing errors
      const validUserIds = userIds.filter(id => !isNaN(id));

      if (validUserIds.length === 0) {
        return undefined; // No valid user IDs found
      }

      const highestUserId = validUserIds.reduce((max, current) => Math.max(max, current));
      return highestUserId;
    } catch (error) {
      console.error('DynamoDB Scan Error:', error);
      throw new Error(`Unable to scan table ${tableName}`);
    }
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

    console.log(command);
    try {
      const result = await this.dynamoDbClient.send(command);
      return result;
    } catch (error) {
      console.log(`Error posting item to table ${tableName}`);
      throw new Error(error);
    }
  }
}

import { InvokeCommand, Lambda } from "@aws-sdk/client-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";

export const handler = async (event: any): Promise<object> => {
  const dynamoDb = new DynamoDB();
  const lambda = new Lambda();

  await dynamoDb.updateItem({
    TableName: process.env.HITS_TABLE_NAME,
    Key: { path: { S: event.path } },
    UpdateExpression: "ADD hits :incr",
    ExpressionAttributeValues: { ":incr": { N: "1" } },
  });

  const command = new InvokeCommand({
    FunctionName: process.env.TARGET_FUNCTION_NAME,
    Payload: JSON.stringify(event),
  });

  const response = await lambda.send(command);
  const result = response.Payload!.transformToString();

  return JSON.parse(result);
};

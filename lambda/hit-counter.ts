import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { InvokeCommand, Lambda } from "@aws-sdk/client-lambda";
import { APIGatewayProxyEvent } from "aws-lambda";

export const handler = async (event: APIGatewayProxyEvent): Promise<object> => {
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

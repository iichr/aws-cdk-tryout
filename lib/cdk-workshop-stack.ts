import { Stack, StackProps } from "aws-cdk-lib";
import { LambdaRestApi } from "aws-cdk-lib/aws-apigateway";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";
import { HitCounter } from "./hit-counter";
import { TableViewer } from "cdk-dynamo-table-viewer";

export class CdkWorkshopStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const testLambda = new NodejsFunction(this, "HelloLambdaHandler", {
      entry: path.join(__dirname, "../lambda/hello.ts"),
      handler: "handler",
      runtime: Runtime.NODEJS_20_X,
      bundling: { minify: true },
    });

    const hitCounter = new HitCounter(this, "HitCounter", {
      targetFunction: testLambda,
    });

    new LambdaRestApi(this, "Endpoint", {
      handler: hitCounter.handler,
    });

    new TableViewer(this, "HitTableViewer", {
      title: "Hits by page",
      table: hitCounter.hitsTable,
      sortBy: "-hits",
    });
  }
}

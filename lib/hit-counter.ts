import { RemovalPolicy } from "aws-cdk-lib";
import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { IFunction, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
import * as path from "path";

export interface HitCounterProps {
  targetFunction: IFunction;
}

export class HitCounter extends Construct {
  public readonly handler: NodejsFunction;
  public readonly hitsTable: Table;

  constructor(scope: Construct, id: string, props: HitCounterProps) {
    super(scope, id);

    this.hitsTable = new Table(this, "Hits", {
      partitionKey: { name: "path", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
    });

    this.handler = new NodejsFunction(this, "HitCounterHandler", {
      entry: path.join(__dirname, "../lambda/hit-counter.ts"),
      handler: "handler",
      runtime: Runtime.NODEJS_20_X,
      bundling: { minify: true },
      environment: {
        HITS_TABLE_NAME: this.hitsTable.tableName,
        TARGET_FUNCTION_NAME: props.targetFunction.functionName,
      },
    });

    // Grant lambda permissions to write data to the table
    this.hitsTable.grantReadWriteData(this.handler);

    // Grant lambda permissions to invoke the target function
    props.targetFunction.grantInvoke(this.handler);
  }
}

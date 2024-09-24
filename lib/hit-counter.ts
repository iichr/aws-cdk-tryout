import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { IFunction, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { table } from "console";
import { Construct } from "constructs";
import path = require("path");

export interface HitCounterProps {
    targetFunction: IFunction;
}

export class HitCounter extends Construct {
    public readonly handler: NodejsFunction

    constructor(scope: Construct, id: string, props: HitCounterProps) {
        super(scope, id)

        const hitsTable = new Table(this, "Hits", {
            partitionKey: { name: "path", type: AttributeType.STRING }
        })

        this.handler = new NodejsFunction(this, "HitCounterHandler", {
            entry: path.join(__dirname, '../lambda/hit-counter.ts'),
            handler: 'handler',
            runtime: Runtime.NODEJS_20_X,
            bundling: { minify: true },
            environment: {
                HITS_TABLE_NAME: hitsTable.tableName,
                TARGET_FUNCTION_NAME: props.targetFunction.functionName,
            }
        })

        // Grant lambda permissions to write data to the table
        hitsTable.grantReadWriteData(this.handler)

        // Grant lambda permissions to invoke the target function
        props.targetFunction.grantInvoke(this.handler)
    }
}
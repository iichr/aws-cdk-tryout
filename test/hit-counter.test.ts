import * as cdk from "aws-cdk-lib";
import { HitCounter } from "../lib/hit-counter";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import { Capture, Match, Template } from "aws-cdk-lib/assertions";

test("DynamoDB table created successfully", () => {
  const stack = new cdk.Stack();

  new HitCounter(stack, "TestHitCounter", {
    targetFunction: new Function(stack, "TestTargetFn", {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromInline(
        "exports const handler = async (event: any): any => {}",
      ),
      handler: "index.handler",
    }),
  });

  const template = Template.fromStack(stack);

  template.resourceCountIs("AWS::DynamoDB::Table", 1);
});

test("HitCounter lambda created", () => {
  const stack = new cdk.Stack();

  new HitCounter(stack, "TestHitCounter", {
    targetFunction: new Function(stack, "TestTargetFn", {
      runtime: Runtime.NODEJS_20_X,
      code: Code.fromInline(
        "exports const handler = async (event: any): any => {}",
      ),
      handler: "index.handler",
    }),
  });

  const template = Template.fromStack(stack);

  const hits_table_name_env_capture = new Capture();
  const target_fn_env_capture = new Capture();
  template.hasResourceProperties("AWS::Lambda::Function", {
    Environment: Match.objectLike({
      Variables: {
        HITS_TABLE_NAME: hits_table_name_env_capture,
        TARGET_FUNCTION_NAME: target_fn_env_capture,
      },
    }),
  });
  expect(hits_table_name_env_capture.asObject()).toEqual({
    Ref: expect.any(String),
  });
  expect(target_fn_env_capture.asObject()).toEqual({ Ref: expect.any(String) });
});

import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as CdkWorkshop from "../lib/cdk-workshop-stack";

test("Lambdas and API GW created successfully", () => {
  const app = new cdk.App();
  const stack = new CdkWorkshop.CdkWorkshopStack(app, "TestStack");

  const template = Template.fromStack(stack);

  // Hit table viewer, hit counter and hello
  template.resourceCountIs("AWS::Lambda::Function", 3);
  // hit table viewer and hit counter
  template.resourceCountIs("AWS::ApiGateway::RestApi", 2);

  expect(
    Object.keys(template.findResources("AWS::Lambda::Function")).find((key) =>
      key.match(/^HitTableViewer/),
    ),
  ).toBeDefined();
});

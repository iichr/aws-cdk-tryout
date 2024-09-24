import * as cdk from 'aws-cdk-lib';
import { Template, Match } from 'aws-cdk-lib/assertions';
import * as CdkWorkshop from '../lib/cdk-workshop-stack';

test('Lambdas and API GW created successfully', () => {
  const app = new cdk.App();
  const stack = new CdkWorkshop.CdkWorkshopStack(app, 'TestStack');

  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::Lambda::Function', 2);
  template.resourceCountIs('AWS::ApiGateway::RestApi', 1);
});

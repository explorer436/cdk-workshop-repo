import * as sns from '@aws-cdk/aws-sns';
import * as subs from '@aws-cdk/aws-sns-subscriptions';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigateway from '@aws-cdk/aws-apigateway';
import { LambdaSubscription } from '@aws-cdk/aws-sns-subscriptions';
import { HitCounterConstruct } from './HitCounter';
import { TableViewer } from 'cdk-dynamo-table-viewer';
import { EmployeeConstruct } from './EmployeeConstruct';
import { UserConstruct } from './UserConstruct';
import { LambdaIntegration } from '@aws-cdk/aws-apigateway';

export class EmployeeCdkStack extends cdk.Stack {

  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const queue = new sqs.Queue(this, 'CdkWorkshopQueue', {
      visibilityTimeout: cdk.Duration.seconds(300)
    });

    const topic = new sns.Topic(this, 'CdkWorkshopTopic');

    topic.addSubscription(new subs.SqsSubscription(queue));

    const helloLambdaFunction = new lambda.Function(this, 'HelloHandler', {
        runtime: lambda.Runtime.NODEJS_12_X,
        code: lambda.Code.fromAsset('lambdas'),
        handler: 'hello.handler'
    })

    const helloLambdaFunctionWithCounter = new HitCounterConstruct(this, 'HelloHitCounter', {
      downstream: helloLambdaFunction
    });

    const employeeConstruct = new EmployeeConstruct(this, 'EmployeeConstruct' );

    const userConstruct = new UserConstruct(this, 'UserConstruct' );

    // defines an API Gateway REST API resource backed by our "hello" function
    // this forwards all the requests from the gateway to the same handler. 
    // if we want to add multiple resources to the gateway, see the implementation below.
    /*
    new apigateway.LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler
    });
    */

    const apiGateway = new apigateway.RestApi(this, 'my-custom-apis');
    apiGateway.root.addMethod('ANY'); // route this to helloWithCounter.handler

    const genericResource= apiGateway.root.addResource('generic');
    genericResource.addMethod('GET', new LambdaIntegration(helloLambdaFunctionWithCounter.hitCounterLambdaFunction));

    /*
      Defining APIs

      APIs are defined as a hierarchy of resources and methods. 
      addResource and addMethod can be used to build this hierarchy. 
      The root resource is api.root.

      For example, the following code defines an API that includes the following HTTP endpoints: 
      ANY /, 
      GET /books, 
      POST /books

      How to add multiple GET or POST methods on a single API Gateway in AWS?
      The workaround to this is to create a new resource and check the Configure as proxy resource box. Creating a proxy resource allows you to defer routing decision making to a lambda function, for any path which matches the rule.
      e.g. ANY /{proxy+} would match all requests.
      Note: If you then added a separate resource GET /foo, your proxy resource would not handle GET /foo, since a more specific rule now exists.
      So, with a proxy resource set up, you would need to write a lambda that invokes the appropriate lambda function, based on your routing rules.

    */
    const employeesResource = apiGateway.root.addResource('employees');
    employeesResource.addMethod('GET', new LambdaIntegration(employeeConstruct.getEmployeeLambdaFn));
    // employeesResource.addMethod('GET', new LambdaIntegration(employeeConstruct.getEmployeeLambdaFn));
    employeesResource.addMethod('POST', new LambdaIntegration(employeeConstruct.saveEmployeeLambdaFn));

    const usersResource = apiGateway.root.addResource('users');
    usersResource.addMethod('GET', new LambdaIntegration(userConstruct.getUserLambdaFn));
    // usersResource.addMethod('GET', new LambdaIntegration(employeeConstruct.getEmployeeLambdaFn));
    usersResource.addMethod('POST', new LambdaIntegration(userConstruct.saveUserLambdaFn));

    /*
    * 

    TableViewer is a separate contruct that is pulled from npm repository and we are just using it in our stack.
    See package.json.
    https://www.npmjs.com/package/cdk-dynamo-table-viewer
    An AWS CDK construct which exposes a public HTTP endpoint which displays an HTML page with the contents of a DynamoDB table in your stack.

    Later, we will try to use this same construct to view contents of the employee table.

    The endpoint URL for the ViewHitCounter construct is printed on the console after each 'cdk deploy'.
      Like the one shown below :  
      
      Outputs:
      EmployeeCdkStack.ViewHitCounterViewerEndpointCA1B1E4B = https://ydxdcnq2ai.execute-api.us-east-1.amazonaws.com/prod/
      EmployeeCdkStack.mycustomapiEndpointA8EFC2A1 = https://imz7cbekcl.execute-api.us-east-1.amazonaws.com/prod/
    */
    new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello Hits',
      table: helloLambdaFunctionWithCounter.table
    });
  }
}

import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as dynamodb from '@aws-cdk/aws-dynamodb'

export interface HitCounterProps {

    // the function for which we want to count url hits
    downstream: lambda.IFunction;
}

export class HitCounterConstruct extends cdk.Construct {

    // public variable that allows accessing the counter function in hitCounter.js
    public readonly hitCounterLambdaFunction: lambda.Function;

    // public variable for the hit counter table
    public readonly table: dynamodb.Table; 

    constructor(scope: cdk.Construct, id: string, props: HitCounterProps) {
        super(scope, id);

        const hitsTable = new dynamodb.Table(this, 'Hits', {
            partitionKey: { name: 'path', type: dynamodb.AttributeType.STRING }
        });
        // exposing the table as a public property so that the entire stack can access it.
        this.table = hitsTable;

        this.hitCounterLambdaFunction = new lambda.Function(this, 'HitCounterHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'hitCounter.handler',
            code: lambda.Code.fromAsset('lambdas'),
            environment: {
                DOWNSTREAM_FUNCTION_NAME: props.downstream.functionName,
                HITS_TABLE_NAME: hitsTable.tableName
            }
        });

        // grant the lambda role read/write permissions to our table
        hitsTable.grantReadWriteData(this.hitCounterLambdaFunction);

        // grant the lambda role invoke permissions to the downstream function
        props.downstream.grantInvoke(this.hitCounterLambdaFunction);
    }
}
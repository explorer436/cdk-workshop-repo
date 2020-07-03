import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as dynamodb from '@aws-cdk/aws-dynamodb'

export class UserConstruct extends cdk.Construct {

    // public variable for the lambda function to get user details.
    public readonly getUserLambdaFn: lambda.Function;

    // public variable for the lambda function to save user details.
    public readonly saveUserLambdaFn: lambda.Function;

    // public variable for the lambda function to get all users from the table.
    public readonly getAllUsersLambdaFn: lambda.Function;

    // Public variable for the user table.
    // This needs to be passed as an environment variable to both
    // getUser and postUser lambda functions - because
    // both of those operations need access to the table.
    public readonly userTable: dynamodb.Table;

    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        const userTable = new dynamodb.Table(this, 'User', {
            partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }
        })
        // exposing the table as a public property so that the entire stack can access it.
        this.userTable = userTable;

        this.getUserLambdaFn = new lambda.Function(this, 'GetUserHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'getUser.handler',
            code: lambda.Code.fromAsset('lambdas'),
            environment: {
                USER_TABLE_NAME: userTable.tableName
            }
        });

        this.saveUserLambdaFn = new lambda.Function(this, 'SaveUserHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'saveUser.handler',
            code: lambda.Code.fromAsset('lambdas'),
            environment: {
                USER_TABLE_NAME: userTable.tableName
            }
        });

        // This is not being used right now.
        // We need to figure out a way to support multiple GET methods on a single resource in API Gateway.
        // This can be put on hold until then.
        this.getAllUsersLambdaFn = new lambda.Function(this, 'GetAllUsersHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'getAllUsers.handler',
            code: lambda.Code.fromAsset('lambdas'),
            environment: {
                USER_TABLE_NAME: userTable.tableName
            }
        });

        // grant the lambda role read/write permissions to our table
        userTable.grantReadWriteData(this.getUserLambdaFn);
        userTable.grantReadWriteData(this.saveUserLambdaFn);
        userTable.grantReadWriteData(this.getAllUsersLambdaFn);
    }
}
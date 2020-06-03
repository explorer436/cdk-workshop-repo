import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as dynamodb from '@aws-cdk/aws-dynamodb'

export class EmployeeConstruct extends cdk.Construct {

    // public variable that allows accessing the custom function in the handler for employee
    public readonly handler: lambda.Function;

    // public variable for the employee table
    public readonly table: dynamodb.Table;

    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        const employeeTable = new dynamodb.Table(this, 'Employee', {
            partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }
        })
        // exposing the table as a public property so that the entire stack can access it.
        this.table = employeeTable;

        this.handler = new lambda.Function(this, 'EmployeeHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'employee.handler',
            code: lambda.Code.fromAsset('lambdas'),
            environment: {
                EMPLOYEE_TABLE_NAME: employeeTable.tableName
            }
        });

        // grant the lambda role read/write permissions to our table
        employeeTable.grantReadWriteData(this.handler);
    }
}
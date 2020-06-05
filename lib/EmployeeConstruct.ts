import * as cdk from '@aws-cdk/core'
import * as lambda from '@aws-cdk/aws-lambda'
import * as dynamodb from '@aws-cdk/aws-dynamodb'

export class EmployeeConstruct extends cdk.Construct {

    // public variable for the lambda function to get employee details.
    public readonly getEmployeeLambdaFn: lambda.Function;

    // public variable for the lambda function to save employee details.
    public readonly saveEmployeeLambdaFn: lambda.Function;

    // public variable for the lambda function to get all employees from the table.
    public readonly getAllEmployeesLambdaFn: lambda.Function;

    // Public variable for the employee table.
    // This needs to be passed as an environment variable to both
    // getEmployee and postEmployee lambda functions - because
    // both of those operations need access to the table.
    public readonly employeeTable: dynamodb.Table;

    constructor(scope: cdk.Construct, id: string) {
        super(scope, id);

        const employeeTable = new dynamodb.Table(this, 'Employee', {
            partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING }
        })
        // exposing the table as a public property so that the entire stack can access it.
        this.employeeTable = employeeTable;

        this.getEmployeeLambdaFn = new lambda.Function(this, 'GetEmployeeHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'getEmployee.handler',
            code: lambda.Code.fromAsset('lambdas'),
            environment: {
                EMPLOYEE_TABLE_NAME: employeeTable.tableName
            }
        });

        this.saveEmployeeLambdaFn = new lambda.Function(this, 'SaveEmployeeHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'saveEmployee.handler',
            code: lambda.Code.fromAsset('lambdas'),
            environment: {
                EMPLOYEE_TABLE_NAME: employeeTable.tableName
            }
        });

        // This is not being used right now.
        // We need to figure out a way to support multiple GET methods on a single resource in API Gateway.
        // This can be put on hold until then.
        this.getAllEmployeesLambdaFn = new lambda.Function(this, 'GetAllEmployeesHandler', {
            runtime: lambda.Runtime.NODEJS_12_X,
            handler: 'getAllEmployees.handler',
            code: lambda.Code.fromAsset('lambdas'),
            environment: {
                EMPLOYEE_TABLE_NAME: employeeTable.tableName
            }
        });

        // grant the lambda role read/write permissions to our table
        employeeTable.grantReadWriteData(this.getEmployeeLambdaFn);
        employeeTable.grantReadWriteData(this.saveEmployeeLambdaFn);
        employeeTable.grantReadWriteData(this.getAllEmployeesLambdaFn);
    }
}
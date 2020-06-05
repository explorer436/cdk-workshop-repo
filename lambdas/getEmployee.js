const { DynamoDB, Lambda } = require('aws-sdk');

exports.handler = async function(event) {
    console.log('request: ', JSON.stringify(event, undefined, 2));

    console.log('EMPLOYEE_TABLE_NAME : ', process.env.EMPLOYEE_TABLE_NAME);

    // create AWS SDK client for DynamoDB.
    const dynamoDB = new DynamoDB();

    // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-query-scan.html
    const resp = await dynamoDB.scan({
      TableName: process.env.EMPLOYEE_TABLE_NAME,
     }).promise();

    console.log('resp from dynamoDB: ', JSON.stringify(resp, undefined, 2));

    return {
        statusCode: 200,
        isBase64Encoded: false,
        headers: { "Content-Type": "text/plain" },
        // need to add validation and error handling here.
        // the table could be empty - in that scenario, the below line will fail.
        body: JSON.stringify(resp.Items[0])
    }
}
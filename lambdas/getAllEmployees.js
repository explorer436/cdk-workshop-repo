const { DynamoDB, Lambda } = require('aws-sdk');

exports.handler = async function(event) {
    console.log('get all employees request: ', JSON.stringify(event, undefined, 2));

    console.log('EMPLOYEE_TABLE_NAME : ', process.env.EMPLOYEE_TABLE_NAME);

    // create AWS SDK client for DynamoDB.
    const dynamoDB = new DynamoDB();

    const resp = await dynamo.scan({
      TableName: process.env.EMPLOYEE_TABLE_NAME,
     }).promise();

    console.log('resp from dynamoDB: ', JSON.stringify(resp, undefined, 2));

    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        isBase64Encoded: false,
        body: JSON.stringify(resp, undefined, 2)
    }
}
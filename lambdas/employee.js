const { DynamoDB, Lambda } = require('aws-sdk');

exports.handler = async function(event) {
    console.log('request: ', JSON.stringify(event, undefined, 2));

    console.log('EMPLOYEE_TABLE_NAME : ', process.env.EMPLOYEE_TABLE_NAME);

    // create AWS SDK clients
    const dynamoDB = new DynamoDB();
    const lambda = new Lambda();

    return {
        statusCode: 200,
        headers: { "Content-Type": "text/plain" },
        body: 'Returning hard-coded response instead of employee data'
    }
}
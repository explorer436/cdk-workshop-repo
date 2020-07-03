const { DynamoDB, Lambda } = require('aws-sdk');

exports.handler = async function(event) {
    console.log('request: ', JSON.stringify(event, undefined, 2));

    const {
        developerId = undefined,
        email = undefined,
    } = event.queryStringParameters;

    console.log('developerId : ', developerId);
    console.log('email : ', email);

    console.log('USER_TABLE_NAME : ', process.env.USER_TABLE_NAME);

    // create AWS SDK client for DynamoDB.
    const dynamoDBDocumentClient = new DynamoDB.DocumentClient();

    const params = {
        TableName: process.env.USER_TABLE_NAME,
        Key: {
          id: developerId,
          email: email
        }
      };

    try {
        const response = await dynamoDBDocumentClient.get(params).promise();
        return { 
            statusCode: 200,
            isBase64Encoded: false,
            headers: { "Content-Type": "text/plain" }, 
            body: JSON.stringify(response.Item) 
        };
    } catch (dbError) {
        return { 
            statusCode: 500, 
            isBase64Encoded: false,
            headers: { "Content-Type": "text/plain" },
            body: JSON.stringify(dbError) };
    }
    

    // https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/dynamodb-example-query-scan.html
    /*
    const resp = await dynamoDB.query({
        Item: {
            id: {
                S: developerId,
            }, 
            email: {
                S: email
            }
          }, 
          TableName: process.env.USER_TABLE_NAME
        }).promise();

    console.log('resp from dynamoDB: ', JSON.stringify(resp, undefined, 2));

    return {
        statusCode: 200,
        isBase64Encoded: false,
        headers: { "Content-Type": "text/plain" },
        // need to add validation and error handling here.
        // the table could be empty - in that scenario, the below line will fail.
        body: JSON.stringify(resp.Items[0])
    }*/
}
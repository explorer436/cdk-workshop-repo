const { DynamoDB, Lambda } = require('aws-sdk');

exports.handler = async function(event) {
    console.log('request: ', JSON.stringify(event, undefined, 2));

    let employee = JSON.parse(event.body)
    console.log('employee : ', JSON.stringify(employee, undefined, 2));

    console.log('EMPLOYEE_TABLE_NAME : ', process.env.EMPLOYEE_TABLE_NAME);

    /*
        {
            "name": "test",
            "id": "123"
        }
    */
    const fieldsToVerify = [
        'name',
        'id'
    ]

    const missingFields = []
    fieldsToVerify.forEach(field => {
        if (!resolveField(employee, field)) {
            missingFields.push(field)
        }
    })

    if (missingFields.length)
    {
      return {
          statusCode: 400,
          headers: { "Content-Type": "text/plain" },
          isBase64Encoded: false,
          body: 'The input employee object is not valid.'
      }
    }
    else
    {
        // create AWS SDK clients
        const dynamoDB = new DynamoDB();

        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#putItem-property
        // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html

        /*
            This example adds a new item to the Music table.

            var params = {
            Item: {
              "AlbumTitle": {
                  S: "Somewhat Famous"
                  }, 
              "Artist": {
                  S: "No One You Know"
                  }, 
              "SongTitle": {
                  S: "Call Me Today"
                  }
              }, 
              ReturnConsumedCapacity: "TOTAL", 
              TableName: "Music"
            };
            dynamodb.putItem(params, function(err, data) {
            if (err) console.log(err, err.stack); // an error occurred
            else     console.log(data);           // successful response
            /*
            data = {
                ConsumedCapacity: {
                CapacityUnits: 1, 
                TableName: "Music"
                }
            }
        */

        try{
            /*
            let dbPutResult = await dynamoDB.putItem({
                TableName: process.env.HITS_TABLE_NAME,
                Item: {
                    "id": {
                        S: employee.id,
                    }, 
                    "name": {
                        S: employee.name
                    }
                }, 
                ReturnConsumedCapacity: "TOTAL"
            }).promise();
            */
            let dbPutResult = await dynamoDB.putItem({
                Item: {
                    id: {
                        S: employee.id,
                    }, 
                    name: {
                        S: employee.name
                    }
                  }, 
                  ReturnConsumedCapacity: "TOTAL", 
                  TableName: process.env.EMPLOYEE_TABLE_NAME
                }).promise();
            console.log('dbPutResult:',dbPutResult)
        }
        catch (e)
        {
            console.log(e)
        }

      return {
          statusCode: 200,
          headers: { "Content-Type": "text/plain" },
          isBase64Encoded: false,
          body: 'The input employee record will be persisted and a corresponding id will be returned.'
      }
    }

}

const resolveField = (obj, field) => {
   const arr = field.split('.')
   let currentObj = obj

   while (arr.length)
   {
        if (!currentObj)
        {
            return undefined
        }
        currentObj = currentObj[arr.shift()]
   }
   return currentObj
}
const { DynamoDB, Lambda } = require('aws-sdk');

exports.handler = async function(event) {
    console.log('request: ', JSON.stringify(event, undefined, 2));

    let user = JSON.parse(event.body)
    console.log('user : ', JSON.stringify(user, undefined, 2));

    console.log('USER_TABLE_NAME : ', process.env.USER_TABLE_NAME);

    const fieldsToVerify = [
        'email',
        'developerId',
        'displayName'
    ]

    const missingFields = []
    fieldsToVerify.forEach(field => {
        if (!resolveField(user, field)) {
            missingFields.push(field)
        }
    })

    if (missingFields.length)
    {
      return {
          statusCode: 400,
          headers: { "Content-Type": "text/plain" },
          isBase64Encoded: false,
          body: 'The input user object is not valid.'
      }
    }
    else
    {
        // create AWS SDK clients
        const dynamoDB = new DynamoDB();

        // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#putItem-property
        // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_PutItem.html

      /*
        {
            "email": "test",
            "developerId": "123",
            "displayName": "testDisplayName",
            "products": [ "product1", "product2" ],
            "roles": [ "role1", "role2" ],
            "preferences": [ "preference1", "preference2" ]
        }
      */

      console.log('User object that needs to be inserted in DynamoDB : ', JSON.stringify(user, undefined, 2));

      let productsList;
      if (user.products)
      {
        productsList = wrapAsArray(user.products).map((productName) => {
            return {
                S: productName
            }
        })
      }
      console.log('productsList : ', JSON.stringify(productsList, undefined, 2));

      let rolesList;
      if (user.roles)
      {
        rolesList = wrapAsArray(user.roles).map((role) => {
            return {
                S: role
            }
        })
      }
      console.log('rolesList : ', JSON.stringify(rolesList, undefined, 2));

      let preferencesList;
      if (user.preferences)
      {
        preferencesList = wrapAsArray(user.preferences).map((pref) => {
            return {
                S: pref
            }
        })
      }
      console.log('preferencesList : ', JSON.stringify(preferencesList, undefined, 2));

        let dbPutResult;
        try{
            dbPutResult = await dynamoDB.putItem({
                Item: {
                    id: {
                        S: user.developerId,
                    }, 
                    email: {
                        S: user.email
                    },
                    displayName: {
                        S: user.displayName,
                    },
                    products: {
                        L: productsList,
                    },
                    roles: {
                        L: rolesList,
                    },
                    preferences: {
                        L: preferencesList,
                    }
                  }, 
                  ReturnConsumedCapacity: "TOTAL", 
                  TableName: process.env.USER_TABLE_NAME
                }).promise();
                  
            console.log('dbPutResult:', dbPutResult)
        }
        catch (e)
        {
            console.log(e)
        }

      return {
          statusCode: 200,
          headers: { "Content-Type": "text/plain" },
          isBase64Encoded: false,
          body: 'dbPutResult : ' + dbPutResult
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

const wrapAsArray = (item, options = {}) => {

    const {
        allowUndefined = false,
        allowNull = false,
    } = options;

    if (Array.isArray(item)) return item;

    if (!allowUndefined && item === undefined) return[];

    if (!allowNull && item === null) return[];

    return [item];
};
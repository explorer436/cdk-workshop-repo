# Welcome to your CDK TypeScript project!

You should explore the contents of this project. It demonstrates a CDK app with an instance of a stack (`EmployeeCdkStack`)
which contains an Amazon SQS queue that is subscribed to an Amazon SNS topic.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template

## Setup for running the app

You will need the following:

    1. AWS CLI (look at the documentation or the included pdf file)
    2. AWS Account and User (look at the documentation or the included pdf file)
       To use them with the CDK application, run 'aws configure'.
       We have to provide the following:
       aws_access_key_id (IAM)
       aws_secret_access_key (IAM)
       region
       default output format (json/text/yaml)
    3. Node.js
    4. IDE for your programming language
    5. AWS CDK Toolkit
       To install AWS CDK Toolkit globally using Node Package Manager : npm install -g aws-cdk
       
## TODO

Set up directions for working with AWS SAM in local machines.

## Issues And Tips

[n0281526@VDDP14P-I9AGJD5 aws-user-service]$ cdk synth
A newer version of the CDK CLI (>= 2.0.0) is necessary to interact with this app

well to anybody having the came issue there is a cdk command in package.json for a reason. Just use that since it will always be inline with your local cdk version ie: yarn cdk synth

## Outstanding questions

Can the schema of a NoSQL table be updated later? If so, can the data be migrated into the new table?


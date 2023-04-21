# To perform cost analysis on our AWS account using AWS Cost Explorer in AWS Lambda with Node JS

## Pre-requisites

- [Make](https://www.gnu.org/software/make/)
- [Visual Studio Code](https://code.visualstudio.com/download)
- [NPM](https://www.npmjs.com) 
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) - v2


## Extensions

If you are using visual studio code environment install the below extensions

1. Start git-bash

## Usage

Clone the repo and then simply add your related details in  `MakeFile` and then run the follwoing commands:

```Make build```

```Make package```

```Make create_stack```

If you dont have s3 buckets , then first execute the below command to create s3 bucket to store the artifacts

```Make create_bucket```

For sending mail , i have configured the mail id in AWS SES. If you have any other option , you can make use of that also. 

## Image

![MailImage](https://github.com/karthickcse05/aws-cost-explorer/blob/master/img/mail.png)

## Future Changes

Integrating with Slack / Microsoft Teams.

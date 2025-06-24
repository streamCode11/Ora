import SES from "aws-sdk/clients/ses.js"
const AWS_ACCESS_KEY_ID = "AKIARXBTA5YVHPLH76HY";
const AWS_SECRET_ACCES_KEY = "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";
const AWS_REGION = "us-east-1";
const AWS_VERSION = "2010-12-01";

export const sender_email = "Ora.com <mshahzad19333@gmail.com>";

const AWSconfig = {
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCES_KEY,
  region: AWS_REGION,
  version: AWS_VERSION,
};

export const AWSSES = new SES(AWSconfig);


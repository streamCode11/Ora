import SES from "aws-sdk/clients/ses.js"
const AWS_ACCESS_KEY_ID = "AKIATXEYQD4M6VLHIZ7V";
const AWS_SECRET_ACCES_KEY = "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";
const AWS_REGION = "us-east-1";
const AWS_VERSION = "2010-12-01";

export const sender_email = "Ora.com <hammadshahzad13@gmail.com>";

const AWSconfig = {
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCES_KEY,
  region: AWS_REGION,
  version: AWS_VERSION,
};

export const AWSSES = new SES(AWSconfig);


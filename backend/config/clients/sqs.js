import dotenvFlow from 'dotenv-flow';
import { SQSClient } from '@aws-sdk/client-sqs';

dotenvFlow.config();

export const sqs = new SQSClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION,
});


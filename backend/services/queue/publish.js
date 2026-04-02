import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { sqs } from '../../config/index.js';

// Publishes a draft job to SQS so the worker can process it asynchronously
export const publishDraftJob = async ({ prompt, posterUrl, contextUrl }) => {
  const command = new SendMessageCommand({
    QueueUrl: process.env.AWS_DRAFT_QUEUE_URL,
    MessageBody: JSON.stringify({ prompt, posterUrl, contextUrl }),
  });

  await sqs.send(command);
};

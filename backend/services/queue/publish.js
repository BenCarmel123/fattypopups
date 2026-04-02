import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { sqs } from '../../config/index.js';

export const publishDraftJob = async ({ prompt, posterUrl, contextUrl }) => {
  const command = new SendMessageCommand({
    QueueUrl: process.env.SQS_DRAFT_QUEUE_URL,
    MessageBody: JSON.stringify({ prompt, posterUrl, contextUrl }),
  });

  await sqs.send(command);
};
